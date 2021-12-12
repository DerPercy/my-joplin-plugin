export module MyPluginMethods {

	// Object validators

	// >> Tag: required: id, title
	export function isValidTagObject(obj, options = {}){
		if (!('id' in obj)){
			return false;
		}
		if (!('title' in obj)){
			return false;
		}
		return true;
	}

	// Array validator (Could not validate empty arrays!!!)
	export function isValidArray(fObjCheck, objArray, options = {}){
		if(!Array.isArray(objArray)){
			console.log("Is no array");
			return false;
		}
		for(let obj of objArray){
			if(!fObjCheck(obj,options)){
				return false;
			}
		}
		return true;
	}


	export function initColumns(optColumns){
		let cols = [];
		for(let i=0; i<optColumns.length;i++){
			cols.push([]);
		}
		return cols;
	}


	/** Get the columns, in which the note needs to be displayed
	* optColumns: Liste mit den Column Options
	* noteTags: [{id,title},...]
	* <= [1,3,4,5]
	*/
	export function getNoteColumns(columns,optColumns,noteTags, skipEmptyCols = false){
		//throw new Error("This is an error");
		let cols = [];
		for(let i=0; i<columns.length;i++){
			let col = columns[i];
			if(col.tag){
				for(let tag of noteTags){
					if(tag.title === col.tag){
						cols.push(i);
					}
				}
			} else { // col.tag not defined
				if(!skipEmptyCols){
					let namedColumns = getNoteColumns(optColumns,optColumns,noteTags, true);
					if(namedColumns.length == 0){ // is not in a column with a tag
						cols.push(i);
					}
				}
			}
		}
		return cols;
	}

	/* Get
	*
	*/
	export function getTablesFromOptions(options){
		let tableIds = [];
		let tables = [];
		tables.push({});
		for(let column of options.columns){
			if(column.table){
				if(!tableIds.includes(column.table)){
					tables.push({ id: column.table });
					tableIds.push(column.table);
				}
			}
		}
		return tables;
	}

	export function getColumnsOfTable(options,table){
		let columns = [];
		for(let col of options.columns){
			if(col.table === table.id){ // could also be undefined
				columns.push(col);
			}
		}
		return columns;
	}

	// ========== date and time functions ========== //
	export function getTimeDiff(timeInMillis, anchor = Date.now()){
		let overdue = false;
		let diff = 0;
		if( timeInMillis > anchor){
			overdue = true;
			diff = timeInMillis - anchor;
		} else {
			diff = anchor - timeInMillis;
		}
		let ui = "";
		let retDays = 0;
		if (diff < 1000) {
			ui = diff+" ms";
		}else {
			let seconds = (diff / 1000) | 0;
			ui = seconds + " sec";
			if(seconds > 60){
				let min = seconds / 60 | 0;
				seconds = seconds % 60;
				ui = min +" min "+ seconds + " sec";
				if(min > 60){
					let hours = min / 60 | 0;
					min = min % 60;
					ui = hours + " hours " + min + " min";
					if( hours > 24){
						let days = hours / 24 | 0;
						retDays = days;
						hours = hours % 24;
						ui = days + " days " + hours + " hours ";
					}
				}
			}
		}
		return {
			ui: ui,
			days: retDays,
			overdue: overdue
		}
	}
}
