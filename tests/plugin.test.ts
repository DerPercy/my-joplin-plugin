import { MyPluginMethods } from '../src/MyPluginMethods';


let optColumns = [
	{ label: "Backlog"},
	{ label: "Next", tag: "task.next" },
	{ label: "Doing", tag: "task.doing" },
	{ label: "Done", tag: "task.done" },
];

test('determine correct kanban columns', () => {
	let noteTags = [{id: "a", title: "task.next"},{id: "b", title: "other task"}];
	expect(MyPluginMethods.getNoteColumns(optColumns,noteTags)).toStrictEqual([1]);
	// Handle notes without a matching tag
	noteTags = [{id: "b", title: "other task"}];
	expect(MyPluginMethods.getNoteColumns(optColumns,noteTags)).toStrictEqual([0]);
});

test('setup columns correctly', () => {
	expect(MyPluginMethods.initColumns(optColumns)).toStrictEqual([[],[],[],[]]);
});


test('validators correctly', () => {
	//expect(MyPluginMethods.isValidArray(MyPluginMethods.isValidTagObject,optColumns)).toBe(true);
	//expect(MyPluginMethods.isValidArray(MyPluginMethods.isValidTagObject,optColumns[0])).toBe(false);
});
