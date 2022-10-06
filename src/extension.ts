import { commands, ExtensionContext } from 'vscode'
import { spatialDocsPanel } from './panels/spatialDocs'

export function activate(context: ExtensionContext) {
  // Create the show hello world command
  const showOpenDocsCommand = commands.registerCommand(
    'spatial-docs.open',
    () => {
      spatialDocsPanel(context)
    },
  )

  // Add command to the extension context
  context.subscriptions.push(showOpenDocsCommand)
}
