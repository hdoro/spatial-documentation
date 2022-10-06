import { commands, ExtensionContext } from "vscode";
import { SpatialDocsPanel } from "./panels/SpatialDocsPanel";

export function activate(context: ExtensionContext) {
  // Create the show hello world command
  const showOpenDocsCommand = commands.registerCommand("spatial-docs.open", () => {
    SpatialDocsPanel.render(context.extensionUri);
  });

  // Add command to the extension context
  context.subscriptions.push(showOpenDocsCommand);
}
