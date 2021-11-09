module.exports = {
    default: function(context) {
        return {
            plugin: function(markdownIt, options) {

								function render(tokens, idx, _options, env, self) {
									console.log("render",tokens, idx, _options, env, self);

									//return self.renderToken(tokens, idx, _options, env, self)
									return "<div>Hello World</div>";
								}

								function fence(state, startLine, endLine) {
									console.log("fence",state,startLine,endLine);

									let iLineStart = state.bMarks[startLine] + state.tShift[startLine]
									let iLineEnd = state.eMarks[startLine]
									console.log("content",state.src.slice(iLineStart,iLineEnd));



									let pos = state.bMarks[startLine] + state.tShift[startLine]
									//console.log(state.src.charCodeAt(pos),'`'.charCodeAt(0))
									if(state.src.charCodeAt(pos) !== '`'.charCodeAt(0)){
										return false;
									}

									let len = state.sCount[startLine]

									let nextLine = startLine
									state.line = nextLine + 1

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
								console.log("Markdown it",markdownIt);


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
