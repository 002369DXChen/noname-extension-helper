const { scanAllExtensions } = require("./src/scanner");
const { parseExtension } = require("./src/parser");
const path = require("path");

async function main() {
    const root = path.resolve(process.env.HOME || process.env.USERPROFILE, "Desktop/noname-test");
    console.log("扫描:", root);
    const exts = await scanAllExtensions(root, "extension");
    console.log("扩展数:", exts.length);
    for (const ext of exts) {
        console.log("-", ext.name, ext.dirName, ext.isESModule);
        const parsed = await parseExtension(ext);
        console.log("  chars:", parsed.characters.length, "skills:", parsed.skills.length);
    }
}

main().catch(console.error);
