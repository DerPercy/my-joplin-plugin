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

			html += "<table>";
			html += "<tr>";
			for(let col of options.columns){ // Header
				html += "<th>"+col.label+"<br>("+col.tag+")</th>";
			}
			html += "</tr>";
			html += "<tr>";
			const matrix = await buildMatrix(joplin,notes,options.columns);
			for(let col of matrix){ // Content
				html += "<td style='vertical-align:top'>";
				for(let note of col){
					//const noteTags = await joplin.data.get(['notes',note.id,'tags']);
					//console.log("NoteTags",noteTags);
					html += await renderNote(joplin, note, uiOptions);
				}
				html += "</td>";
			}
			html += "</tr>";
			html += "</table>";
		}catch(err){
			console.error(err);
			html = "Error:"+err;
		}

		return html;
	}
}

/**
returns [[{id:...},{},...],[...],...]
*/
async function buildMatrix(joplin,notes,optColumns){
	console.log("OC",optColumns);
	let matrix = MyPluginMethods.initColumns(optColumns);
	for(let note of notes.items){
		console.log("Note",note);
		const noteTags = await joplin.data.get(['notes',note.id,'tags']);
		console.log("Tags",noteTags);
		let colArray = MyPluginMethods.getNoteColumns(optColumns, noteTags.items);
		console.log("Columns",colArray);

		for(let colIndex of colArray){
			matrix[colIndex].push(note);
		}
	}
	console.log("Matrix:",matrix);
	return matrix;
	//return [notes.items,[],[],[]];
}

async function renderNote(joplin, note, uiOptions){
	const notedata = await joplin.data.get(['notes',note.id]);
	console.log("Render note",notedata);


	const onClick = uiOptions.noteOnClick(note).replace(/\n/g, ' ');


	return `<div style='padding:10px; margin-bottom: 10px; border: 1px solid;cursor:pointer;' onClick="${onClick}">${notedata.title}</div>`;
}
