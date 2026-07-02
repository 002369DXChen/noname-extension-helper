const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const os = require("os");

const tempFileMap = new Map();
const lastSaveReason = new Map();

/**
 * 获取插件内置类型声明文件路径
 */
function getTypingsPath() {
    return path.join(__dirname, "..", "typings", "noname-skill.d.ts").replace(/\\/g, "/");
}

/**
 * 在 VS Code 普通文本编辑器中打开对象片段
 * @param {vscode.ExtensionContext} context
 * @param {NonameItem} item
 * @param {NonameTreeDataProvider} provider
 */
async function openItemInTextEditor(context, item, provider) {
    const originalUri = vscode.Uri.file(item.filePath);
    const originalDoc = await vscode.workspace.openTextDocument(originalUri);
    const range = findObjectRange(originalDoc, item.line, item.column);
    if (!range) {
        vscode.window.showErrorMessage("无法定位对象范围");
        return;
    }

    const originalText = originalDoc.getText(range);

    // 创建临时文件
    const tempDir = path.join(os.tmpdir(), "noname-extension-helper");
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    const safeId = item.id.replace(/[^a-zA-Z0-9_]/g, "_");
    const fileName = `${safeId}_${item.type}.js`;
    const tempPath = path.join(tempDir, fileName);

    let tempText = originalText;
    let wrapper = null;

    // 对技能对象注入类型提示
    if (item.type === "skill" && fs.existsSync(getTypingsPath())) {
        const typingsPath = getTypingsPath();
        tempText = `// @ts-check
/// <reference path="${typingsPath}" />
/** @type {Skill} */
const __noname_skill = ${originalText};
export default __noname_skill;
`;
        wrapper = {
            prefix: `// @ts-check\n/// <reference path="${typingsPath}" />\n/** @type {Skill} */\nconst __noname_skill = `,
            suffix: `;\nexport default __noname_skill;\n`,
        };
    }

    fs.writeFileSync(tempPath, tempText, "utf8");

    const tempUri = vscode.Uri.file(tempPath);
    const tempDoc = await vscode.workspace.openTextDocument(tempUri);
    await vscode.window.showTextDocument(tempDoc, {
        preview: false,
        viewColumn: vscode.ViewColumn.One,
    });

    tempFileMap.set(tempUri.toString(), {
        originalUri,
        range,
        provider,
        wrapper,
    });
}

function registerTempFileHandlers(context) {
    // 记录保存原因（手动/自动）
    context.subscriptions.push(
        vscode.workspace.onWillSaveTextDocument((event) => {
            lastSaveReason.set(event.document.uri.toString(), event.reason);
        })
    );

    // 保存临时文件时，仅在手动保存时写回原文件
    context.subscriptions.push(
        vscode.workspace.onDidSaveTextDocument(async (doc) => {
            const key = doc.uri.toString();
            const info = tempFileMap.get(key);
            if (!info) return;

            const reason = lastSaveReason.get(key);
            lastSaveReason.delete(key);

            // 只处理手动保存（Ctrl+S），跳过自动保存
            if (reason !== vscode.TextDocumentSaveReason.Manual) {
                return;
            }

            let newText = doc.getText();
            if (info.wrapper) {
                newText = unwrapObject(newText, info.wrapper);
                if (newText === null) {
                    vscode.window.showErrorMessage("无法解析临时文件内容，请保留原始对象结构");
                    return;
                }
            }

            const originalDoc = await vscode.workspace.openTextDocument(info.originalUri);
            const edit = new vscode.WorkspaceEdit();
            edit.replace(info.originalUri, info.range, newText);

            const success = await vscode.workspace.applyEdit(edit);
            if (success) {
                // 重新加载原文件并更新对象范围
                const savedOriginalDoc = await vscode.workspace.openTextDocument(info.originalUri);
                const startOffset = savedOriginalDoc.offsetAt(info.range.start);
                const endOffset = startOffset + newText.length;
                info.range = new vscode.Range(
                    info.range.start,
                    savedOriginalDoc.positionAt(endOffset)
                );

                await savedOriginalDoc.save();
                info.provider.refresh();
                vscode.window.showInformationMessage("已保存到原文件");
            } else {
                vscode.window.showErrorMessage("保存失败");
            }
        })
    );

    // 关闭临时文件时清理
    context.subscriptions.push(
        vscode.workspace.onDidCloseTextDocument((doc) => {
            const key = doc.uri.toString();
            if (tempFileMap.has(key)) {
                tempFileMap.delete(key);
                lastSaveReason.delete(key);
                try {
                    fs.unlinkSync(doc.uri.fsPath);
                } catch (e) {
                    // 忽略清理错误
                }
            }
        })
    );
}

/**
 * 剥离临时文件中的类型包装，返回原始对象文本
 * @param {string} text
 * @param {{prefix: string, suffix: string}} wrapper
 * @returns {string | null}
 */
function unwrapObject(text, wrapper) {
    if (!text.startsWith(wrapper.prefix)) return null;
    if (!text.endsWith(wrapper.suffix)) return null;
    return text.slice(wrapper.prefix.length, text.length - wrapper.suffix.length);
}

/**
 * 根据对象起始位置，查找完整的对象范围（匹配大括号）
 */
function findObjectRange(doc, startLine, startColumn) {
    const text = doc.getText();
    const startOffset = doc.offsetAt(new vscode.Position(startLine, startColumn));

    let braceStart = -1;
    for (let i = startOffset; i < text.length; i++) {
        if (text[i] === "{") {
            braceStart = i;
            break;
        }
    }
    if (braceStart === -1) return null;

    let braceCount = 1;
    let braceEnd = -1;
    let inString = false;
    let stringChar = null;
    let escaped = false;

    for (let i = braceStart + 1; i < text.length; i++) {
        const ch = text[i];

        if (inString) {
            if (escaped) {
                escaped = false;
            } else if (ch === "\\") {
                escaped = true;
            } else if (ch === stringChar) {
                inString = false;
                stringChar = null;
            }
            continue;
        }

        if (ch === '"' || ch === "'" || ch === "`") {
            inString = true;
            stringChar = ch;
            continue;
        }

        if (ch === "{") {
            braceCount++;
        } else if (ch === "}") {
            braceCount--;
            if (braceCount === 0) {
                braceEnd = i;
                break;
            }
        }
    }

    if (braceEnd === -1) return null;

    const startPos = doc.positionAt(braceStart);
    const endPos = doc.positionAt(braceEnd + 1);
    return new vscode.Range(startPos, endPos);
}

module.exports = {
    openItemInTextEditor,
    registerTempFileHandlers,
};
