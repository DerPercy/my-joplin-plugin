const yaml = require('js-yaml');
import { MyPlugin } from './MyPlugin';

export module KanbanModule {
	export const id = "kanban";
	export const selector = "mykanban";
	export const contentScriptId = "myMIPlugin";
	export function render(tokens, idx, _options, env, self) {
		let doc = {};
		try {
			doc = yaml.load(tokens[idx].content);
			//console.log(doc);
		} catch (e) {
			return '<pre>'+e.message+'</pre>';
		}
		//return self.renderToken(tokens, idx, _options, env, self)
		//MyPlugin.PluginClass.getInstance();
		const uiOpt = btoa(JSON.stringify(doc));

		const postMessageWithResponseTest = `
			webviewApi.postMessage('${contentScriptId}', '${uiOpt}').then(function(response) {
				console.info('Got response in Markdown-it content script: ' + response);
				document.getElementById('abcdef1234').innerHTML = response;
			});
			return false;
		`;
		return `
			<div>
				<div id="abcdef1234"></div>
				<p><a href="#" onclick="${postMessageWithResponseTest.replace(/\n/g, ' ')}">Read/Update</a></p>
			</div>
		`;
	}

	export async function bindMessage(pJoplin){
		const joplin = pJoplin;
		const onMessage = async function (message:any){
			const options = JSON.parse(atob(message));
			const response = await MyPlugin.getHTMLCode(joplin, options);
			//const response = await MyPlugin.getHTMLCode(options);
			return response;
		}
		await joplin.contentScripts.onMessage(contentScriptId,onMessage);
	}
}
