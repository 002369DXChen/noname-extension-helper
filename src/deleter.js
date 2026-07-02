const fs = require("fs");
const path = require("path");
const vscode = require("vscode");

/**
 * 删除技能：从 skill.js、translate.js 和武将的 skills 数组中移除
 * @param {NonameExtension} extension
 * @param {string} skillId
 * @returns {Promise<boolean>}
 */
async function deleteSkill(extension, skillId) {
    const characterDir = path.join(extension.path, "character");
    if (!fs.existsSync(characterDir)) return false;

    const skillFile = path.join(characterDir, "skill.js");
    const translateFile = path.join(characterDir, "translate.js");
    const characterFile = path.join(characterDir, "character.js");

    let modified = false;

    // 1. 从 skill.js 删除技能对象
    if (fs.existsSync(skillFile)) {
        modified = (await deletePropertyFromFile(skillFile, skillId)) || modified;
    }

    // 2. 从 translate.js 删除翻译条目
    if (fs.existsSync(translateFile)) {
        modified = (await deleteTranslateEntries(translateFile, skillId)) || modified;
    }

    // 3. 从 character.js 的 skills 数组中移除
    if (fs.existsSync(characterFile)) {
        modified = (await removeSkillFromCharacters(characterFile, skillId)) || modified;
    }

    return modified;
}

/**
 * 从 JS 文件中删除指定属性（key: {...}）
 */
async function deletePropertyFromFile(filePath, id) {
    const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(filePath));
    const text = doc.getText();

    const range = findPropertyRange(doc, id);
    if (!range) return false;

    const edit = new vscode.WorkspaceEdit();
    edit.delete(doc.uri, range);
    const success = await vscode.workspace.applyEdit(edit);
    if (success) {
        await doc.save();
    }
    return success;
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

    // 找到 } 后面的逗号（可选）和空白/换行
    let end = braceEnd + 1;
    while (end < text.length && /[\\s,]/.test(text[end])) {
        end++;
    }

    // 同时删除 key 前面同一行的空白（如果有）
    let start = keyStart;
    while (start > 0 && /[ \\t]/.test(text[start - 1])) {
        start--;
    }

    const startPos = doc.positionAt(start);
    const endPos = doc.positionAt(end);
    return new vscode.Range(startPos, endPos);
}

/**
 * 从 translate.js 删除 id 和 id_info 条目
 */
async function deleteTranslateEntries(filePath, id) {
    const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(filePath));
    const text = doc.getText();

    const lines = text.split("\n");
    let modified = false;

    const idRegex = new RegExp(`^\\s*${escapeRegex(id)}\\s*:`);
    const infoRegex = new RegExp(`^\\s*${escapeRegex(id)}_info\\s*:`);

    const newLines = lines.filter((line) => {
        if (idRegex.test(line) || infoRegex.test(line)) {
            modified = true;
            return false;
        }
        return true;
    });

    if (!modified) return false;

    const newText = newLines.join("\n");
    const edit = new vscode.WorkspaceEdit();
    const fullRange = new vscode.Range(
        doc.positionAt(0),
        doc.positionAt(text.length)
    );
    edit.replace(doc.uri, fullRange, newText);
    const success = await vscode.workspace.applyEdit(edit);
    if (success) {
        await doc.save();
    }
    return success;
}

/**
 * 从 character.js 中所有武将的 skills 数组移除指定技能
 */
async function removeSkillFromCharacters(filePath, skillId) {
    const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(filePath));
    const text = doc.getText();

    const regex = new RegExp(`"${escapeRegex(skillId)}"\\s*,?`, "g");
    let modified = false;

    const newText = text.replace(regex, (match) => {
        modified = true;
        return "";
    });

    // 处理 skills: ["skill"] 移除后变成 skills: [] 的多余逗号
    const cleanedText = newText.replace(/skills:\\s*\\[\\s*,\\s*\\]/g, "skills: []");

    if (!modified) return false;

    const edit = new vscode.WorkspaceEdit();
    const fullRange = new vscode.Range(
        doc.positionAt(0),
        doc.positionAt(text.length)
    );
    edit.replace(doc.uri, fullRange, cleanedText);
    const success = await vscode.workspace.applyEdit(edit);
    if (success) {
        await doc.save();
    }
    return success;
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = {
    deleteSkill,
};
