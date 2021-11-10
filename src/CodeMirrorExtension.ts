import { Editor } from "codemirror";



module.exports = {
	default: function(_context: any) {

		const plugin = function(CodeMirror) {
			console.info("CodeMirrorExtension.js");
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

			});
		}

		return {
			plugin: plugin,
		}
	}
}
