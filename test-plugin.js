const { scanAllExtensions } = require("./src/scanner");
const { parseExtension } = require("./src/parser");
const path = require("path");

async function main() {
    const root = path.resolve(__dirname, "..");
    console.log("扫描工作区:", root);

    const exts = await scanAllExtensions(root, "extension");
    console.log(`发现 ${exts.length} 个扩展:\n`);

    for (const ext of exts) {
        console.log(`[${ext.name}] ${ext.dirName}`);
        console.log(`  ES Module: ${ext.isESModule}`);
        console.log(`  hasCharacterDir: ${ext.hasCharacterDir}, hasCardDir: ${ext.hasCardDir}`);

        if (ext.isESModule) {
            const parsed = await parseExtension(ext);
            console.log(`  武将数: ${parsed.characters.length}`);
            for (const char of parsed.characters.slice(0, 3)) {
                console.log(`    - ${char.id}: ${char.displayName} (${char.group || "?"} ${char.hp || "?"}勾玉) [${char.skills?.join(",") || "无技能"}]`);
            }
            if (parsed.characters.length > 3) console.log(`    ... 共 ${parsed.characters.length} 个武将`);

            console.log(`  技能数: ${parsed.skills.length}`);
            for (const skill of parsed.skills.slice(0, 3)) {
                console.log(`    - ${skill.id}: ${skill.displayName}`);
            }
            if (parsed.skills.length > 3) console.log(`    ... 共 ${parsed.skills.length} 个技能`);

            console.log(`  卡牌数: ${parsed.cards.length}`);
            for (const card of parsed.cards.slice(0, 3)) {
                console.log(`    - ${card.id}: ${card.displayName} (${card.cardType || "?"} ${card.suit || "?"} ${card.number || "?"})`);
            }
            if (parsed.cards.length > 3) console.log(`    ... 共 ${parsed.cards.length} 张卡牌`);
        }
        console.log();
    }
}

main().catch(console.error);
