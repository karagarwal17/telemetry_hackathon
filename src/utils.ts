import * as vscode from 'vscode';

export function readSelectedCode() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const selectedText = editor.document.getText(editor.selection);
        return selectedText;
    } else {
        vscode.window.showErrorMessage('No code selected.');
        return null;
    }
}
