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
	export function getNoteColumns(optColumns,noteTags, skipEmptyCols = false){
		//throw new Error("This is an error");
		let cols = [];
		for(let i=0; i<optColumns.length;i++){
			let col = optColumns[i];
			if(col.tag){
				for(let tag of noteTags){
					if(tag.title === col.tag){
						cols.push(i);
					}
				}
			} else { // col.tag not defined
				if(!skipEmptyCols){
					let namedColumns = getNoteColumns(optColumns,noteTags, true);
					if(namedColumns.length == 0){ // is not in a column with a tag
						cols.push(i);
					}
				}
			}
		}
		return cols;
	}
}
