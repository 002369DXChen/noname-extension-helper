const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "../..");
const typingsDir = path.resolve(__dirname, "../typings");

function readProjectTypings(filePath) {
    return fs.readFileSync(path.join(projectRoot, filePath), "utf8");
}

const typesToReplace = ["Button", "Card", "VCard", "Dialog", "GameEvent", "Player", "Control", "Video", "Videos", "GameHistory", "Character"];

function adaptTypeDts(content) {
    let result = content;

    // 将 project 中的路径别名 import 替换为占位符，避免 VS Code 解析失败
    for (const typeName of typesToReplace) {
        const regex = new RegExp(`declare\\s+type\\s+${typeName}\\s*=\\s*import\\(['"][^'"]+['"]\\)\\.${typeName};?`);
        result = result.replace(regex, `// ${typeName} 类型由下方的简化定义提供`);
    }

    // game/lib/ui/get/ai/status 使用简化 any
    result = result
        .replace(/declare\s+type\s+Game\s*=\s*typeof\s+import\(['"]noname['"]\)\.game;/, "declare type Game = any;")
        .replace(/declare\s+type\s+Library\s*=\s*typeof\s+import\(['"]noname['"]\)\.lib;/, "declare type Library = any;")
        .replace(/declare\s+type\s+Status\s*=\s*typeof\s+import\(['"]noname['"]\)\.status;/, "declare type Status = any;")
        .replace(/declare\s+type\s+UI\s*=\s*typeof\s+import\(['"]noname['"]\)\.ui;/, "declare type UI = any;")
        .replace(/declare\s+type\s+Get\s*=\s*typeof\s+import\(['"]noname['"]\)\.get;/, "declare type Get = any;")
        .replace(/declare\s+type\s+AI\s*=\s*typeof\s+import\(['"]noname['"]\)\.ai;/, "declare type AI = any;");

    // 处理未匹配到的 import('@/xxx').Type 和 typeof import('xxx').yyy
    result = result
        .replace(/typeof\s+import\(['"][^'"]+['"]\)\.([A-Za-z0-9_]+)/g, "any")
        .replace(/import\(['"]@\/[^'"]+['"]\)\.[A-Za-z0-9_]+/g, "any");

    // 移除 vue import
    result = result.replace(/import\(['"]vue['"]\)\.[A-Za-z0-9_<>]+/g, "any");

    return result;
}

function adaptSkillDts(content) {
    return content.replace(
        /import\s+\{\s*BroadSelect\s*\}\s+from\s+["']@\/library\/element\/Player\/type["'];?/,
        "type BroadSelect = number | Select;"
    );
}

const extraTypes = `
// 以下为无名杀常用运行对象的简化类型定义，用于在技能 content 中提供基础 IntelliSense

declare interface GameEvent {
    name: string;
    player?: Player;
    target?: Player;
    targets?: Player[];
    source?: Player;
    card?: Card;
    cards?: Card[];
    result?: Result;
    parent?: GameEvent;
    _trigger?: GameEvent;
    [key: string]: any;
}

declare interface Result {
    bool?: boolean;
    cards?: Card[];
    targets?: Player[];
    links?: any[];
    control?: string;
    [key: string]: any;
}

declare interface Card {
    name: string;
    suit?: string;
    number?: number | string;
    nature?: string;
    [key: string]: any;
}

declare interface Player {
    name: string;
    name1?: string;
    name2?: string;
    hp: number;
    maxHp: number;
    hujia: number;
    skills: string[];
    storage: Record<string, any>;

    // 状态判断
    isIn(): boolean;
    isAlive(): boolean;
    isDead(): boolean;
    isDying(): boolean;
    isTurnedOver(): boolean;
    isLinked(): boolean;
    hasCard(filter?: string | ((card: Card) => boolean), position?: string): boolean;
    hasCards(position?: string): boolean;
    hasUseTarget(card: Card | string, exclude?: Player): boolean;
    canUse(card: Card, target?: Player, extra?: any): boolean;
    hasSkillTag(tag: string, includeOut?: boolean, target?: Player, extra?: any): boolean;

    // 卡牌计数
    countCards(position?: string): number;
    countGainableCards(player: Player, position?: string): number;
    countDiscardableCards(player: Player, position?: string): number;
    getCards(position?: string): Card[];
    getGainableCards(player: Player, position?: string): Card[];
    getDiscardableCards(player: Player, position?: string): Card[];

    // 基础操作
    draw(num?: number): Promise<GameEvent>;
    discard(cards: Card | Card[], delay?: boolean): Promise<GameEvent>;
    lose(cards: Card | Card[], hs?: boolean, es?: boolean, js?: boolean, ss?: boolean): Promise<GameEvent>;
    gain(cards: Card | Card[], log?: boolean): Promise<GameEvent>;
    damage(...args: any[]): Promise<GameEvent>;
    recover(num?: number): Promise<GameEvent>;
    loseHp(num?: number): Promise<GameEvent>;
    gainMaxHp(num?: number): Promise<GameEvent>;
    loseMaxHp(num?: number): Promise<GameEvent>;

    // 选择类
    chooseToUse(hs?: boolean, ns?: boolean): Promise<GameEvent>;
    chooseToRespond(hs?: boolean, ns?: boolean): Promise<GameEvent>;
    chooseCard(hs?: boolean, ns?: boolean, prompt?: string): Promise<GameEvent>;
    chooseTarget(num?: number | [number, number], prompt?: string): Promise<GameEvent>;
    chooseButton(list: any[], forced?: boolean): Promise<GameEvent>;
    chooseBool(prompt?: string): Promise<GameEvent>;
    choosePlayerCard(target: Player, position?: string, visible?: boolean): Promise<GameEvent>;
    choosePlayerCard(prompt: string, target: Player, position?: string, visible?: boolean): Promise<GameEvent>;

    // 对他人操作
    gainPlayerCard(target: Player, position?: string, visible?: boolean): Promise<GameEvent>;
    gainPlayerCard(prompt: string, target: Player, position?: string, visible?: boolean): Promise<GameEvent>;
    discardPlayerCard(target: Player, position?: string, visible?: boolean): Promise<GameEvent>;
    discardPlayerCard(prompt: string, target: Player, position?: string, visible?: boolean): Promise<GameEvent>;
    loseToDiscardpile(cards: Card | Card[], hp?: boolean, es?: boolean, js?: boolean, ss?: boolean): Promise<GameEvent>;
    loseToDiscardpile(cards: Card | Card[], position?: any): Promise<GameEvent>;
    give(cards: Card | Card[], target: Player, visible?: boolean): Promise<GameEvent>;

    // 技能
    addSkill(skill: string | string[]): void;
    removeSkill(skill: string | string[]): void;
    hasSkill(skill: string): boolean;
    hasUsableSkill(skill: string): boolean;
    logSkill(skill: string, targets?: Player | Player[], nature?: string): void;
    line(target: Player | Player[], nature?: string): void;

    countSkill(skill: string): number;
    hasHistory(name: string, filter?: (event: GameEvent) => boolean): boolean;
    getHistory(name: string): GameEvent[];

    getSeatNum(): number;
    getNext(): Player;
    getPrevious(): Player;
    distanceTo(target: Player, method?: string): number;

    markSkill(skill: string, info?: any): void;
    unmarkSkill(skill: string): void;
    countMark(skill: string): number;
    addMark(skill: string, num?: number): void;
    removeMark(skill: string, num?: number): void;
    storage: Record<string, any>;
    setStorage(name: string, value: any): void;

    [key: string]: any;
}

declare interface Dialog {
    [key: string]: any;
}

declare interface Button {
    [key: string]: any;
}

declare interface Control {
    [key: string]: any;
}

declare interface VCard {
    [key: string]: any;
}

declare const lib: any;
declare const game: any;
declare const ui: any;
declare const get: any;
declare const ai: any;
declare const _status: any;
`;

const typeDts = adaptTypeDts(readProjectTypings("src/typings/type.d.ts"));
const skillDts = adaptSkillDts(readProjectTypings("src/typings/Skill.d.ts"));

const combined = `// 此文件由 build-typings.js 自动生成，合并自项目 src/typings/type.d.ts 和 Skill.d.ts
// 用于在 VS Code 插件中为无名杀技能编辑提供 IntelliSense

${typeDts}

${skillDts}

${extraTypes}
`;

if (!fs.existsSync(typingsDir)) {
    fs.mkdirSync(typingsDir, { recursive: true });
}

fs.writeFileSync(path.join(typingsDir, "noname-skill.d.ts"), combined, "utf8");
console.log("已生成 typings/noname-skill.d.ts");
