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
				<p><a href="#" onclick="${postMessageWithResponseTest.replace(/\n/g, ' ')}">Refresh</a></p>
				<style onload="${postMessageWithResponseTest.replace(/\n/g, ' ')}"></style>
			</div>
		`;
	}

	export async function bindMessage(pJoplin){
		const joplin = pJoplin;
		const onMessage = async function (bMessage:any){
			const message = JSON.parse(atob(bMessage));
			console.log("MyMessage:",message);

			if(message.type === "html"){
				let uiOptions = {};
				uiOptions["noteOnClick"] = function(note){
					let message = {};
					message["type"] = "opennote";
					message["noteid"] = note.id;
					const uiOpt = btoa(JSON.stringify(message));
					const callMessage = `
						webviewApi.postMessage('${contentScriptId}', '${uiOpt}').then(function(response) { });
						return false;
					`;
					return callMessage;
					//return "alert('Click: "+note.id+"')";
				}
				const response = await MyPlugin.getHTMLCode(joplin, message.options,uiOptions);
				//const response = await MyPlugin.getHTMLCode(options);
				return response;
			}
			if(message.type === "opennote"){
				console.log("Open note",message.noteid);
				joplin.commands.execute('openNote', message.noteid);
				return {};
			}
		}
		await joplin.contentScripts.onMessage(contentScriptId,onMessage);
	}
}
