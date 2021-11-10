import joplin from 'api';
import { ContentScriptType, MenuItemLocation  } from 'api/types';
import { MyPlugin } from './MyPlugin.ts';


joplin.plugins.register({
	onStart: async function() {
		console.info('Hello world. Test plugin started!');
		//joplin.contentScripts.register(ContentScriptType.CodeMirrorPlugin, "myCMPlugin", "./CodeMirrorExtension.js");
		joplin.contentScripts.register(ContentScriptType.MarkdownItPlugin, "myMIPlugin", "./MarkdownItExtension.js");

		/*joplin.commands.register({
			name: 'myCMPlugin',
			label: 'Format Table My',
			execute: async () => {
				await joplin.commands.execute('editor.execCommand', { name: 'myCMPlugin', });
			}
		});
		joplin.views.menuItems.create("Format Table My", "myCMPlugin", MenuItemLocation.Edit);
		joplin.views.menuItems.create("Format Table Context My", "myCMPlugin", MenuItemLocation.EditorContextMenu);*/

		await joplin.contentScripts.onMessage("myMIPlugin", async (message:any) => {
			const options = JSON.parse(atob(message));

			//console.info('PostMessagePlugin (MD ContentScript): Got message:', message);
			//const response = message + '+responseFromMdContentScriptHandler';
			const response = await MyPlugin.getHTMLCode(options);
			//console.info('PostMessagePlugin (MD ContentScript): Responding with:', response);
			return response;
		});

		joplin.workspace.onNoteChange(async ({ id }) => {
			console.info("oNC",id);
			//MyPlugin.update();
			//MyPlugin.PluginClass.getInstance();
		});
	},
});
