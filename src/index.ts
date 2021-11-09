import joplin from 'api';
import { ContentScriptType, MenuItemLocation } from 'api/types';

joplin.plugins.register({
	onStart: async function() {
		console.info('Hello world. Test plugin started!');
		joplin.contentScripts.register(ContentScriptType.CodeMirrorPlugin, "myCMPlugin", "./CodeMirrorExtension.js");
		joplin.contentScripts.register(ContentScriptType.MarkdownItPlugin, "myMIPlugin", "./MarkdownItExtension.js");
		//joplin.contentScripts.register(ContentScriptType.CodeMirrorPlugin, "MyCMPluginTwo", "./CodeMirrorExtensionTS.js");
		joplin.commands.register({
			name: 'myCMPlugin',
			label: 'Format Table My',
			execute: async () => {
				await joplin.commands.execute('editor.execCommand', { name: 'myCMPlugin', });
			}
		});
		joplin.views.menuItems.create("Format Table My", "myCMPlugin", MenuItemLocation.Edit);
		joplin.views.menuItems.create("Format Table Context My", "myCMPlugin", MenuItemLocation.EditorContextMenu);
	},
});
