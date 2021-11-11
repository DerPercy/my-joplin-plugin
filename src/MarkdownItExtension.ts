//import { MyPlugin } from './MyPlugin.ts';


module.exports = {
    default: function(context) {
        return {
            plugin: function(markdownIt, options) {
							const contentScriptId = context.contentScriptId;

								function render(tokens, idx, _options, env, self) {

									//console.log("render",tokens, idx, _options, env, self);

									//return self.renderToken(tokens, idx, _options, env, self)
									//MyPlugin.PluginClass.getInstance();
									const uiOpt = btoa(JSON.stringify({
										filterTag: "task",
										columns: [
											{ label: "Backlog"},
											{ label: "Next", tag: "task.next" },
											{ label: "Doing", tag: "task.doing" },
											{ label: "In test", tag: "task.intest" },
											{ label: "Wait", tag: "task.wait" },
											{ label: "Done", tag: "task.done" }
										]
									}));

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



								//	return MyPlugin.getHTMLCode();
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

									for(let i= startLine; i<= endLine; i++){
										state.line = i+1;
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
	 								token.content = state.getLines(startLine + 1, nextLine, len, true)
	 								token.markup = "myMarkup"; // markup
	 								token.map = [startLine, state.line]
	 								return true
									//return true;
								}
								//console.log("Markdown it",markdownIt);


								markdownIt.block.ruler.before('fence', 'myfence', fence, {
	 								alt: ['paragraph', 'reference', 'blockquote', 'list']
								})
								markdownIt.renderer.rules['myfence'] = render
                // ...
            },
            /*assets: {
                // ...
            },*/
        }
    }
}
