'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vscode = require('vscode');
var node = require('vscode-languageclient/node');

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var vscode__namespace = /*#__PURE__*/_interopNamespace(vscode);

let client;
function activate(context) {
    // The server is implemented in node
    const serverModule = vscode__namespace.Uri.joinPath(context.extensionUri, 'node_modules', 'lsp-sample-server', 'dist', 'index.js').fsPath;
    // The debug options for the server
    // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
    const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };
    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    const serverOptions = {
        run: { module: serverModule, transport: node.TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: node.TransportKind.ipc,
            options: debugOptions
        }
    };
    // Options to control the language client
    const clientOptions = {
        // Register the server for plain text documents
        documentSelector: [{ scheme: 'file', language: 'plaintext' }],
        synchronize: {
            // Notify the server about file changes to '.clientrc files contained in the workspace
            fileEvents: vscode__namespace.workspace.createFileSystemWatcher('**/.clientrc')
        }
    };
    // Create the language client and start the client.
    client = new node.LanguageClient('languageServerExample', 'Language Server Example', serverOptions, clientOptions);
    console.log(clientOptions);
    console.log(serverOptions);
    // Start the client. This will also launch the server
    client.start();
}
function deactivate() {
    if (!client) {
        return undefined;
    }
    return client.stop();
}

exports.activate = activate;
exports.deactivate = deactivate;
//# sourceMappingURL=index.js.map
