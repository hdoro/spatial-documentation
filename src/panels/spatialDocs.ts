import {
  ExtensionContext,
  Uri,
  ViewColumn,
  Webview,
  WebviewPanel,
  window,
  workspace,
  WorkspaceEdit,
  Range,
  Position,
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

    currentPanel.webview.onDidReceiveMessage(
      async (message) => {
        switch (message.type) {
          case 'persist-data':
            persistData({ files: message.files })
            break
          case 'app-ready':
            const storedData = await getStoredData()
            currentPanel?.webview.postMessage({
              type: 'seed-stored-data',
              data: storedData,
            })
            break
          case 'open-file':
            const fileUri = Uri.file(
              `${workspace.workspaceFolders?.[0].uri.path || ''}/${
                message.path
              }`,
            )
            window.showTextDocument(fileUri)
            break
        }
      },
      undefined,
      context.subscriptions,
    )

    currentPanel.webview.html = getWebviewContent(
      currentPanel.webview,
      context.extensionUri,
    )
    currentPanel.title = 'Spatial Docs'

    currentPanel.onDidDispose(
      () => {
        currentPanel = undefined
      },
      null,
      context.subscriptions,
    )
  }
}

async function persistData(data: { files: any[] }) {
  const saveFileUri = Uri.file(
    (workspace.workspaceFolders?.[0].uri.path || '') + '/spatial-docs.json',
  )

  // 1. Start by creating the file
  const wsedit = new WorkspaceEdit()
  wsedit.createFile(saveFileUri, { overwrite: true })
  await workspace.applyEdit(wsedit)

  // 2. Then fetch its TextDocument to figure out the line count
  const storageFileUri = (await workspace.findFiles('spatial-docs.json'))[0]
  const storageFile = await workspace.openTextDocument(storageFileUri)

  // 3. And tell VS Code to replace the entire file, based on the line count
  wsedit.replace(
    saveFileUri,
    new Range(new Position(0, 0), new Position(storageFile.lineCount, 0)),
    JSON.stringify(data, null, 2),
    { needsConfirmation: false, label: 'Saving spatial docs' },
  )
  await workspace.applyEdit(wsedit)

  // 4. Finish by saving the file
  storageFile.save()
}

async function getStoredData() {
  let storedData
  try {
    const storageFileUri = (await workspace.findFiles('spatial-docs.json'))[0]
    const storageFile = await workspace.openTextDocument(storageFileUri)
    storedData = JSON.parse(storageFile.getText())
  } catch (error) {
    console.log("[extension] Stored file doesn't exist. Creating it.", {
      fetchingError: error,
    })
    // @TODO ignore files from .gitignore
    // const gitignore = await workspace.findFiles('.gitignore')
    // const globIgnore = gitignore[0]
    //   ? (await workspace.openTextDocument(gitignore[0])).getText()
    //   : '**/{node_modules,.git}/**'

    const allFiles = (
      await workspace.findFiles('**', '**/{node_modules,.git,studio}/**')
    ).map((file) => {
      const relativePath = file.path
        // Remove absolute path portion
        .replace(workspace.workspaceFolders?.[0].uri.path || '', '')
        // Remove leading slash
        .slice(1)

      return {
        fileId: relativePath,
        filePath: relativePath,
      }
    })

    storedData = {
      files: allFiles,
    }
    await persistData(storedData)
    try {
    } catch (errorCreating) {
      console.log('[extension] Error creating file', errorCreating)
    }
  }

  return storedData
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
