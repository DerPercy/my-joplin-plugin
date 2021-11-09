import { Editor } from "codemirror";

module.exports = {
	default: function(_context: any) {

		const plugin = function(CodeMirror) {
			console.log("CodeMirrorExtension.js");
			/*CodeMirror.defineOption('inlineTags', [], function(cm, value, prev) {
				cm.on('inputRead', function (cm1, change) {
					console.log("change",change)
					if (change.text[0] === '#') {
					}
				});
			});*/

			CodeMirror.defineExtension('myCMPlugin', function() {
				const cm: Editor = this; // to get autocomplete working
				console.log("CodeMirrorExtension.js defineExtension");

				cm.on('inputRead', function (cm1, change) {
					console.log("change",change)
					if (change.text[0] === '#') {
					}
				});

				cm.on('keyHandled', function (instance: Editor, name: string, event: Event) {
					console.log("keyHandled",name, instance.getCursor())

				});

				console.log("CodeMirrorExtension.js - 2");

				/*CodeMirror.defineOption('inlineTags', [], function(cm, value, prev) {
					cm.on('inputRead', function (cm1, change) {
						console.log("change",change)
						if (change.text[0] === '#') {
						}
					});
				});


			/*	const cursor = cm.getCursor();
				let startLine = cursor.line;
				while (startLine >=0 && cm.getLine(startLine).trimStart().charAt(0) === '|') startLine--;
				startLine++;

				let endLine = cursor.line;
				while (!!cm.getLine(endLine) && cm.getLine(endLine).trimStart().charAt(0) === '|') endLine++;

				const table = cm.getRange({line: startLine, ch: 0}, {line: endLine, ch: 0});
				const formatted = CliPrettify.prettify(table);
				cm.replaceRange(formatted, {line: startLine, ch: 0}, {line: endLine, ch: 0})*/
			});
		}

		return {
			plugin: plugin,
		}
	}
}
