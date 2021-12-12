//import joplin from 'api';
import { MyPluginMethods } from './MyPluginMethods';

export module MyPlugin {

	export async function getHTMLCode(joplin, options, uiOptions){
		let html = "";
		try{
			const folders = await joplin.data.get(['folders']);
			console.log("Folders",folders);
			const tags = await joplin.data.get(['tags']);
			if(!MyPluginMethods.isValidArray(MyPluginMethods.isValidTagObject,tags.items)){
				return '<div>Tags in invalid format(E#15)</div>';
			}
			let tagid;
			for(let tag of tags.items){
				if(tag.title == options.filterTag){
					tagid = tag.id;
				}
			}
			if(!tagid){
				return "No items tagged with:"+options.filterTag;
			}
			//console.log("Tags",tags);

			const notes = await joplin.data.get(['tags',tagid,'notes']);
			console.log("Notes",notes);

			const tables = MyPluginMethods.getTablesFromOptions(options);
			for(let table of tables){
				html += "<table>";
				html += "<tr>";
				let columns = MyPluginMethods.getColumnsOfTable(options,table);
				for(let col of columns){ // Header
					html += "<th>"+col.label;
					if(col.tag){
						html += "<br>("+col.tag+")";
					}
					html += "</th>";
				}
				html += "</tr>";
				html += "<tr>";
				const matrix = await buildMatrix(joplin,notes,columns,options.columns);
				for(let col of matrix){ // Content
					html += "<td style='vertical-align:top'>";
					for(let note of col.items){
						html += await renderNote(joplin, note, uiOptions,col.options);
					}
					html += "</td>";
				}
				html += "</tr>";
				html += "</table>";
			}
			html += "<div>"+notes.items.length+" notes</div>";
		}catch(err){
			console.error(err);
			html = "Error:"+err;
		}
		return html;
	}
}

/**
columns: The columns, displayed in the table
optColumns: all columns
returns [[{id:...},{},...],[...],...]
*/
async function buildMatrix(joplin,notes,columns,optColumns){
	console.log("OC",optColumns);
	let matrix = MyPluginMethods.initColumns(columns);
	for(let i=0; i< matrix.length;i++){
		matrix[i].items = [];
		matrix[i].options = columns[i];
	}
	for(let note of notes.items){
		console.log("Note",note);
		const noteTags = await joplin.data.get(['notes',note.id,'tags']);
		console.log("Tags",noteTags);
		let colArray = MyPluginMethods.getNoteColumns(columns,optColumns, noteTags.items);
		console.log("Columns",colArray);

		for(let colIndex of colArray){
			matrix[colIndex].items.push(note);
		}
	}
	console.log("Matrix:",matrix);
	return matrix;
	//return [notes.items,[],[],[]];
}

async function renderNote(joplin, note, uiOptions,colOption){
	const notedata = await joplin.data.get(['notes',note.id],{ fields: ['id', 'title','is_todo','todo_due','todo_completed', 'updated_time'] });
	/*
	{	...
    "is_todo": 1/0,
    "todo_due": 0/1638385200000,
    "todo_completed": 0/1638385200000,
		"updated_time": 0/1638385200000,
    ...
	}
	*/
	console.log("Render note",notedata);

	if(colOption.hideAfterXDaysDone && Number.isInteger(colOption.hideAfterXDaysDone)){
		if(notedata.todo_completed != 0){ // 0 = not completed
			const timeInfoCompleted = MyPluginMethods.getTimeDiff(notedata.todo_completed);
			if(timeInfoCompleted.days >= colOption.hideAfterXDaysDone){
				return ""; // => did not show the note
			}
		}
	}

	const onClick = uiOptions.noteOnClick(note).replace(/\n/g, ' ');

	let uiCompleted = "";
	if(notedata.todo_completed != 0){ // 0 = not completed
		const timeInfoCompleted = MyPluginMethods.getTimeDiff(notedata.todo_completed);
		uiCompleted = "<div style='font-style: italic;'>Done since "+timeInfoCompleted.ui+" </div>";
	}

	let uiUpdated = "";
	if(colOption.maxUnupdatedDaysTreshold && Number.isInteger(colOption.maxUnupdatedDaysTreshold)){
		if(notedata.updated_time != 0){ // 0 = not updated
			const timeInfoUpdated = MyPluginMethods.getTimeDiff(notedata.updated_time);
			if(timeInfoUpdated.days >= colOption.maxUnupdatedDaysTreshold){
				//uiUpdated = "<div style='color:red;font-style: italic;'>😴Last updated "+timeInfoUpdated.ui+" ago</div>";
				uiUpdated = "<span title='Last updated "+timeInfoUpdated.ui+" ago'>😴</span>";
			}
		}
	}


	return `
		<div style='padding:10px; margin-bottom: 10px; border: 1px solid; border-radius: 7px; cursor:pointer;' title="${notedata.title}" onClick="${onClick}">
			<div style='font-weight:bold;'>${notedata.title}</div>
			${uiCompleted}
			${uiUpdated}
		</div>
	`;
}
