/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.readSelectedCode = void 0;
const vscode = __webpack_require__(1);
function readSelectedCode() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const selectedText = editor.document.getText(editor.selection);
        return selectedText;
    }
    else {
        vscode.window.showErrorMessage('No code selected.');
        return null;
    }
}
exports.readSelectedCode = readSelectedCode;


/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("child_process");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
// Import the necessary modules
const vscode = __webpack_require__(1);
const utils_1 = __webpack_require__(2);
const childProcess = __webpack_require__(3);
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Register a command that uses readSelectedCode
    let disposable = vscode.commands.registerCommand("telemetry-openai.addTelemetry", async () => {
        // let promptInput = await vscode.window.showInputBox({
        //   prompt: "Enter the telemetry prompt:",
        //   placeHolder: "Telemetry prompt",
        // });
        const promptInput = "modify the following code to add telemetery keeping the code intact in the response.";
        // if (!promptInput) {
        //   vscode.window.showErrorMessage("No telemetry prompt entered.");
        //   return;
        // }
        const prompt = promptInput;
        // Get the selected code
        const selectedCode = (0, utils_1.readSelectedCode)();
        //vscode.window.showInformationMessage("Selected code000: " + (selectedCode));
        if (selectedCode != null) {
            // Modify the selected code with telemetry
            // const modifiedCode = modify_file_with_prompt(selectedCode, prompt); // Replace with your actual function
            const pythonScriptPath = "C:/Users/karagarwal/Downloads/Co-pilotforTelemetry/Co-pilotforTelemetry/telemetry-openai/src/telemetry_poc.py";
            console.log("Python script path: " + pythonScriptPath);
            //vscode.window.showInformationMessage("Python script path: " + pythonScriptPath);
            const pythonProcess = childProcess.spawn("python", [
                pythonScriptPath,
                "--file_content",
                selectedCode,
                "--prompt",
                prompt,
            ]);
            //vscode.window.showInformationMessage("Python process111: " + pythonProcess);
            pythonProcess.stdout.on("data", (data) => {
                const modifiedCode = data.toString();
                if (vscode.window.activeTextEditor?.selection) {
                    const activeEditor = vscode.window.activeTextEditor;
                    if (activeEditor) {
                        activeEditor.edit((editBuilder) => {
                            // Replace the selected code with the modified code
                            editBuilder.replace(activeEditor.selection, modifiedCode);
                        });
                    }
                    else {
                        vscode.window.showErrorMessage("No active text editor found.");
                    }
                }
                vscode.window.showInformationMessage("Telemetry added successfully.");
            });
            pythonProcess.stderr.on("data", (data) => {
                vscode.window.showErrorMessage("Error from Python script: " + data.toString());
            });
            pythonProcess.on("close", (code) => {
                if (code !== 0) {
                    vscode.window.showErrorMessage("Python script exited with error code " + code);
                }
            });
            //	vscode.window.showInformationMessage("Selected code: " + selectedCode);
            vscode.window.showInformationMessage("Please wait while telemetry is being added.");
            //vscode.window.showInformationMessage("Python script path: " + pythonScriptPath);
        }
        else {
            vscode.window.showErrorMessage("No code selected.");
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=extension.js.map