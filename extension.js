const vscode = require("vscode");
const { NonameTreeDataProvider } = require("./src/treeProvider");
const { registerCommands } = require("./src/commands");
const { scanAllExtensions } = require("./src/scanner");

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
    try {
        console.log("[noname-extension-helper] activate 开始");

        await updateWorkspaceContext();
        console.log("[noname-extension-helper] updateWorkspaceContext 完成");

        const treeProvider = new NonameTreeDataProvider();

        const treeView = vscode.window.createTreeView("nonameExtensions", {
            treeDataProvider: treeProvider,
            showCollapseAll: true,
        });
        console.log("[noname-extension-helper] createTreeView 完成");

        registerCommands(context, treeProvider);
        console.log("[noname-extension-helper] registerCommands 完成");

        watchExtensionChanges(context, treeProvider);
        console.log("[noname-extension-helper] watchExtensionChanges 完成");

        context.subscriptions.push(treeView);

        // 初始刷新一次
        await treeProvider.refresh();
        console.log("[noname-extension-helper] treeProvider.refresh 完成");

        // 工作区变化时重新检测
        context.subscriptions.push(
            vscode.workspace.onDidChangeWorkspaceFolders(async () => {
                await updateWorkspaceContext();
                treeProvider.refresh();
            })
        );

        vscode.window.showInformationMessage("无名杀扩展助手已激活");
    } catch (err) {
        console.error("[noname-extension-helper] activate 异常:", err);
        vscode.window.showErrorMessage("无名杀扩展助手激活失败: " + err.message + "\n" + err.stack);
    }
}

async function updateWorkspaceContext() {
    try {
        const folders = vscode.workspace.workspaceFolders;
        if (!folders || folders.length === 0) {
            console.log("[noname-extension-helper] 无工作区");
            vscode.commands.executeCommand("setContext", "workspaceHasNonameExtension", false);
            return;
        }

        const config = vscode.workspace.getConfiguration("nonameExtensionHelper");
        const extensionDir = config.get("extensionDir", "extension");
        console.log("[noname-extension-helper] 检测扩展目录:", extensionDir);

        for (const folder of folders) {
            console.log("[noname-extension-helper] 扫描工作区:", folder.uri.fsPath);
            const exts = await scanAllExtensions(folder.uri.fsPath, extensionDir);
            console.log("[noname-extension-helper] 发现扩展数:", exts.length);
            if (exts.length > 0) {
                vscode.commands.executeCommand("setContext", "workspaceHasNonameExtension", true);
                return;
            }
        }

        vscode.commands.executeCommand("setContext", "workspaceHasNonameExtension", false);
    } catch (err) {
        console.error("[noname-extension-helper] 检测扩展失败:", err);
        vscode.commands.executeCommand("setContext", "workspaceHasNonameExtension", false);
        throw err; // 让 activate 捕获并显示
    }
}

function watchExtensionChanges(context, provider) {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders) return;

    const config = vscode.workspace.getConfiguration("nonameExtensionHelper");
    const extensionDir = config.get("extensionDir", "extension");

    for (const folder of folders) {
        const dirPattern = new vscode.RelativePattern(
            folder.uri.fsPath,
            `${extensionDir}/*`
        );
        const dirWatcher = vscode.workspace.createFileSystemWatcher(dirPattern);
        dirWatcher.onDidCreate(() => provider.refresh());
        dirWatcher.onDidDelete(() => provider.refresh());

        const filePattern = new vscode.RelativePattern(
            folder.uri.fsPath,
            `${extensionDir}/**/*.{js,json}`
        );
        const fileWatcher = vscode.workspace.createFileSystemWatcher(filePattern);
        fileWatcher.onDidChange(() => provider.refresh());
        fileWatcher.onDidCreate(() => provider.refresh());
        fileWatcher.onDidDelete(() => provider.refresh());

        context.subscriptions.push(dirWatcher, fileWatcher);
    }
}

function deactivate() {
    // 无需清理
}

module.exports = {
    activate,
    deactivate,
};
