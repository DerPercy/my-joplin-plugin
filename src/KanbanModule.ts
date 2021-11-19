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
		doc["type"] = "abc";
		let message = {};
		message["options"] = doc;
		message["type"] = "html";
		console.log("Message:",message);

		const uiOpt = btoa(JSON.stringify(message));

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
		const onMessage = async function (bMessage:any){
			const message = JSON.parse(atob(bMessage));
			console.log("MyMessage:",message);
			const response = await MyPlugin.getHTMLCode(joplin, message.options);
			//const response = await MyPlugin.getHTMLCode(options);
			return response;
		}
		await joplin.contentScripts.onMessage(contentScriptId,onMessage);
	}
}
