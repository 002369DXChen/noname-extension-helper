const vscode = require("vscode");
const { scanAllExtensions } = require("./scanner");
const { parseExtension } = require("./parser");

class NonameTreeDataProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this._extensions = [];
        this._parsedCache = new Map();
    }

    refresh() {
        this._parsedCache.clear();
        this._extensions = [];
        this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(element) {
        return element;
    }

    async getChildren(element) {
        if (!element) {
            // 根节点：扩展列表
            if (this._extensions.length === 0) {
                const folders = vscode.workspace.workspaceFolders;
                if (!folders) return [];

                const config = vscode.workspace.getConfiguration("nonameExtensionHelper");
                const extensionDir = config.get("extensionDir", "extension");

                for (const folder of folders) {
                    const exts = await scanAllExtensions(folder.uri.fsPath, extensionDir);
                    this._extensions.push(...exts);
                }
            }

            if (this._extensions.length === 0) {
                return [new InfoNode("未检测到扩展，请确认工作区包含 extension/ 目录")];
            }
            return this._extensions.map(ext => new ExtensionNode(ext));
        }

        if (element instanceof ExtensionNode) {
            const ext = element.extension;
            let parsed = this._parsedCache.get(ext.dirName);
            if (!parsed) {
                parsed = await parseExtension(ext);
                this._parsedCache.set(ext.dirName, parsed);
            }

            const children = [];

            if (ext.hasCharacterDir) {
                children.push(new CategoryNode(ext, "武将", "characters", parsed.characters));
            }
            if (ext.hasCardDir) {
                children.push(new CategoryNode(ext, "卡牌", "cards", parsed.cards));
            }
            if (parsed.skills.length > 0) {
                children.push(new CategoryNode(ext, "技能", "skills", parsed.skills));
            }
            children.push(new OpenFolderNode(ext));

            return children;
        }

        if (element instanceof CategoryNode) {
            if (element.categoryType === "characters") {
                return element.items.map(char => new CharacterNode(char));
            }
            if (element.categoryType === "skills") {
                return element.items.map(skill => new SkillNode(skill));
            }
            if (element.categoryType === "cards") {
                return element.items.map(card => new CardNode(card));
            }
            return [];
        }

        return [];
    }
}

class ExtensionNode extends vscode.TreeItem {
    constructor(extension) {
        super(extension.name, vscode.TreeItemCollapsibleState.Collapsed);
        this.extension = extension;
        this.contextValue = "nonameExtension";
        this.tooltip = `${extension.name}\n路径: ${extension.path}\n类型: ${extension.isESModule ? "ES Module" : "旧版单文件"}`;

        if (!extension.isESModule) {
            this.iconPath = new vscode.ThemeIcon("warning");
            this.description = "旧版";
        } else {
            this.iconPath = new vscode.ThemeIcon("extensions");
            this.description = "ESM";
        }
    }
}

class CategoryNode extends vscode.TreeItem {
    constructor(extension, label, categoryType, items) {
        super(label, vscode.TreeItemCollapsibleState.Collapsed);
        this.extension = extension;
        this.categoryType = categoryType;
        this.items = items;
        this.contextValue = `nonameCategory_${categoryType}`;

        const icons = {
            characters: "account",
            skills: "zap",
            cards: "symbol-color",
        };
        this.iconPath = new vscode.ThemeIcon(icons[categoryType] || "list-tree");
        this.description = `${items.length} 个`;
    }
}

class CharacterNode extends vscode.TreeItem {
    constructor(character) {
        super(character.displayName, vscode.TreeItemCollapsibleState.Collapsed);
        this.character = character;
        this.contextValue = "nonameCharacter";
        this.tooltip = `${character.displayName}（${character.id}）\n${character.description}`;
        this.iconPath = new vscode.ThemeIcon("account");

        const parts = [];
        if (character.group) parts.push(character.group);
        if (character.hp) parts.push(`${character.hp} 勾玉`);
        if (character.skills && character.skills.length) parts.push(character.skills.join(","));
        this.description = parts.join(" · ");

        this.command = {
            command: "nonameExtensionHelper.openFileAt",
            title: "打开武将",
            arguments: [character.filePath, character.line, character.column],
        };
    }
}

class SkillNode extends vscode.TreeItem {
    constructor(skill) {
        super(skill.displayName, vscode.TreeItemCollapsibleState.None);
        this.skill = skill;
        this.contextValue = "nonameSkill";
        this.tooltip = `${skill.displayName}（${skill.id}）\n${skill.description}`;
        this.iconPath = new vscode.ThemeIcon("zap");
        this.description = skill.id;

        this.command = {
            command: "nonameExtensionHelper.openFileAt",
            title: "打开技能",
            arguments: [skill.filePath, skill.line, skill.column],
        };
    }
}

class CardNode extends vscode.TreeItem {
    constructor(card) {
        super(card.displayName, vscode.TreeItemCollapsibleState.None);
        this.card = card;
        this.contextValue = "nonameCard";
        this.tooltip = `${card.displayName}（${card.id}）\n${card.description}`;
        this.iconPath = new vscode.ThemeIcon("symbol-color");

        const parts = [];
        if (card.cardType) parts.push(card.cardType);
        if (card.suit) parts.push(card.suit);
        if (card.number !== undefined) parts.push(String(card.number));
        this.description = parts.join(" · ") || card.id;

        this.command = {
            command: "nonameExtensionHelper.openFileAt",
            title: "打开卡牌",
            arguments: [card.filePath, card.line, card.column],
        };
    }
}

class InfoNode extends vscode.TreeItem {
    constructor(message) {
        super(message, vscode.TreeItemCollapsibleState.None);
        this.iconPath = new vscode.ThemeIcon("info");
    }
}

class OpenFolderNode extends vscode.TreeItem {
    constructor(extension) {
        super("打开扩展目录", vscode.TreeItemCollapsibleState.None);
        this.extension = extension;
        this.contextValue = "nonameOpenFolder";
        this.iconPath = new vscode.ThemeIcon("folder-opened");
        this.command = {
            command: "nonameExtensionHelper.openExtensionFolder",
            title: "打开扩展目录",
            arguments: [extension.path],
        };
    }
}

module.exports = {
    NonameTreeDataProvider,
};
