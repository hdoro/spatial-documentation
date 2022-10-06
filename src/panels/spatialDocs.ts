import {
  ExtensionContext,
  window,
  WebviewPanel,
  ViewColumn,
  Webview,
  Uri,
} from 'vscode'
import { getUri } from '../utilities/getUri'

let currentPanel: WebviewPanel | undefined = undefined

export function spatialDocsPanel(context: ExtensionContext): void {
  const columnToShowIn = window.activeTextEditor
    ? window.activeTextEditor.viewColumn
    : undefined

  if (currentPanel) {
    // If we already have a panel, show it in the target column
    currentPanel.reveal(columnToShowIn)
  } else {
    // Create and show a new webview
    currentPanel = window.createWebviewPanel(
      'canvasDoc', // Identifies the type of the webview. Used internally
      'Spatial Documentation', // Title of the panel displayed to the user
      columnToShowIn || ViewColumn.One, // Editor column to show the new webview panel in.
      {
        // Enable scripts in the webview
        enableScripts: true,
      },
    )
    if (!currentPanel) {
      return
    }

    currentPanel.webview.html = getWebviewContent(
      currentPanel.webview,
      context.extensionUri,
    )
    currentPanel.title = 'Spatial Docs'

    currentPanel.webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case 'hello':
            window.showInformationMessage(message.text + 'wooo')
            return
        }
      },
      undefined,
      context.subscriptions,
    )

    currentPanel.onDidDispose(
      () => {
        currentPanel = undefined
      },
      null,
      context.subscriptions,
    )
  }
}

function getWebviewContent(webview: Webview, extensionUri: Uri) {
  // The CSS file from the React build output
  const stylesUri = getUri(webview, extensionUri, [
    'webview-ui',
    'build',
    'assets',
    'index.css',
  ])
  // The JS file from the React build output
  const scriptUri = getUri(webview, extensionUri, [
    'webview-ui',
    'build',
    'assets',
    'index.js',
  ])

  // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
  return /*html*/ `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" type="text/css" href="${stylesUri}">
        <title>Hello World</title>
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="${scriptUri}"></script>
      </body>
    </html>
  `
}
