// Import the necessary modules
import * as vscode from "vscode";
import { readSelectedCode } from "./utils";
import * as childProcess from "child_process";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Register a command that uses readSelectedCode
  let disposable = vscode.commands.registerCommand(
    "telemetry-openai.addTelemetry",
    async () => {

      // let promptInput = await vscode.window.showInputBox({
      //   prompt: "Enter the telemetry prompt:",
      //   placeHolder: "Telemetry prompt",
      // });

     const promptInput= "modify the following code to add telemetery keeping the code intact in the response."

      // if (!promptInput) {
      //   vscode.window.showErrorMessage("No telemetry prompt entered.");
      //   return;
      // }

      const prompt = promptInput;
      // Get the selected code
      const selectedCode = readSelectedCode();
	  //vscode.window.showInformationMessage("Selected code000: " + (selectedCode));
      if (selectedCode!=null) {
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
            } else {
              vscode.window.showErrorMessage("No active text editor found.");
            }
          }
          vscode.window.showInformationMessage("Telemetry added successfully.");
        });

        pythonProcess.stderr.on("data", (data) => {
          vscode.window.showErrorMessage(
            "Error from Python script: " + data.toString()
          );
        });

        pythonProcess.on("close", (code) => {
          if (code !== 0) {
            vscode.window.showErrorMessage(
              "Python script exited with error code " + code
            );
          }
        });
	//	vscode.window.showInformationMessage("Selected code: " + selectedCode);
        vscode.window.showInformationMessage("Please wait while telemetry is being added.");
        //vscode.window.showInformationMessage("Python script path: " + pythonScriptPath);
      } else {
        vscode.window.showErrorMessage("No code selected.");
      }
    }
  );
  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
