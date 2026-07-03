const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const { parseExtension } = require("./parser");

const GROUPS = [
    ["wei", "魏"],
    ["shu", "蜀"],
    ["wu", "吴"],
    ["qun", "群"],
    ["jin", "晋"],
    ["western", "西"],
    ["key", "键"],
    ["shen", "神"],
];

const SEXES = [
    ["male", "男"],
    ["female", "女"],
    ["double", "双性"],
    ["none", "无"],
];

/**
 * 打开创建武将的 Webview 表单
 */
async function openCharacterForm(context, extension, provider) {
    const parsed = await parseExtension(extension);
    const skills = parsed.skills.map(s => ({ id: s.id, name: s.displayName }));

    const panel = vscode.window.createWebviewPanel(
        "nonameCharacterForm",
        `创建武将 - ${extension.name}`,
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true,
        }
    );

    panel.webview.html = getFormHtml(extension, skills, null);

    panel.webview.onDidReceiveMessage(
        async (message) => {
            if (message.command === "submit") {
                try {
                    await createCharacterFromForm(extension, message.data);
                    provider.refresh();
                    vscode.window.showInformationMessage(`武将 ${message.data.displayName || message.data.id} 创建成功`);
                    panel.dispose();
                } catch (err) {
                    vscode.window.showErrorMessage("创建武将失败: " + err.message);
                }
            }
        },
        undefined,
        context.subscriptions
    );
}

/**
 * 打开编辑武将的 Webview 表单
 */
async function openCharacterEditor(context, character, provider) {
    const parsed = await parseExtension(character.extension);
    const skills = parsed.skills.map(s => ({ id: s.id, name: s.displayName }));

    const panel = vscode.window.createWebviewPanel(
        "nonameCharacterForm",
        `编辑武将 - ${character.displayName}`,
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true,
        }
    );

    panel.webview.html = getFormHtml(character.extension, skills, character);

    panel.webview.onDidReceiveMessage(
        async (message) => {
            if (message.command === "submit") {
                try {
                    await editCharacterFromForm(character, message.data);
                    provider.refresh();
                    vscode.window.showInformationMessage(`武将 ${message.data.displayName || message.data.id} 已更新`);
                    panel.dispose();
                } catch (err) {
                    vscode.window.showErrorMessage("更新武将失败: " + err.message);
                }
            }
        },
        undefined,
        context.subscriptions
    );
}

async function createCharacterFromForm(extension, data) {
    const characterDir = path.join(extension.path, "character");
    if (!fs.existsSync(characterDir)) {
        await fs.promises.mkdir(characterDir, { recursive: true });
    }

    const id = data.id;
    const charObj = buildCharacterObject(data);

    // 处理头像
    if (data.avatarBase64) {
        const avatarInfo = parseBase64(data.avatarBase64);
        if (avatarInfo) {
            const imageDir = path.join(extension.path, "image", "character");
            if (!fs.existsSync(imageDir)) {
                await fs.promises.mkdir(imageDir, { recursive: true });
            }
            const imagePath = path.join(imageDir, `${id}.${avatarInfo.ext}`);
            await fs.promises.writeFile(imagePath, avatarInfo.buffer);
            charObj.img = `image/character/${id}.${avatarInfo.ext}`;
        }
    }

    // 处理阵亡音频
    if (data.dieAudioBase64) {
        const audioInfo = parseBase64(data.dieAudioBase64);
        if (audioInfo) {
            const audioDir = path.join(extension.path, "audio", "die");
            if (!fs.existsSync(audioDir)) {
                await fs.promises.mkdir(audioDir, { recursive: true });
            }
            const audioPath = path.join(audioDir, `${id}.${audioInfo.ext}`);
            await fs.promises.writeFile(audioPath, audioInfo.buffer);
            charObj.dieAudios = [`ext:audio/die/${id}.${audioInfo.ext}`];
        }
    }

    // 写入 character.js
    const characterFile = path.join(characterDir, "character.js");
    const charEntry = buildCharacterEntry(id, charObj);
    await appendObjectEntry(characterFile, charEntry, `const characters = {\n};\n\nexport default characters;\n`);

    // 写入 translate.js
    const translateFile = path.join(characterDir, "translate.js");
    const translateEntry = `    ${id}: "${data.displayName}",\n    ${id}_info: "${data.description || ""}",\n`;
    await appendObjectEntry(translateFile, translateEntry, `const translate = {\n};\n\nexport default translate;\n`);

    // 确保 index.js 存在
    await ensureIndexJs(characterDir);

    // 写入称号
    if (data.title) {
        await updateTitleEntry(characterDir, id, data.title);
    }
}

async function editCharacterFromForm(character, data) {
    const extension = character.extension;
    const characterDir = path.join(extension.path, "character");
    const id = character.id;

    const charObj = buildCharacterObject(data);

    // 保留原有图片/音频路径，除非上传了新的
    if (data.avatarBase64) {
        const avatarInfo = parseBase64(data.avatarBase64);
        if (avatarInfo) {
            const imageDir = path.join(extension.path, "image", "character");
            if (!fs.existsSync(imageDir)) {
                await fs.promises.mkdir(imageDir, { recursive: true });
            }
            const imagePath = path.join(imageDir, `${id}.${avatarInfo.ext}`);
            await fs.promises.writeFile(imagePath, avatarInfo.buffer);
            charObj.img = `image/character/${id}.${avatarInfo.ext}`;
        }
    } else if (character.img) {
        charObj.img = character.img;
    }

    if (data.dieAudioBase64) {
        const audioInfo = parseBase64(data.dieAudioBase64);
        if (audioInfo) {
            const audioDir = path.join(extension.path, "audio", "die");
            if (!fs.existsSync(audioDir)) {
                await fs.promises.mkdir(audioDir, { recursive: true });
            }
            const audioPath = path.join(audioDir, `${id}.${audioInfo.ext}`);
            await fs.promises.writeFile(audioPath, audioInfo.buffer);
            charObj.dieAudios = [`ext:audio/die/${id}.${audioInfo.ext}`];
        }
    } else if (character.dieAudios) {
        charObj.dieAudios = character.dieAudios;
    }

    // 替换 character.js 中的对象
    const characterFile = path.join(characterDir, "character.js");
    const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(characterFile));
    const range = findPropertyRange(doc, id);
    if (!range) throw new Error("无法定位武将对象");

    const edit = new vscode.WorkspaceEdit();
    edit.replace(doc.uri, range, buildCharacterEntry(id, charObj));
    const success = await vscode.workspace.applyEdit(edit);
    if (!success) throw new Error("替换武将对象失败");
    await doc.save();

    // 更新称号
    await updateTitleEntry(characterDir, id, data.title);

    // 更新 translate.js
    await updateTranslateEntry(characterDir, id, data.displayName, data.description);
}

function buildCharacterObject(data) {
    let hp = data.hp || "4";
    let maxHp = null;
    let hujia = null;

    if (["Infinity", "∞", "无限"].includes(hp)) {
        hp = Infinity;
    } else if (hp.includes("/")) {
        const parts = hp.split("/");
        hp = parseInt(parts[0]) || 1;
        maxHp = parseInt(parts[1]) || hp;
    } else {
        hp = parseInt(hp) || 1;
    }

    const charObj = {
        sex: data.sex || "male",
        group: data.group || "qun",
        hp,
        skills: data.skills || [],
    };

    if (maxHp !== null) charObj.maxHp = maxHp;
    if (hujia !== null) charObj.hujia = hujia;

    if (data.isZhugong) charObj.isZhugong = true;
    if (data.isBoss) {
        charObj.isBoss = true;
        charObj.isBossAllowed = true;
    }
    if (data.isAiForbidden) charObj.isAiForbidden = true;
    if (data.hasHiddenSkill) charObj.hasHiddenSkill = true;

    if (data.description) {
        charObj.trashBin = [`des:${data.description}`];
    }

    return charObj;
}

function buildCharacterEntry(id, charObj) {
    const entry = `    ${id}: ${JSON.stringify(charObj, (key, value) => {
        if (value === Infinity) return "Infinity";
        return value;
    }, 4).replace(/\n/g, "\n    ")},\n`;
    return entry.replace(/": "Infinity"/g, '": Infinity');
}

async function updateTranslateEntry(characterDir, id, displayName, description) {
    const translateFile = path.join(characterDir, "translate.js");
    if (!fs.existsSync(translateFile)) {
        await fs.promises.writeFile(translateFile, `const translate = {\n};\n\nexport default translate;\n`, "utf8");
    }

    const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(translateFile));
    const text = doc.getText();

    const nameRegex = new RegExp(`\\s*${escapeRegex(id)}\\s*:\\s*["\`].*?["\`],?\\n`, "g");
    const infoRegex = new RegExp(`\\s*${escapeRegex(id)}_info\\s*:\\s*["\`].*?["\`],?\\n`, "g");

    let newText = text;
    const nameEntry = `    ${id}: "${displayName}",\n`;
    const infoEntry = `    ${id}_info: "${description || ""}",\n`;

    if (nameRegex.test(text)) {
        newText = newText.replace(nameRegex, nameEntry);
    } else {
        newText = appendBeforeLastBrace(newText, nameEntry);
    }

    if (infoRegex.test(newText)) {
        newText = newText.replace(infoRegex, infoEntry);
    } else {
        newText = appendBeforeLastBrace(newText, infoEntry);
    }

    const edit = new vscode.WorkspaceEdit();
    edit.replace(doc.uri, new vscode.Range(doc.positionAt(0), doc.positionAt(text.length)), newText);
    await vscode.workspace.applyEdit(edit);
    await doc.save();
}

function appendBeforeLastBrace(content, entry) {
    const lastBrace = content.lastIndexOf("}");
    if (lastBrace === -1) return content + entry;
    return content.slice(0, lastBrace) + entry + content.slice(lastBrace);
}

function parseBase64(base64String) {
    const match = base64String.match(/^data:(\w+)\/(\w+);base64,(.+)$/);
    if (!match) return null;
    return {
        mimeType: match[1],
        ext: match[2],
        buffer: Buffer.from(match[3], "base64"),
    };
}

async function appendObjectEntry(filePath, entry, defaultContent) {
    if (!fs.existsSync(filePath)) {
        await fs.promises.writeFile(filePath, defaultContent, "utf8");
    }

    const content = await fs.promises.readFile(filePath, "utf8");
    const lastBrace = content.lastIndexOf("}");
    if (lastBrace === -1) {
        await fs.promises.appendFile(filePath, entry, "utf8");
        return;
    }

    const newContent = content.slice(0, lastBrace) + entry + content.slice(lastBrace);
    await fs.promises.writeFile(filePath, newContent, "utf8");
}

async function ensureIndexJs(characterDir) {
    const indexFile = path.join(characterDir, "index.js");
    if (!fs.existsSync(indexFile)) {
        const content = `import character from "./character.js";
import skill from "./skill.js";
import translate from "./translate.js";
import characterTitle from "./title.js";

export default function () {
    return {
        character,
        characterTitle,
        skill,
        translate,
    };
}
`;
        await fs.promises.writeFile(indexFile, content, "utf8");
        return;
    }

    // 如果 index.js 已存在但没有导入 title.js，则补全
    const content = await fs.promises.readFile(indexFile, "utf8");
    if (content.includes("characterTitle") || content.includes("title.js")) return;

    let newContent = content;
    if (!newContent.includes('import characterTitle from "./title.js"')) {
        newContent = newContent.replace(
            /import translate from "\.\/translate\.js";?\n/,
            'import translate from "./translate.js";\nimport characterTitle from "./title.js";\n'
        );
    }
    if (!newContent.includes("characterTitle,")) {
        newContent = newContent.replace(
            /character:\s*\{[^}]*\},?\n/,
            match => match + "        characterTitle: { ...characterTitle },\n"
        );
    }
    if (newContent !== content) {
        await fs.promises.writeFile(indexFile, newContent, "utf8");
    }
}
async function updateTitleEntry(characterDir, id, title) {
    await ensureIndexJs(characterDir);
    const titleFile = path.join(characterDir, "title.js");
    if (!fs.existsSync(titleFile)) {
        await fs.promises.writeFile(
            titleFile,
            `const characterTitle = {
};

export default characterTitle;
`,
            "utf8"
        );
    }

    const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(titleFile));
    const text = doc.getText();

    const titleRegex = new RegExp(`\s*${escapeRegex(id)}\s*:\s*["\`].*?["\`],?\n`, "g");
    const titleEntry = `    ${id}: "${title || ""}",
`;

    let newText;
    if (titleRegex.test(text)) {
        newText = text.replace(titleRegex, titleEntry);
    } else {
        newText = appendBeforeLastBrace(text, titleEntry);
    }

    const edit = new vscode.WorkspaceEdit();
    edit.replace(doc.uri, new vscode.Range(doc.positionAt(0), doc.positionAt(text.length)), newText);
    await vscode.workspace.applyEdit(edit);
    await doc.save();
}


/**
 * 找到对象属性的完整范围（从 key 开始到后面的逗号/换行）
 */
function findPropertyRange(doc, id) {
    const text = doc.getText();
    const regex = new RegExp(`([\\s\\S]*?)\\b${escapeRegex(id)}\\s*:\\s*\\{`);
    const match = regex.exec(text);
    if (!match) return null;

    const keyStart = match.index + match[1].length;
    const braceStart = text.indexOf("{", keyStart);
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

    let end = braceEnd + 1;
    while (end < text.length && /[\\s,]/.test(text[end])) {
        end++;
    }

    let start = keyStart;
    while (start > 0 && /[ \\t]/.test(text[start - 1])) {
        start--;
    }

    const startPos = doc.positionAt(start);
    const endPos = doc.positionAt(end);
    return new vscode.Range(startPos, endPos);
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getFormHtml(extension, skills, character) {
    const isEdit = !!character;
    const title = isEdit ? `编辑武将 - ${escapeHtml(character.displayName)}` : `创建武将 - ${escapeHtml(extension.name)}`;

    // 预填充数据
    const nameValue = isEdit
        ? (character.displayName === character.id ? character.id : `${character.id}|${character.displayName}`)
        : "";
    const hpValue = isEdit ? buildHpString(character) : "4";
    const sexValue = isEdit ? (character.sex || "male") : "male";
    const groupValue = isEdit ? (character.group || "qun") : "qun";
    const descriptionValue = isEdit ? (character.description || "") : "";
    const titleValue = isEdit ? (character.title || "") : "";
    const selectedSkills = isEdit ? (character.skills || []) : [];
    const isZhugong = isEdit && character.isZhugong ? "checked" : "";
    const isBoss = isEdit && character.isBoss ? "checked" : "";
    const isAiForbidden = isEdit && character.isAiForbidden ? "checked" : "";
    const hasHiddenSkill = isEdit && character.hasHiddenSkill ? "checked" : "";

    const groupOptions = GROUPS.map(([value, label]) =>
        `<option value="${value}" ${value === groupValue ? "selected" : ""}>${label}</option>`
    ).join("");
    const sexOptions = SEXES.map(([value, label]) =>
        `<option value="${value}" ${value === sexValue ? "selected" : ""}>${label}</option>`
    ).join("");
    const initialData = isEdit ? JSON.stringify({
        id: character.id,
        displayName: character.displayName,
        description: character.description || "",
        title: character.title || "",
        hp: hpValue,
        sex: sexValue,
        group: groupValue,
        skills: selectedSkills,
        isZhugong: !!character.isZhugong,
        isBoss: !!character.isBoss,
        isAiForbidden: !!character.isAiForbidden,
        hasHiddenSkill: !!character.hasHiddenSkill,
    }) : "null";

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif;
            padding: 20px;
            color: var(--vscode-foreground);
            background: var(--vscode-editor-background);
            max-width: 600px;
        }
        h2 { margin-top: 0; }
        .form-group {
            margin-bottom: 16px;
        }
        label {
            display: block;
            margin-bottom: 4px;
            font-size: 13px;
            color: var(--vscode-descriptionForeground);
        }
        input[type="text"], select, textarea {
            width: 100%;
            padding: 6px 8px;
            font-size: 14px;
            background: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            box-sizing: border-box;
        }
        select[multiple] {
            min-height: 120px;
        }
        .hint {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
            margin-top: 2px;
        }
        .options {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
        }
        .options label {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 13px;
            color: var(--vscode-foreground);
        }
        .file-row {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .file-name {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
        }
        .actions {
            margin-top: 24px;
            display: flex;
            gap: 8px;
        }
        button {
            padding: 8px 20px;
            font-size: 14px;
            cursor: pointer;
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
        }
        button:hover {
            background: var(--vscode-button-hoverBackground);
        }
        button.secondary {
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }
        .skill-picker {
            display: flex;
            gap: 12px;
        }
        .skill-list-box {
            flex: 1;
            border: 1px solid var(--vscode-input-border);
            background: var(--vscode-input-background);
            min-height: 140px;
            display: flex;
            flex-direction: column;
        }
        .skill-list-title {
            font-size: 12px;
            padding: 6px 8px;
            color: var(--vscode-descriptionForeground);
            border-bottom: 1px solid var(--vscode-input-border);
            background: var(--vscode-editor-background);
        }
        .skill-list {
            flex: 1;
            overflow-y: auto;
            padding: 4px 0;
        }
        .skill-item {
            padding: 6px 10px;
            cursor: pointer;
            font-size: 13px;
            user-select: none;
        }
        .skill-item:hover {
            background: var(--vscode-list-hoverBackground);
        }
        .skill-empty {
            padding: 10px;
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
            text-align: center;
        }
    </style>
</head>
<body>
    <h2>${isEdit ? "编辑武将" : "创建武将"}</h2>
    <div class="form-group">
        <label for="name">姓名</label>
        <input type="text" id="name" value="${escapeHtml(nameValue)}" placeholder="id|中文名，如 zy_sunhanhua|孙寒华" ${isEdit ? "disabled" : ""}>
        <div class="hint">格式：id|中文名。${isEdit ? "编辑时不可修改 ID。" : "若省略中文名，则显示为 id。"}</div>
    </div>
    <div class="form-group">
        <label for="hp">体力</label>
        <input type="text" id="hp" value="${escapeHtml(hpValue)}" placeholder="如 4、3/4、∞">
        <div class="hint">可输入数字、体/限（如 3/4）、∞ 或 Infinity。</div>
    </div>
    <div class="form-group">
        <label for="sex">性别</label>
        <select id="sex">${sexOptions}</select>
    </div>
    <div class="form-group">
        <label for="group">势力</label>
        <select id="group">${groupOptions}</select>
    </div>
    <div class="form-group">
        <label>技能</label>
        <div class="skill-picker">
            <div class="skill-list-box">
                <div class="skill-list-title">可选技能（双击添加）</div>
                <div id="availableSkills" class="skill-list"></div>
            </div>
            <div class="skill-list-box">
                <div class="skill-list-title">已选技能（双击移除）</div>
                <div id="selectedSkills" class="skill-list"></div>
            </div>
        </div>
    </div>
    <div class="form-group">
        <label for="title">称号（可选）</label>
        <input type="text" id="title" value="${escapeHtml(titleValue)}" placeholder="如 青丝慧剑、勤学苦练">
        <div class="hint">会保存到 title.js 的 characterTitle 中，支持 #g/#b 等颜色前缀。</div>
    </div>
    <div class="form-group">
        <label for="description">介绍</label>
        <textarea id="description" rows="3" placeholder="武将背景介绍">${escapeHtml(descriptionValue)}</textarea>
    </div>
    <div class="form-group">
        <label>头像</label>
        <div class="file-row">
            <input type="file" id="avatar" accept="image/*">
            <span class="file-name" id="avatarName">${isEdit && character.img ? "已有图片，选择新文件可替换" : "未选择文件"}</span>
        </div>
        <div class="hint">会自动保存为 image/character/{id}.{ext}</div>
    </div>
    <div class="form-group">
        <label>阵亡配音</label>
        <div class="file-row">
            <input type="file" id="dieAudio" accept="audio/*">
            <span class="file-name" id="dieAudioName">${isEdit && character.dieAudios ? "已有音频，选择新文件可替换" : "未选择文件"}</span>
        </div>
        <div class="hint">会自动保存为 audio/die/{id}.{ext}</div>
    </div>
    <div class="form-group">
        <label>选项</label>
        <div class="options">
            <label><input type="checkbox" id="isZhugong" ${isZhugong}> 主公</label>
            <label><input type="checkbox" id="isBoss" ${isBoss}> BOSS</label>
            <label><input type="checkbox" id="isAiForbidden" ${isAiForbidden}> 仅点将可用</label>
            <label><input type="checkbox" id="hasHiddenSkill" ${hasHiddenSkill}> 隐匿技</label>
        </div>
    </div>
    <div class="actions">
        <button id="submitBtn">${isEdit ? "保存" : "创建"}</button>
        <button id="cancelBtn" class="secondary">取消</button>
    </div>
    <script>
        const vscode = acquireVsCodeApi();
        const initialData = ${initialData};

        function readFileAsBase64(file) {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(file);
            });
        }

        // 技能双列表选择逻辑
        const allSkills = ${JSON.stringify(skills.map(s => ({ id: s.id, name: s.name })))};
        const initialSelectedIds = initialData ? initialData.skills || [] : [];
        let selectedSkillIds = [...initialSelectedIds];

        function renderSkillLists() {
            const availableContainer = document.getElementById("availableSkills");
            const selectedContainer = document.getElementById("selectedSkills");

            const availableSkills = allSkills.filter(s => !selectedSkillIds.includes(s.id));

            availableContainer.innerHTML = availableSkills.length
                ? availableSkills.map(s => `<div class="skill-item" data-id="${escapeHtml(s.id)}">${escapeHtml(s.name)} (${escapeHtml(s.id)})</div>`).join("")
                : '<div class="skill-empty">暂无可选技能</div>';

            selectedContainer.innerHTML = selectedSkillIds.length
                ? selectedSkillIds.map(id => {
                    const s = allSkills.find(x => x.id === id);
                    return `<div class="skill-item" data-id="${escapeHtml(id)}">${escapeHtml(s ? s.name : id)} (${escapeHtml(id)})</div>`;
                }).join("")
                : '<div class="skill-empty">双击上方技能添加到此处</div>';

            availableContainer.querySelectorAll(".skill-item").forEach(item => {
                item.addEventListener("dblclick", () => {
                    selectedSkillIds.push(item.dataset.id);
                    renderSkillLists();
                });
            });

            selectedContainer.querySelectorAll(".skill-item").forEach(item => {
                item.addEventListener("dblclick", () => {
                    selectedSkillIds = selectedSkillIds.filter(id => id !== item.dataset.id);
                    renderSkillLists();
                });
            });
        }

        renderSkillLists();

        document.getElementById("avatar").addEventListener("change", function () {
            const file = this.files[0];
            document.getElementById("avatarName").textContent = file ? file.name : (initialData ? "已有图片，选择新文件可替换" : "未选择文件");
        });

        document.getElementById("dieAudio").addEventListener("change", function () {
            const file = this.files[0];
            document.getElementById("dieAudioName").textContent = file ? file.name : (initialData ? "已有音频，选择新文件可替换" : "未选择文件");
        });

        document.getElementById("submitBtn").addEventListener("click", async () => {
            const nameValue = document.getElementById("name").value.trim();
            if (!nameValue) {
                alert("请填写姓名");
                return;
            }

            const nameParts = nameValue.split("|");
            const id = initialData ? initialData.id : nameParts[0];
            const displayName = nameParts[1] || id;

            if (!id) {
                alert("ID 不能为空");
                return;
            }

            const selectedSkillItems = document.querySelectorAll("#selectedSkills .skill-item");
            const selectedSkills = Array.from(selectedSkillItems).map(item => item.dataset.id);

            const avatarFile = document.getElementById("avatar").files[0];
            const dieAudioFile = document.getElementById("dieAudio").files[0];

            const data = {
                id,
                displayName,
                hp: document.getElementById("hp").value.trim(),
                sex: document.getElementById("sex").value,
                group: document.getElementById("group").value,
                skills: selectedSkills,
                description: document.getElementById("description").value.trim(),
                title: document.getElementById("title").value.trim(),
                isZhugong: document.getElementById("isZhugong").checked,
                isBoss: document.getElementById("isBoss").checked,
                isAiForbidden: document.getElementById("isAiForbidden").checked,
                hasHiddenSkill: document.getElementById("hasHiddenSkill").checked,
            };

            if (avatarFile) {
                data.avatarBase64 = await readFileAsBase64(avatarFile);
            }
            if (dieAudioFile) {
                data.dieAudioBase64 = await readFileAsBase64(dieAudioFile);
            }

            vscode.postMessage({
                command: "submit",
                data,
            });
        });

        document.getElementById("cancelBtn").addEventListener("click", () => {
            vscode.postMessage({ command: "cancel" });
        });
    </script>
</body>
</html>`;
}

function buildHpString(character) {
    if (character.hp === Infinity) return "∞";
    if (character.maxHp !== undefined && character.maxHp !== null) {
        return `${character.hp}/${character.maxHp}`;
    }
    return String(character.hp || 4);
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
    openCharacterForm,
    openCharacterEditor,
};
