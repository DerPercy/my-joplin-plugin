import joplin from 'api';
import { ContentScriptType, MenuItemLocation  } from 'api/types';
import { MyPlugin } from './MyPlugin.ts';
import {KanbanModule} from './KanbanModule.ts';


joplin.plugins.register({
	onStart: async function() {
		//joplin.contentScripts.register(ContentScriptType.CodeMirrorPlugin, "myCMPlugin", "./CodeMirrorExtension.js");
		joplin.contentScripts.register(ContentScriptType.MarkdownItPlugin, "myMIPlugin", "./MarkdownItExtension.js");
		await KanbanModule.bindMessage(joplin);
	},
});
