const fs = require("fs");
const path = require("path");
const vscode = require("vscode");

/**
 * 创建标准扩展结构
 * @param {string} workspaceRoot 工作区根目录
 * @param {string} extensionDirName 扩展目录名（如 my_extension）
 * @param {object} info 扩展信息 { name, author, version, intro }
 * @param {object} options 选项 { includeCard: boolean }
 */
async function createStandardExtension(workspaceRoot, extensionDirName, info, options = {}) {
    const extPath = path.join(workspaceRoot, "extension", extensionDirName);

    if (fs.existsSync(extPath)) {
        throw new Error(`扩展目录 ${extensionDirName} 已存在`);
    }

    // 创建目录结构
    const dirs = [
        path.join(extPath, "main"),
        path.join(extPath, "character"),
        path.join(extPath, "image", "character"),
        path.join(extPath, "audio", "die"),
        path.join(extPath, "audio", "skill"),
    ];

    if (options.includeCard) {
        dirs.push(path.join(extPath, "card"));
    }

    for (const dir of dirs) {
        await fs.promises.mkdir(dir, { recursive: true });
    }

    // 写入文件
    await writeFile(path.join(extPath, "extension.js"), getExtensionJs(info.name, extensionDirName));
    await writeFile(path.join(extPath, "main", "precontent.js"), getPrecontentJs(info.name));
    await writeFile(path.join(extPath, "info.json"), JSON.stringify({
        name: info.name,
        author: info.author || "",
        version: info.version || "1.0.0",
        intro: info.intro || "",
    }, null, 4));

    await writeFile(path.join(extPath, "character", "index.js"), getCharacterIndexJs(extensionDirName));
    await writeFile(path.join(extPath, "character", "character.js"), getEmptyObjectJs("characters"));
    await writeFile(path.join(extPath, "character", "skill.js"), getEmptyObjectJs("skills"));
    await writeFile(path.join(extPath, "character", "translate.js"), getEmptyObjectJs("translate"));
    await writeFile(path.join(extPath, "character", "title.js"), getEmptyObjectJs("characterTitle"));

    if (options.includeCard) {
        await writeFile(path.join(extPath, "card", "index.js"), getCardIndexJs(extensionDirName));
        await writeFile(path.join(extPath, "card", "card.js"), getEmptyObjectJs("cards"));
        await writeFile(path.join(extPath, "card", "skill.js"), getEmptyObjectJs("skills"));
        await writeFile(path.join(extPath, "card", "translate.js"), getEmptyObjectJs("translate"));
        await writeFile(path.join(extPath, "card", "list.js"), getEmptyArrayJs("list"));
    }

    return extPath;
}

async function writeFile(filePath, content) {
    await fs.promises.writeFile(filePath, content, "utf8");
}

function getExtensionJs(name, extDirName) {
    return `import { lib, game, ui, get, ai, _status } from "noname";
import { precontent } from "./main/precontent.js";

const extensionInfo = await lib.init.promises.json(\`\${lib.assetURL}extension/${extDirName}/info.json\`);
let extensionPackage = {
    name: "${name}",
    config: {},
    help: {},
    package: {},
    precontent,
    files: { character: [], card: [], skill: [], audio: [] },
};

Object.keys(extensionInfo)
    .filter(key => key !== "name")
    .forEach(key => {
        extensionPackage.package[key] = extensionInfo[key];
    });

export let type = "extension";
export default extensionPackage;
`;
}

function getPrecontentJs(name) {
    return `import { lib, game, ui, get, ai, _status } from "noname";

export async function precontent(config, pack) {
    const timeout = 5000;
    try {
        await Promise.race([
            import("../character/index.js"),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error("『${name}』加载超时")), timeout)
            ),
        ]);
    } catch (err) {
        console.error("Failed to import extension 『${name}』: ", err);
        alert("Error:『${name}』扩展导入失败");
    }
}
`;
}

function getCharacterIndexJs(extDirName) {
    return `import { game } from "noname";
import characters from "./character.js";
import skills from "./skill.js";
import translates from "./translate.js";
import characterTitle from "./title.js";

game.import("character", function () {
    return {
        name: "${extDirName}",
        connect: true,
        character: { ...characters },
        characterTitle: { ...characterTitle },
        skill: { ...skills },
        translate: { ...translates },
    };
});
`;
}

function getCardIndexJs(extDirName) {
    return `import { game } from "noname";
import cards from "./card.js";
import skills from "./skill.js";
import translates from "./translate.js";
import list from "./list.js";

game.import("card", function () {
    return {
        name: "${extDirName}",
        connect: true,
        card: { ...cards },
        skill: { ...skills },
        translate: { ...translates },
        list,
    };
});
`;
}

function getEmptyObjectJs(varName) {
    return `const ${varName} = {};

export default ${varName};
`;
}

function getEmptyArrayJs(varName) {
    return `const ${varName} = [];

export default ${varName};
`;
}

module.exports = {
    createStandardExtension,
};
