const fs = require("fs");
const path = require("path");

/**
 * 扫描指定工作区根目录下的所有扩展
 * @param {string} rootPath 工作区根目录
 * @param {string} extensionDir 扩展目录名，默认 "extension"
 * @returns {Promise<NonameExtension[]>}
 */
async function scanAllExtensions(rootPath, extensionDir = "extension") {
    const extensionRoot = path.join(rootPath, extensionDir);
    if (!fs.existsSync(extensionRoot)) {
        return [];
    }

    const entries = await fs.promises.readdir(extensionRoot, { withFileTypes: true });
    const extensions = [];

    for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const extPath = path.join(extensionRoot, entry.name);
        const extInfo = await scanExtension(extPath, entry.name, rootPath);
        if (extInfo) {
            extensions.push(extInfo);
        }
    }

    // 按扩展名排序
    extensions.sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
    return extensions;
}

/**
 * 扫描单个扩展
 */
async function scanExtension(extPath, name, workspaceRoot) {
    const extensionJsPath = path.join(extPath, "extension.js");
    const infoJsonPath = path.join(extPath, "info.json");

    // 至少要有 extension.js 才算有效扩展
    if (!fs.existsSync(extensionJsPath)) {
        return null;
    }

    const info = fs.existsSync(infoJsonPath)
        ? JSON.parse(await fs.promises.readFile(infoJsonPath, "utf8"))
        : {};

    const isESModule =
        fs.existsSync(path.join(extPath, "main", "precontent.js")) ||
        fs.existsSync(path.join(extPath, "character", "index.js"));

    const hasCharacterDir = fs.existsSync(path.join(extPath, "character"));
    const hasCardDir = fs.existsSync(path.join(extPath, "card"));

    return {
        name: info.name || name,
        dirName: name,
        path: extPath,
        workspaceRoot,
        isESModule,
        hasCharacterDir,
        hasCardDir,
        info,
    };
}

module.exports = {
    scanAllExtensions,
    scanExtension,
};
