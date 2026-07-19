const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const { parseTranslateFile } = require("./parser");

/**
 * 打开描述编辑表单（Webview）
 * @param {vscode.ExtensionContext} context
 * @param {CharacterItem|SkillItem|CardItem} item
 * @param {NonameTreeDataProvider} provider
 */
async function openDescriptionForm(context, item, provider) {
    const panel = vscode.window.createWebviewPanel(
        "nonameDescriptionForm",
        `编辑描述：${item.displayName}`,
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true,
        }
    );

    const translateFile = await findTranslateFile(item);
    const translates = translateFile ? await parseTranslateFile(translateFile) : {};

    const nameKey = item.id;
    const infoKey = `${item.id}_info`;

    const currentName = translates[nameKey] || item.displayName || item.id;
    const currentDescription = translates[infoKey] || item.description || "";

    panel.webview.html = getDescriptionFormHtml(item, currentName, currentDescription);

    panel.webview.onDidReceiveMessage(
        async (message) => {
            if (message.command === "save") {
                try {
                    await saveDescription(item, message.name, message.description);
                    provider.refresh();
                    vscode.window.showInformationMessage(`${item.displayName} 的描述已更新`);
                    panel.dispose();
                } catch (err) {
                    vscode.window.showErrorMessage("保存描述失败: " + err.message);
                }
            }
            if (message.command === "cancel") {
                panel.dispose();
            }
        },
        undefined,
        context.subscriptions
    );
}

/**
 * 查找 item 对应的 translate.js 文件路径
 */
async function findTranslateFile(item) {
    const sameDir = path.join(path.dirname(item.filePath), "translate.js");
    if (fs.existsSync(sameDir)) return sameDir;

    const typeDir = item.type === "card" ? "card" : "character";
    const rootDir = path.join(item.extension.path, typeDir, "translate.js");
    if (fs.existsSync(rootDir)) return rootDir;

    return sameDir;
}

/**
 * 保存名称和描述到 translate.js
 */
async function saveDescription(item, name, description) {
    const translateFile = await findTranslateFile(item);
    const dir = path.dirname(item.filePath);

    if (!fs.existsSync(translateFile)) {
        await fs.promises.mkdir(dir, { recursive: true });
        await fs.promises.writeFile(
            translateFile,
            `const translate = {\n};\n\nexport default translate;\n`,
            "utf8"
        );
    }

    let content = await fs.promises.readFile(translateFile, "utf8");

    content = upsertTranslateEntry(content, item.id, name);
    content = upsertTranslateEntry(content, `${item.id}_info`, description);

    await fs.promises.writeFile(translateFile, content, "utf8");
}

/**
 * 在 translate.js 文本中插入或替换一个键值对
 */
function upsertTranslateEntry(content, key, value) {
    const escapedValue = escapeString(value);
    const keyRegex = new RegExp(`^(\\s*)${escapeRegExp(key)}\\s*:\\s*"[^"]*"\\s*,?\\s*$`, "m");

    if (keyRegex.test(content)) {
        return content.replace(keyRegex, `$1${key}: "${escapedValue}",`);
    }

    const lastBrace = content.lastIndexOf("}");
    const entry = `    ${key}: "${escapedValue}",\n`;
    if (lastBrace === -1) {
        return content + entry;
    }
    return content.slice(0, lastBrace) + entry + content.slice(lastBrace);
}

function escapeString(value) {
    return value
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r");
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getDescriptionFormHtml(item, name, description) {
    const typeLabel =
        item.type === "character" ? "武将" : item.type === "card" ? "卡牌" : "技能";

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>编辑描述</title>
    <style>
        body { font-family: var(--vscode-font-family); padding: 20px; color: var(--vscode-foreground); }
        h2 { margin-top: 0; }
        .form-group { margin-bottom: 16px; }
        label { display: block; margin-bottom: 6px; font-weight: bold; }
        input[type="text"], textarea {
            width: 100%;
            box-sizing: border-box;
            padding: 8px;
            background: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            border-radius: 4px;
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
        }
        textarea { min-height: 160px; resize: vertical; }
        .meta { color: var(--vscode-descriptionForeground); font-size: 12px; margin-bottom: 20px; }
        .actions { display: flex; gap: 10px; margin-top: 20px; }
        button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        .primary { background: var(--vscode-button-background); color: var(--vscode-button-foreground); }
        .secondary { background: var(--vscode-button-secondaryBackground); color: var(--vscode-button-secondaryForeground); }
    </style>
</head>
<body>
    <h2>编辑${typeLabel}描述</h2>
    <div class="meta">ID: ${escapeHtml(item.id)}</div>

    <div class="form-group">
        <label for="name">名称</label>
        <input type="text" id="name" value="${escapeHtml(name)}" />
    </div>

    <div class="form-group">
        <label for="description">描述</label>
        <textarea id="description">${escapeHtml(description)}</textarea>
    </div>

    <div class="actions">
        <button class="primary" id="saveBtn">保存</button>
        <button class="secondary" id="cancelBtn">取消</button>
    </div>

    <script>
        const vscode = acquireVsCodeApi();

        function escapeHtml(text) {
            return String(text)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }

        document.getElementById("saveBtn").addEventListener("click", () => {
            const name = document.getElementById("name").value;
            const description = document.getElementById("description").value;
            vscode.postMessage({ command: "save", name, description });
        });

        document.getElementById("cancelBtn").addEventListener("click", () => {
            vscode.postMessage({ command: "cancel" });
        });
    </script>
</body>
</html>`;
}

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

module.exports = {
    openDescriptionForm,
};
