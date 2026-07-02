const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const { promisify } = require("util");

const deflateRaw = promisify(zlib.deflateRaw);

/**
 * 计算 CRC32 校验码
 * @param {Buffer} buf
 * @returns {number}
 */
function crc32(buf) {
    if (typeof zlib.crc32 === "function") {
        return zlib.crc32(buf);
    }
    // 兼容实现
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
        let c = i;
        for (let j = 0; j < 8; j++) {
            c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : c >>> 1;
        }
        table[i] = c >>> 0;
    }
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
        crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
}

/**
 * 将 Date 转换为 DOS 时间格式
 * @param {Date} date
 * @returns {{time: number, date: number}}
 */
function getDosTime(date) {
    const time = (date.getSeconds() >> 1) | (date.getMinutes() << 5) | (date.getHours() << 11);
    const d = date.getDate() | ((date.getMonth() + 1) << 5) | ((date.getFullYear() - 1980) << 9);
    return { time, date: d };
}

/**
 * 从文件列表创建 zip 数据
 * @param {{relativePath: string, data: Buffer}[]} files
 * @returns {Promise<Buffer>}
 */
async function createZip(files) {
    let centralDirectory = Buffer.alloc(0);
    let offset = 0;
    const entries = [];
    const now = new Date();
    const { time, date } = getDosTime(now);

    for (const file of files) {
        const nameBuffer = Buffer.from(file.relativePath, "utf8");
        const uncompressed = file.data;
        const compressed = await deflateRaw(uncompressed);
        const useCompressed = compressed.length < uncompressed.length;
        const data = useCompressed ? compressed : uncompressed;
        const method = useCompressed ? 8 : 0;
        const checksum = crc32(uncompressed);

        // Local file header
        const localHeader = Buffer.alloc(30);
        localHeader.writeUInt32LE(0x04034b50, 0); // local file header signature
        localHeader.writeUInt16LE(20, 4); // version needed to extract (2.0)
        localHeader.writeUInt16LE(0, 6); // general purpose bit flag
        localHeader.writeUInt16LE(method, 8); // compression method
        localHeader.writeUInt16LE(time, 10); // last mod file time
        localHeader.writeUInt16LE(date, 12); // last mod file date
        localHeader.writeUInt32LE(checksum, 14); // crc-32
        localHeader.writeUInt32LE(data.length, 18); // compressed size
        localHeader.writeUInt32LE(uncompressed.length, 22); // uncompressed size
        localHeader.writeUInt16LE(nameBuffer.length, 26); // file name length
        localHeader.writeUInt16LE(0, 28); // extra field length

        // Central directory file header
        const cdHeader = Buffer.alloc(46);
        cdHeader.writeUInt32LE(0x02014b50, 0); // central file header signature
        cdHeader.writeUInt16LE(20, 4); // version made by
        cdHeader.writeUInt16LE(20, 6); // version needed to extract
        cdHeader.writeUInt16LE(0, 8); // general purpose bit flag
        cdHeader.writeUInt16LE(method, 10); // compression method
        cdHeader.writeUInt16LE(time, 12); // last mod file time
        cdHeader.writeUInt16LE(date, 14); // last mod file date
        cdHeader.writeUInt32LE(checksum, 16); // crc-32
        cdHeader.writeUInt32LE(data.length, 20); // compressed size
        cdHeader.writeUInt32LE(uncompressed.length, 24); // uncompressed size
        cdHeader.writeUInt16LE(nameBuffer.length, 28); // file name length
        cdHeader.writeUInt16LE(0, 30); // extra field length
        cdHeader.writeUInt16LE(0, 32); // file comment length
        cdHeader.writeUInt16LE(0, 34); // disk number start
        cdHeader.writeUInt16LE(0, 36); // internal file attributes
        cdHeader.writeUInt32LE(0, 38); // external file attributes
        cdHeader.writeUInt32LE(offset, 42); // relative offset of local header

        entries.push({ localHeader, nameBuffer, data });
        centralDirectory = Buffer.concat([centralDirectory, cdHeader, nameBuffer]);

        offset += localHeader.length + nameBuffer.length + data.length;
    }

    // End of central directory record
    const eocdr = Buffer.alloc(22);
    eocdr.writeUInt32LE(0x06054b50, 0); // end of central dir signature
    eocdr.writeUInt16LE(0, 4); // number of this disk
    eocdr.writeUInt16LE(0, 6); // disk with central directory
    eocdr.writeUInt16LE(entries.length, 8); // number of entries on this disk
    eocdr.writeUInt16LE(entries.length, 10); // total number of entries
    eocdr.writeUInt32LE(centralDirectory.length, 12); // size of central directory
    eocdr.writeUInt32LE(offset, 16); // offset of start of central directory
    eocdr.writeUInt16LE(0, 20); // comment length

    const parts = [];
    for (const entry of entries) {
        parts.push(entry.localHeader, entry.nameBuffer, entry.data);
    }
    parts.push(centralDirectory, eocdr);

    return Buffer.concat(parts);
}

/**
 * 递归收集目录下所有文件
 * @param {string} dirPath
 * @returns {Promise<{relativePath: string, data: Buffer}[]>}
 */
async function collectFiles(dirPath) {
    const files = [];

    async function walk(currentPath, relativePath) {
        const entries = await fs.promises.readdir(currentPath, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name);
            const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
            if (entry.isDirectory()) {
                await walk(fullPath, relPath);
            } else if (entry.isFile()) {
                const data = await fs.promises.readFile(fullPath);
                files.push({ relativePath: relPath, data });
            }
        }
    }

    await walk(dirPath, "");
    return files;
}

/**
 * 将扩展目录打包为 zip 文件
 * @param {string} extensionPath 扩展目录绝对路径
 * @param {string} targetPath 输出的 zip 文件绝对路径
 * @returns {Promise<void>}
 */
async function exportExtension(extensionPath, targetPath) {
    if (!fs.existsSync(extensionPath)) {
        throw new Error("扩展目录不存在");
    }
    const stat = await fs.promises.stat(extensionPath);
    if (!stat.isDirectory()) {
        throw new Error("目标路径不是目录");
    }

    const files = await collectFiles(extensionPath);
    const zipBuffer = await createZip(files);

    await fs.promises.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.promises.writeFile(targetPath, zipBuffer);
}

module.exports = {
    exportExtension,
};
