const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const { openItemInTextEditor, registerTempFileHandlers } = require("./textEditor");
const { deleteSkill } = require("./deleter");
const { openCharacterForm, openCharacterEditor } = require("./characterForm");
const { createStandardExtension } = require("./extensionTemplate");
const { exportExtension } = require("./exporter");

/**
 * 注册所有插件命令
 */
function registerCommands(context, provider) {
    // 刷新 TreeView
    context.subscriptions.push(
        vscode.commands.registerCommand("nonameExtensionHelper.refresh", () => {
            provider.refresh();
        })
    );

    // 打开文件并定位到指定行
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "nonameExtensionHelper.openFileAt",
            async (filePath, line = 0, column = 0) => {
                const uri = vscode.Uri.file(filePath);
                const doc = await vscode.workspace.openTextDocument(uri);
                const editor = await vscode.window.showTextDocument(doc);

                const position = new vscode.Position(line, column);
                editor.selection = new vscode.Selection(position, position);
                editor.revealRange(new vscode.Range(position, position), vscode.TextEditorRevealType.InCenter);
            }
        )
    );

    // 注册临时文件保存/关闭监听
    registerTempFileHandlers(context);

    // 导出扩展为 zip
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "nonameExtensionHelper.exportExtension",
            async (node) => {
                const ext = node?.extension;
                if (!ext) return;

                const defaultUri = vscode.Uri.file(
                    path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, `${ext.dirName}.zip`)
                );
                const uri = await vscode.window.showSaveDialog({
                    defaultUri,
                    filters: {
                        "ZIP 文件": ["zip"],
                    },
                    title: "导出扩展",
                });
                if (!uri) return;

                try {
                    await exportExtension(ext.path, uri.fsPath);
                    vscode.window.showInformationMessage(
                        `扩展 "${ext.name}" 已导出到 ${path.basename(uri.fsPath)}`
                    );
                } catch (err) {
                    vscode.window.showErrorMessage("导出扩展失败: " + err.message);
                }
            }
        )
    );

    // 新建扩展
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "nonameExtensionHelper.createExtension",
            async () => {
                const folders = vscode.workspace.workspaceFolders;
                if (!folders || folders.length === 0) {
                    vscode.window.showErrorMessage("请先打开一个工作区");
                    return;
                }

                const workspaceRoot = folders[0].uri.fsPath;

                const extDirName = await vscode.window.showInputBox({
                    prompt: "输入扩展目录名（英文/拼音，如 my_extension）",
                    validateInput: (value) => {
                        if (!value) return "目录名不能为空";
                        if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(value)) return "目录名包含非法字符";
                        return null;
                    },
                });
                if (!extDirName) return;

                const extName = await vscode.window.showInputBox({
                    prompt: "输入扩展显示名称",
                    value: extDirName,
                });
                if (extName === undefined) return;

                const author = await vscode.window.showInputBox({
                    prompt: "输入作者（可选）",
                });
                if (author === undefined) return;

                const version = await vscode.window.showInputBox({
                    prompt: "输入版本号",
                    value: "1.0.0",
                });
                if (version === undefined) return;

                const intro = await vscode.window.showInputBox({
                    prompt: "输入扩展简介（可选）",
                });
                if (intro === undefined) return;

                const includeCard = await vscode.window.showQuickPick(
                    [
                        { label: "否", description: "只创建武将/技能相关结构", value: false },
                        { label: "是", description: "同时创建卡牌目录结构", value: true },
                    ],
                    { placeHolder: "是否同时创建卡牌目录？" }
                );
                if (!includeCard) return;

                try {
                    const extPath = await createStandardExtension(
                        workspaceRoot,
                        extDirName,
                        {
                            name: extName || extDirName,
                            author,
                            version,
                            intro,
                        },
                        { includeCard: includeCard.value }
                    );
                    provider.refresh();
                    vscode.window.showInformationMessage(`扩展 ${extName} 已创建`);

                    // 在资源管理器中打开扩展目录
                    await vscode.commands.executeCommand("revealInExplorer", vscode.Uri.file(extPath));
                } catch (err) {
                    vscode.window.showErrorMessage("创建扩展失败: " + err.message);
                }
            }
        )
    );

    // 编辑武将/技能/卡牌对象（在 VS Code 文本编辑器中打开临时文件）
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "nonameExtensionHelper.editItem",
            async (node) => {
                const item = node?.character || node?.skill || node?.card;
                if (!item) return;
                await openItemInTextEditor(context, item, provider);
            }
        )
    );

    // 编辑武将（表单向导）
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "nonameExtensionHelper.editCharacterForm",
            async (node) => {
                const char = node?.character;
                if (!char) return;
                await openCharacterEditor(context, char, provider);
            }
        )
    );

    // 在资源管理器中打开扩展目录
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "nonameExtensionHelper.openExtensionFolder",
            async (folderPath) => {
                const uri = vscode.Uri.file(folderPath);
                await vscode.commands.executeCommand("revealInExplorer", uri);
            }
        )
    );

    // 新建武将（表单向导）
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "nonameExtensionHelper.createCharacterForm",
            async (node) => {
                const ext = node?.extension;
                if (!ext) return;
                await openCharacterForm(context, ext, provider);
            }
        )
    );

    // 新建武将（旧版命令行）
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "nonameExtensionHelper.createCharacter",
            async (node) => {
                const ext = node?.extension;
                if (!ext) return;

                const id = await vscode.window.showInputBox({
                    prompt: "输入武将 ID（英文，如 sunhanhua）",
                    validateInput: (value) => {
                        if (!value) return "ID 不能为空";
                        if (!/^[a-zA-Z0-9_]+$/.test(value)) return "ID 只能包含字母、数字和下划线";
                        return null;
                    },
                });
                if (!id) return;

                const name = await vscode.window.showInputBox({
                    prompt: "输入武将名称",
                    value: id,
                });
                if (name === undefined) return;

                await insertCharacter(ext, id, name || id);
                provider.refresh();
            }
        )
    );

    // 新建技能
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "nonameExtensionHelper.createSkill",
            async (node) => {
                const ext = node?.extension;
                if (!ext) return;

                const id = await vscode.window.showInputBox({
                    prompt: "输入技能 ID（英文，如 xunlian）",
                    validateInput: (value) => {
                        if (!value) return "ID 不能为空";
                        if (!/^[a-zA-Z0-9_]+$/.test(value)) return "ID 只能包含字母、数字和下划线";
                        return null;
                    },
                });
                if (!id) return;

                const name = await vscode.window.showInputBox({
                    prompt: "输入技能名称",
                    value: id,
                });
                if (name === undefined) return;

                await insertSkill(ext, id, name || id);
                provider.refresh();
            }
        )
    );

    // 从武将节点创建技能
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "nonameExtensionHelper.createSkillForCharacter",
            async (node) => {
                const char = node?.character;
                const ext = node?.character?.extension;
                if (!char || !ext) return;

                const id = await vscode.window.showInputBox({
                    prompt: `为武将 ${char.displayName} 创建技能 ID`,
                    value: `${char.id}_`,
                    validateInput: (value) => {
                        if (!value) return "ID 不能为空";
                        if (!/^[a-zA-Z0-9_]+$/.test(value)) return "ID 只能包含字母、数字和下划线";
                        return null;
                    },
                });
                if (!id) return;

                const name = await vscode.window.showInputBox({
                    prompt: "输入技能名称",
                    value: id,
                });
                if (name === undefined) return;

                await insertSkill(ext, id, name || id);
                await addSkillToCharacter(char, id);
                provider.refresh();
            }
        )
    );

    // 删除技能
    context.subscriptions.push(
        vscode.commands.registerCommand(
            "nonameExtensionHelper.deleteSkill",
            async (node) => {
                const skill = node?.skill;
                const ext = node?.skill?.extension;
                if (!skill || !ext) return;

                const confirm = await vscode.window.showWarningMessage(
                    `确定要删除技能 "${skill.displayName}"（${skill.id}）吗？`,
                    { modal: true },
                    "删除"
                );
                if (confirm !== "删除") return;

                const success = await deleteSkill(ext, skill.id);
                if (success) {
                    provider.refresh();
                    vscode.window.showInformationMessage(`技能 ${skill.displayName} 已删除`);
                } else {
                    vscode.window.showErrorMessage("删除技能失败");
                }
            }
        )
    );
}

async function insertCharacter(extension, id, name) {
    const characterDir = path.join(extension.path, "character");
    if (!fs.existsSync(characterDir)) {
        await fs.promises.mkdir(characterDir, { recursive: true });
    }

    const characterFile = path.join(characterDir, "character.js");
    const translateFile = path.join(characterDir, "translate.js");

    const template = `    ${id}: {
        sex: "male",
        group: "qun",
        hp: 4,
        skills: [],
    },\n`;

    await appendObjectEntry(characterFile, template, `const characters = {\n};\n\nexport default characters;\n`);

    const translateEntry = `    ${id}: "${name}",\n    ${id}_info: "",\n`;
    await appendObjectEntry(translateFile, translateEntry, `const translate = {\n};\n\nexport default translate;\n`);

    await ensureIndexJs(characterDir);

    const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(characterFile));
    await vscode.window.showTextDocument(doc);
}

async function insertSkill(extension, id, name) {
    const characterDir = path.join(extension.path, "character");
    if (!fs.existsSync(characterDir)) {
        await fs.promises.mkdir(characterDir, { recursive: true });
    }

    const skillFile = path.join(characterDir, "skill.js");
    const translateFile = path.join(characterDir, "translate.js");

    const template = `    ${id}: {
        audio: 2,
        trigger: { player: "phaseZhunbeiBegin" },
        async content(event, trigger, player) {
            await player.draw();
        },
    },\n`;

    await appendObjectEntry(skillFile, template, `const skills = {\n};\n\nexport default skills;\n`);

    const translateEntry = `    ${id}: "${name}",\n    ${id}_info: "",\n`;
    await appendObjectEntry(translateFile, translateEntry, `const translate = {\n};\n\nexport default translate;\n`);

    await ensureIndexJs(characterDir);

    const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(skillFile));
    await vscode.window.showTextDocument(doc);
}

async function addSkillToCharacter(character, skillId) {
    const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(character.filePath));
    const text = doc.getText();

    // 查找该武将对象的 skills 数组
    const charRegex = new RegExp(`${character.id}\\s*:\\s*\\{`);
    const match = charRegex.exec(text);
    if (!match) return;

    const start = match.index;
    let braceCount = 0;
    let skillsArrayStart = -1;
    let skillsArrayEnd = -1;

    for (let i = start; i < text.length; i++) {
        if (text[i] === "{") braceCount++;
        if (text[i] === "}") {
            braceCount--;
            if (braceCount === 0) break;
        }

        if (text.slice(i, i + 7) === "skills:" || text.slice(i, i + 8) === "skills :") {
            skillsArrayStart = i;
            for (let j = i + 7; j < text.length; j++) {
                if (text[j] === "[") {
                    skillsArrayStart = j;
                    let arrCount = 1;
                    for (let k = j + 1; k < text.length; k++) {
                        if (text[k] === "[") arrCount++;
                        if (text[k] === "]") {
                            arrCount--;
                            if (arrCount === 0) {
                                skillsArrayEnd = k;
                                break;
                            }
                        }
                    }
                    break;
                }
            }
            break;
        }
    }

    if (skillsArrayStart === -1 || skillsArrayEnd === -1) return;

    const edit = new vscode.WorkspaceEdit();
    const insertPos = doc.positionAt(skillsArrayEnd);

    const arrayText = text.slice(skillsArrayStart + 1, skillsArrayEnd).trim();
    const separator = arrayText.length > 0 ? ", " : "";

    edit.insert(doc.uri, insertPos, `${separator}"${skillId}"`);
    await vscode.workspace.applyEdit(edit);
    await doc.save();
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
    if (fs.existsSync(indexFile)) return;

    const content = `import character from "./character.js";\nimport skill from "./skill.js";\nimport translate from "./translate.js";\n\nexport default function () {\n    return {\n        character,\n        skill,\n        translate,\n    };\n}\n`;
    await fs.promises.writeFile(indexFile, content, "utf8");
}

module.exports = {
    registerCommands,
};
