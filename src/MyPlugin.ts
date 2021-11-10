import joplin from 'api';

export module MyPlugin {
	export async function getHTMLCode(options){
		const folders = await joplin.data.get(['folders']);
		console.log("Folders",folders);
		const tags = await joplin.data.get(['tags']);
		console.log("Tags",tags);

		const notes = await joplin.data.get(['tags',"ecedf7d6250d48e4a81faeaa0da0e74a",'notes']);
		console.log("Notes",notes);
		let html = "";
		html += "<table>";
		html += "<tr>";
		for(let col of options.columns){ // Header
			html += "<th>"+col.label+"<br>("+col.tag+")</th>";
		}
		html += "</tr>";
		html += "<tr>";
		const matrix = buildMatrix(notes);
		for(let col of matrix){ // Content
			html += "<td>";
			for(let note of col){
				html += await renderNote(note);
			}
			html += "</td>";
		}
		html += "</tr>";
		html += "</table>";

		return "<h1>This is my plugin :)-"+notes.items.length+"</h1>"+html;
	}
}

/**
returns [[{id:...},{},...],[...],...]
*/
function buildMatrix(notes){
	return [notes.items,[],[],[]];
}

async function renderNote(note){
	const notedata = await joplin.data.get(['notes',note.id]);
	console.log("Render note",notedata);
	return "<div style='padding:10px; margin-bottom: 10px; border: 1px solid;'>"+notedata.title+"</div>";
}
