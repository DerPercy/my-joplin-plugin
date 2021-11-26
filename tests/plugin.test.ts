import { MyPluginMethods } from '../src/MyPluginMethods';


let optColumns = [
	{ label: "Backlog", table: "backlog"},
	{ label: "Next", tag: "task.next" },
	{ label: "Doing", tag: "task.doing" },
	{ label: "Waiting for", tag: "task.wait", table: "other" },
	{ label: "In test", tag: "task.intest", table: "other" },
	{ label: "Done", tag: "task.done" },
];

let options = {
	columns: optColumns
};

test('determine correct kanban columns', () => {
	let noteTags = [{id: "a", title: "task.next"},{id: "b", title: "other task"}];
	expect(MyPluginMethods.getNoteColumns(optColumns,optColumns,noteTags)).toStrictEqual([1]);
	// Handle notes without a matching tag
	noteTags = [{id: "b", title: "other task"}];
	expect(MyPluginMethods.getNoteColumns(optColumns,optColumns,noteTags)).toStrictEqual([0]);
});

test('determine tables correctly', () => {
	const tables = MyPluginMethods.getTablesFromOptions(options);
	//console.log(tables);
	expect(tables.length).toBe(3); // 3 tables: "","backlog","other"
	let columns = MyPluginMethods.getColumnsOfTable(options,tables[0]);
	expect(columns.length).toBe(3); // 3 columns: "next","doing","done"
	columns = MyPluginMethods.getColumnsOfTable(options,tables[1]);
	expect(columns.length).toBe(1); // 1 column: "backlog"
});

test('setup columns correctly', () => {
	expect(MyPluginMethods.initColumns(optColumns)).toStrictEqual([[],[],[],[],[],[]]);
});


test('validators correctly', () => {
	//expect(MyPluginMethods.isValidArray(MyPluginMethods.isValidTagObject,optColumns)).toBe(true);
	//expect(MyPluginMethods.isValidArray(MyPluginMethods.isValidTagObject,optColumns[0])).toBe(false);
});
