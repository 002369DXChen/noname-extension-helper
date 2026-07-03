const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");

/**
 * 解析扩展的武将、技能和卡牌信息
 * @param {NonameExtension} extension
 * @returns {Promise<{characters: CharacterItem[], skills: SkillItem[], cards: CardItem[]}>}
 */
async function parseExtension(extension) {
    const result = {
        characters: [],
        skills: [],
        cards: [],
    };

    // 解析武将和技能
    const characterDir = path.join(extension.path, "character");
    if (fs.existsSync(characterDir)) {
        const charResult = await parseCharacterDir(characterDir, extension);
        result.characters = charResult.characters;
        result.skills = charResult.skills;
    }

    // 解析卡牌
    const cardDir = path.join(extension.path, "card");
    if (fs.existsSync(cardDir)) {
        const cardResult = await parseCardDir(cardDir, extension);
        result.cards = cardResult.cards;
        // 如果武将目录没有技能，但卡牌目录有技能，也可以合并到 skills（可选）
        if (result.skills.length === 0) {
            result.skills = cardResult.skills;
        }
    }

    return result;
}

/**
 * 解析 character 目录（支持根目录和子目录）
 */
async function parseCharacterDir(characterDir, extension) {
    const result = {
        characters: [],
        skills: [],
    };

    // 收集所有翻译和称号
    const translates = {};
    const titles = {};

    // 解析根目录
    const rootFiles = getModuleFiles(characterDir, "character");
    if (rootFiles.character) {
        result.characters.push(...await parseCharacterFile(rootFiles.character, extension));
    }
    if (rootFiles.skill) {
        result.skills.push(...await parseSkillFile(rootFiles.skill, extension));
    }
    if (rootFiles.translate) {
        Object.assign(translates, await parseTranslateFile(rootFiles.translate));
    }
    const rootTitleFile = path.join(characterDir, "title.js");
    if (fs.existsSync(rootTitleFile)) {
        Object.assign(titles, await parseTranslateFile(rootTitleFile));
    }

    // 解析子目录
    const subDirs = await getSubDirectories(characterDir);
    for (const subDir of subDirs) {
        const subFiles = getModuleFiles(subDir, "character");
        if (subFiles.character) {
            result.characters.push(...await parseCharacterFile(subFiles.character, extension));
        }
        if (subFiles.skill) {
            result.skills.push(...await parseSkillFile(subFiles.skill, extension));
        }
        if (subFiles.translate) {
            Object.assign(translates, await parseTranslateFile(subFiles.translate));
        }
        const subTitleFile = path.join(subDir, "title.js");
        if (fs.existsSync(subTitleFile)) {
            Object.assign(titles, await parseTranslateFile(subTitleFile));
        }
    }

    // 应用翻译和称号
    for (const char of result.characters) {
        char.displayName = translates[char.id] || char.displayName;
        char.description = translates[char.id + "_info"] || char.description;
        char.title = titles[char.id] || "";
    }
    for (const skill of result.skills) {
        skill.displayName = translates[skill.id] || skill.displayName;
        skill.description = translates[skill.id + "_info"] || skill.description;
    }

    return result;
}

/**
 * 解析 card 目录（支持根目录和子目录）
 */
async function parseCardDir(cardDir, extension) {
    const result = {
        cards: [],
        skills: [],
    };

    const translates = {};

    // 解析根目录
    const rootFiles = getModuleFiles(cardDir, "card");
    if (rootFiles.card) {
        result.cards.push(...await parseCardFile(rootFiles.card, extension));
    }
    if (rootFiles.skill) {
        result.skills.push(...await parseSkillFile(rootFiles.skill, extension));
    }
    if (rootFiles.translate) {
        Object.assign(translates, await parseTranslateFile(rootFiles.translate));
    }

    // 解析子目录
    const subDirs = await getSubDirectories(cardDir);
    for (const subDir of subDirs) {
        const subFiles = getModuleFiles(subDir, "card");
        if (subFiles.card) {
            result.cards.push(...await parseCardFile(subFiles.card, extension));
        }
        if (subFiles.skill) {
            result.skills.push(...await parseSkillFile(subFiles.skill, extension));
        }
        if (subFiles.translate) {
            Object.assign(translates, await parseTranslateFile(subFiles.translate));
        }
    }

    for (const card of result.cards) {
        card.displayName = translates[card.id] || card.displayName;
        card.description = translates[card.id + "_info"] || card.description;
    }
    for (const skill of result.skills) {
        skill.displayName = translates[skill.id] || skill.displayName;
        skill.description = translates[skill.id + "_info"] || skill.description;
    }

    return result;
}

/**
 * 获取目录下模块文件路径
 * type: "character" | "card"
 */
function getModuleFiles(dir, type) {
    const map = {};
    const mainFile = type === "character" ? "character.js" : "card.js";

    const mainPath = path.join(dir, mainFile);
    if (fs.existsSync(mainPath)) map[type === "character" ? "character" : "card"] = mainPath;

    const skillPath = path.join(dir, "skill.js");
    if (fs.existsSync(skillPath)) map.skill = skillPath;

    const translatePath = path.join(dir, "translate.js");
    if (fs.existsSync(translatePath)) map.translate = translatePath;

    return map;
}

/**
 * 获取目录下的子目录列表
 */
async function getSubDirectories(dir) {
    if (!fs.existsSync(dir)) return [];
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    return entries
        .filter(e => e.isDirectory())
        .map(e => path.join(dir, e.name));
}

/**
 * 解析 character.js，提取武将列表
 */
async function parseCharacterFile(filePath, extension) {
    const code = await fs.promises.readFile(filePath, "utf8");
    const items = [];

    try {
        const ast = parser.parse(code, {
            sourceType: "module",
        });

        const objExpr = findDefaultObject(ast.program.body);
        if (!objExpr) return items;

        for (const prop of objExpr.properties) {
            if (!isObjectProperty(prop)) continue;

            const key = getPropertyKey(prop);
            if (!key) continue;

            const charItem = {
                id: key,
                displayName: key,
                description: "",
                filePath,
                extension,
                line: prop.loc.start.line - 1,
                column: prop.loc.start.column,
                type: "character",
            };

            if (prop.value.type === "ObjectExpression") {
                for (const p of prop.value.properties) {
                    if (!isObjectProperty(p)) continue;

                    const k = getPropertyKey(p);
                    if (k === "skills" && p.value.type === "ArrayExpression") {
                        charItem.skills = p.value.elements
                            .filter(e => e && e.type === "StringLiteral")
                            .map(e => e.value);
                    }
                    if (k === "hp" && p.value.type === "NumericLiteral") {
                        charItem.hp = p.value.value;
                    }
                    if (k === "maxHp" && p.value.type === "NumericLiteral") {
                        charItem.maxHp = p.value.value;
                    }
                    if (k === "hujia" && p.value.type === "NumericLiteral") {
                        charItem.hujia = p.value.value;
                    }
                    if (k === "group" && p.value.type === "StringLiteral") {
                        charItem.group = p.value.value;
                    }
                    if (k === "sex" && p.value.type === "StringLiteral") {
                        charItem.sex = p.value.value;
                    }
                    if (k === "img" && p.value.type === "StringLiteral") {
                        charItem.img = p.value.value;
                    }
                    if (k === "dieAudios" && p.value.type === "ArrayExpression") {
                        charItem.dieAudios = p.value.elements
                            .filter(e => e && e.type === "StringLiteral")
                            .map(e => e.value);
                    }
                    if (k === "isZhugong" && p.value.type === "BooleanLiteral") {
                        charItem.isZhugong = p.value.value;
                    }
                    if (k === "isBoss" && p.value.type === "BooleanLiteral") {
                        charItem.isBoss = p.value.value;
                    }
                    if (k === "isBossAllowed" && p.value.type === "BooleanLiteral") {
                        charItem.isBossAllowed = p.value.value;
                    }
                    if (k === "isAiForbidden" && p.value.type === "BooleanLiteral") {
                        charItem.isAiForbidden = p.value.value;
                    }
                    if (k === "hasHiddenSkill" && p.value.type === "BooleanLiteral") {
                        charItem.hasHiddenSkill = p.value.value;
                    }
                    if (k === "trashBin" && p.value.type === "ArrayExpression") {
                        for (const elem of p.value.elements) {
                            if (elem && elem.type === "StringLiteral" && elem.value.startsWith("des:")) {
                                charItem.description = elem.value.slice(4);
                            }
                        }
                    }
                }
            }

            items.push(charItem);
        }
    } catch (e) {
        console.error(`解析 ${filePath} 失败:`, e.message);
    }

    return items;
}

/**
 * 解析 skill.js，提取技能列表
 */
async function parseSkillFile(filePath, extension) {
    const code = await fs.promises.readFile(filePath, "utf8");
    const items = [];

    try {
        const ast = parser.parse(code, {
            sourceType: "module",
        });

        const objExpr = findDefaultObject(ast.program.body);
        if (!objExpr) return items;

        for (const prop of objExpr.properties) {
            if (!isObjectProperty(prop)) continue;

            const key = getPropertyKey(prop);
            if (!key) continue;

            items.push({
                id: key,
                displayName: key,
                description: "",
                filePath,
                extension,
                line: prop.loc.start.line - 1,
                column: prop.loc.start.column,
                type: "skill",
            });
        }
    } catch (e) {
        console.error(`解析 ${filePath} 失败:`, e.message);
    }

    return items;
}

/**
 * 解析 card.js，提取卡牌列表
 */
async function parseCardFile(filePath, extension) {
    const code = await fs.promises.readFile(filePath, "utf8");
    const items = [];

    try {
        const ast = parser.parse(code, {
            sourceType: "module",
        });

        const objExpr = findDefaultObject(ast.program.body);
        if (!objExpr) return items;

        for (const prop of objExpr.properties) {
            if (!isObjectProperty(prop)) continue;

            const key = getPropertyKey(prop);
            if (!key) continue;

            const cardItem = {
                id: key,
                displayName: key,
                description: "",
                filePath,
                extension,
                line: prop.loc.start.line - 1,
                column: prop.loc.start.column,
                type: "card",
            };

            if (prop.value.type === "ObjectExpression") {
                for (const p of prop.value.properties) {
                    if (!isObjectProperty(p)) continue;

                    const k = getPropertyKey(p);
                    if (k === "type" && p.value.type === "StringLiteral") {
                        cardItem.cardType = p.value.value;
                    }
                    if (k === "suit" && p.value.type === "StringLiteral") {
                        cardItem.suit = p.value.value;
                    }
                    if (k === "number" && (p.value.type === "NumericLiteral" || p.value.type === "StringLiteral")) {
                        cardItem.number = p.value.value;
                    }
                }
            }

            items.push(cardItem);
        }
    } catch (e) {
        console.error(`解析 ${filePath} 失败:`, e.message);
    }

    return items;
}

/**
 * 解析 translate.js
 */
async function parseTranslateFile(filePath) {
    const code = await fs.promises.readFile(filePath, "utf8");
    const translates = {};

    try {
        const ast = parser.parse(code, {
            sourceType: "module",
        });

        const objExpr = findDefaultObject(ast.program.body);
        if (!objExpr) return translates;

        for (const prop of objExpr.properties) {
            if (!isObjectProperty(prop)) continue;

            const key = getPropertyKey(prop);
            const value = getStringValue(prop.value);
            if (key && value) {
                translates[key] = value;
            }
        }
    } catch (e) {
        console.error(`解析 ${filePath} 失败:`, e.message);
    }

    return translates;
}

/**
 * 查找 export default 对应的对象表达式
 */
function findDefaultObject(body) {
    let defaultName = null;

    for (const node of body) {
        if (node.type === "ExportDefaultDeclaration") {
            if (node.declaration.type === "ObjectExpression") {
                return node.declaration;
            }
            if (node.declaration.type === "Identifier") {
                defaultName = node.declaration.name;
            }
            break;
        }
    }

    if (!defaultName) return null;

    for (const node of body) {
        if (node.type === "VariableDeclaration") {
            for (const decl of node.declarations) {
                if (
                    decl.id.type === "Identifier" &&
                    decl.id.name === defaultName &&
                    decl.init &&
                    decl.init.type === "ObjectExpression"
                ) {
                    return decl.init;
                }
            }
        }
    }

    return null;
}

function isObjectProperty(node) {
    return node.type === "ObjectProperty" || node.type === "Property";
}

function getPropertyKey(prop) {
    if (!prop.key) return null;
    if (prop.key.type === "Identifier") return prop.key.name;
    if (prop.key.type === "StringLiteral") return prop.key.value;
    return null;
}

function getStringValue(node) {
    if (node.type === "StringLiteral") return node.value;
    if (node.type === "TemplateLiteral" && node.quasis.length === 1) {
        return node.quasis[0].value.raw;
    }
    return null;
}

module.exports = {
    parseExtension,
    parseCharacterFile,
    parseSkillFile,
    parseCardFile,
    parseTranslateFile,
};
