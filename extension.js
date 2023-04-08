const vscode = require('vscode');

const path = require('path');
const fs = require('fs');
const json5 = require('json5');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Congratulations, your extension "preprocess json5" is now active!');

	
	let disposableCompile = vscode.commands.registerCommand('extension.compile', function () {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
					vscode.window.showErrorMessage('No hay ningún archivo abierto.');
					return;
			}

			const document = editor.document;
			if (document.languageId !== 'json5') {
					vscode.window.showErrorMessage('El archivo seleccionado no es un archivo JSON5.');
					return;
			}

			const filePath = document.uri.fsPath;
			const fileDir = path.dirname(filePath);
			const fileBasename = path.basename(filePath, '.json5');
			const outputFilePath = path.join(fileDir, `${fileBasename}.json`);

			const content = document.getText();
			try {
					const jsonObject = json5.parse(content);
					const jsonString = JSON.stringify(jsonObject, null, 2);
					fs.writeFileSync(outputFilePath, jsonString, 'utf-8');
					vscode.window.showInformationMessage(`El archivo JSON5 '${fileBasename}.json5' ha sido compilado en '${fileBasename}.json'.`);
			} catch (error) {
					vscode.window.showErrorMessage(`Ha ocurrido un error al compilar el archivo JSON5 '${fileBasename}.json5': ${error.message}`);
			}
	}); // disposableCompile
	context.subscriptions.push(disposableCompile);


	let watchDisposable;
	let disposableWatch = vscode.commands.registerCommand('extension.watch', function () {
			vscode.window.showOpenDialog({
					canSelectFiles: false,
					canSelectFolders: true,
					canSelectMany: false
			}).then((uri) => {
					if (!uri || uri.length === 0) {
							return;
					}
	
					const folderPath = uri[0].fsPath;
					watchFolder(folderPath);
					vscode.window.showInformationMessage(`La carpeta '${folderPath}' está siendo vigilada.`);
			});
	}); // disposableWatch
	context.subscriptions.push(disposableWatch);
	

	function watchFolder(folderPath) {
			if (watchDisposable) {
					watchDisposable.dispose();
			}
	
			const watcher = vscode.workspace.createFileSystemWatcher(`${folderPath}/**/*.json5`);
			watchDisposable = vscode.Disposable.from(watcher);
	
			watcher.onDidChange((uri) => {
					compileFile(uri.fsPath);
			});
	
			watcher.onDidCreate((uri) => {
					compileFile(uri.fsPath);
			});
	
			watcher.onDidDelete((uri) => {
					deleteFile(uri.fsPath);
			});
	}
	
	function compileFile(filePath) {
			if (!filePath.endsWith('.json5')) {
					return;
			}
	
			const fileBasename = path.basename(filePath, '.json5');
			const outputFilePath = path.join(path.dirname(filePath), `${fileBasename}.json`);
	
			const content = fs.readFileSync(filePath, 'utf-8');
			try {
					const jsonObject = json5.parse(content);
					const jsonString = JSON.stringify(jsonObject, null, 2);
					fs.writeFileSync(outputFilePath, jsonString, 'utf-8');
					vscode.window.showInformationMessage(`El archivo JSON5 '${fileBasename}.json5' ha sido compilado en '${fileBasename}.json'.`);
			} catch (error) {
					vscode.window.showErrorMessage(`Ha ocurrido un error al compilar el archivo JSON5 '${fileBasename}.json5': ${error.message}`);
			}
	}
	
	function deleteFile(filePath) {
			if (!filePath.endsWith('.json5')) {
					return;
			}
	
			const fileBasename = path.basename(filePath, '.json5');
			const outputFilePath = path.join(path.dirname(filePath), `${fileBasename}.json`);
	
			try {
					fs.unlinkSync(outputFilePath);
					vscode.window.showInformationMessage(`El archivo JSON '${fileBasename}.json' ha sido eliminado.`);
			} catch (error) {
					vscode.window.showErrorMessage(`Ha ocurrido un error al eliminar el archivo JSON '${fileBasename}.json': ${error.message}`);
			}
	}
	// disposableWatch end


	let disposableStopWatch = vscode.commands.registerCommand('extension.stopWatch', function () {
    if (watchDisposable) {
        watchDisposable.dispose();
        watchDisposable = null;
        vscode.window.showInformationMessage('Watch ha sido detenido.');
    }
	}); // disposableStopWatch
	context.subscriptions.push(disposableStopWatch);
}


function deactivate() {}


// eslint-disable-next-line no-undef
module.exports = {
	activate,
	deactivate
}
