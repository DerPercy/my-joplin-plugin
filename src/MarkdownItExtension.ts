const yaml = require('js-yaml');

import {KanbanModule} from './KanbanModule.ts';

module.exports = {
	default: function(context) {
		return {
			plugin: function(markdownIt, options) {
				const contentScriptId = context.contentScriptId;
				function render(tokens, idx, _options, env, self) {
					//console.log("render",tokens[idx].content);
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

				function fence(state, startLine, endLine) {
					//console.log("fence",state,startLine,endLine);
					let iLineStart = state.bMarks[startLine] + state.tShift[startLine]
					let iLineEnd = state.eMarks[startLine]
					let lineContent = state.src.slice(iLineStart,iLineEnd);
					//console.log("content",lineContent);
					if(lineContent !== '```myplugin'){
						return false;
					}
					let pos = state.bMarks[startLine] + state.tShift[startLine]
					//console.log(state.src.charCodeAt(pos),'`'.charCodeAt(0))
					/*if(state.src.charCodeAt(pos) !== '`'.charCodeAt(0)){
						return false;
					}*/
					let fenceEndLine = startLine;
					for(let i= startLine; i<= endLine; i++){
						state.line = i+1;
						fenceEndLine = i;
						let iNewLineStart = state.bMarks[i] + state.tShift[i];
						let iNewLineEnd = state.eMarks[i];
						let newLineContent = state.src.slice(iNewLineStart,iNewLineEnd);
						if(newLineContent === '```'){
							break;
						}
					}
					let len = state.sCount[startLine]
					let nextLine = startLine
					//state.line = startLine+1
					let token
					//if (options.validate(params)) token = state.push(name, 'div', 0)
					token = state.push('myfence', 'div', 0)
					//else token = state.push('fence', 'code', 0)
	 				//token.info = params
					token.info = "myParams"
					token.content = state.getLines(startLine + 1, fenceEndLine, len, true)
					token.markup = "myMarkup"; // markup
					token.map = [startLine, state.line]
					return true
				}
				//console.log("Markdown it",markdownIt);
				markdownIt.block.ruler.before('fence', 'myfence', fence, {
					alt: ['paragraph', 'reference', 'blockquote', 'list']
				})
				markdownIt.renderer.rules['myfence'] = render

				extendMarkdownIt(markdownIt,KanbanModule.id, KanbanModule.selector, KanbanModule.render);
			},
		}
	}
}

function extendMarkdownIt(markdownIt,name,selector,renderer){
	const options = {
		selector: selector,
		name: name
	};
	function fence(state, startLine, endLine) {
		let iLineStart = state.bMarks[startLine] + state.tShift[startLine]
		let iLineEnd = state.eMarks[startLine]
		let lineContent = state.src.slice(iLineStart,iLineEnd);
		if(lineContent !== '```'+options.selector){
			return false;
		}
		let pos = state.bMarks[startLine] + state.tShift[startLine]
		let fenceEndLine = startLine;
		for(let i= startLine; i<= endLine; i++){
			state.line = i+1;
			fenceEndLine = i;
			let iNewLineStart = state.bMarks[i] + state.tShift[i];
			let iNewLineEnd = state.eMarks[i];
			let newLineContent = state.src.slice(iNewLineStart,iNewLineEnd);
			if(newLineContent === '```'){
				break;
			}
		}
		let len = state.sCount[startLine]
		let nextLine = startLine
		let token
		token = state.push(options.name, 'div', 0)
		token.info = "myParams"
		token.content = state.getLines(startLine + 1, fenceEndLine, len, true)
		token.markup = "myMarkup"; // markup
		token.map = [startLine, state.line]
		return true
	}
	markdownIt.block.ruler.before('fence', name, fence, {
		alt: ['paragraph', 'reference', 'blockquote', 'list']
	})
	markdownIt.renderer.rules[name] = renderer
}
