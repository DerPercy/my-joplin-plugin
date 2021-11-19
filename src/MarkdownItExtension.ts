const yaml = require('js-yaml');

import {KanbanModule} from './KanbanModule.ts';

module.exports = {
	default: function(context) {
		return {
			plugin: function(markdownIt, options) {
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
