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
    player: Player;
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
    bool: boolean;
    cards?: Card[];
    targets?: Player[];
    links?: any[];
    control?: string;
    index?: number;
    skill?: string;
    cost_data?: any;
    [key: string]: any;
}

declare interface Card {
    name: string;
    suit?: string;
    number?: number | string;
    nature?: string;
    gaintag?: string[];
    vanishtag?: string[];
    storage?: Record<string, any>;
    destroyed?: boolean;
    original?: string;
    vcard?: VCard;
    hasGaintag(tag: string): boolean;
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
    isDamaged(): boolean;
    isTurnedOver(): boolean;
    isLinked(): boolean;
    hasCard(filter?: string | ((card: Card) => boolean), position?: string): boolean;
    hasCards(position?: string, filter?: string | ((card: Card) => boolean)): boolean;
    hasUseTarget(card: Card | string, distance?: boolean, includecard?: boolean): boolean;
    canUse(card: Card, target?: Player, distance?: boolean, includecard?: boolean): boolean;
    hasSkillTag(tag: string, includeOut?: boolean, target?: Player, extra?: any): boolean;

    // 卡牌计数
    countCards(position?: string, filter?: string | ((card: Card) => boolean)): number;
    countGainableCards(player: Player, position?: string, filter?: string | ((card: Card) => boolean)): number;
    countDiscardableCards(player: Player, position?: string, filter?: string | ((card: Card) => boolean)): number;
    getCards(position?: string, filter?: string | ((card: Card) => boolean)): Card[];
    getGainableCards(player: Player, position?: string, filter?: string | ((card: Card) => boolean)): Card[];
    getDiscardableCards(player: Player, position?: string, filter?: string | ((card: Card) => boolean)): Card[];

    // 基础操作
    draw(num?: number): Promise<GameEvent>;
    draw(params: Record<string, any>): Promise<GameEvent>;
    discard(cards: Card | Card[], delay?: boolean): Promise<GameEvent>;
    discard(params: Record<string, any>): Promise<GameEvent>;
    lose(cards: Card | Card[], hs?: boolean, es?: boolean, js?: boolean, ss?: boolean): Promise<GameEvent>;
    lose(params: Record<string, any>): Promise<GameEvent>;
    gain(cards: Card | Card[], log?: boolean): Promise<GameEvent>;
    gain(params: Record<string, any>): Promise<GameEvent>;
    damage(...args: any[]): Promise<GameEvent>;
    recover(num?: number): Promise<GameEvent>;
    recover(params: Record<string, any>): Promise<GameEvent>;
    loseHp(num?: number): Promise<GameEvent>;
    gainMaxHp(num?: number): Promise<GameEvent>;
    loseMaxHp(num?: number): Promise<GameEvent>;

    // 选择类
    chooseToUse(hs?: boolean, ns?: boolean): Promise<GameEvent>;
    chooseToUse(params: Record<string, any>): Promise<GameEvent>;
    chooseToRespond(hs?: boolean, ns?: boolean): Promise<GameEvent>;
    chooseToRespond(params: Record<string, any>): Promise<GameEvent>;
    chooseCard(hs?: boolean, ns?: boolean, prompt?: string): Promise<GameEvent>;
    chooseCard(params: Record<string, any>): Promise<GameEvent>;
    chooseTarget(num?: number | [number, number], prompt?: string): Promise<GameEvent>;
    chooseTarget(params: Record<string, any>): Promise<GameEvent>;
    chooseButton(list: any[], forced?: boolean): Promise<GameEvent>;
    chooseButton(params: Record<string, any>): Promise<GameEvent>;
    chooseBool(prompt?: string): Promise<GameEvent>;
    chooseBool(params: Record<string, any>): Promise<GameEvent>;
    choosePlayerCard(target: Player, position?: string, visible?: boolean): Promise<GameEvent>;
    choosePlayerCard(prompt: string, target: Player, position?: string, visible?: boolean): Promise<GameEvent>;
    choosePlayerCard(params: Record<string, any>): Promise<GameEvent>;

    // 对他人操作
    gainPlayerCard(target: Player, position?: string, visible?: boolean): Promise<GameEvent>;
    gainPlayerCard(prompt: string, target: Player, position?: string, visible?: boolean): Promise<GameEvent>;
    gainPlayerCard(params: Record<string, any>): Promise<GameEvent>;
    discardPlayerCard(target: Player, position?: string, visible?: boolean): Promise<GameEvent>;
    discardPlayerCard(prompt: string, target: Player, position?: string, visible?: boolean): Promise<GameEvent>;
    discardPlayerCard(params: Record<string, any>): Promise<GameEvent>;
    loseToDiscardpile(cards: Card | Card[], hp?: boolean, es?: boolean, js?: boolean, ss?: boolean): Promise<GameEvent>;
    loseToDiscardpile(cards: Card | Card[], position?: any): Promise<GameEvent>;
    give(cards: Card | Card[], target: Player, visible?: boolean): Promise<GameEvent>;

    // 技能
    addSkill(skill: string | string[]): void;
    removeSkill(skill: string | string[]): void;
    hasSkill(skill: string, arg2?: any, arg3?: any, arg4?: any): boolean;
    hasUsableSkill(skill: string): boolean;
    logSkill(skill: string, targets?: Player | Player[], nature?: string, logv?: any, args?: any): void;
    line(target: Player | Player[], config?: any): void;

    countSkill(skill: string): number;
    hasHistory(name: string, filter?: (event: GameEvent) => boolean, last?: boolean): boolean;
    getHistory(name: string, filter?: (event: GameEvent) => boolean, last?: boolean): GameEvent[];

    getSeatNum(): number;
    getNext(): Player;
    getPrevious(): Player;
    distanceTo(target: Player, method?: string): number;

    markSkill(skill: string, info?: any, card?: Card, nobroadcast?: boolean): void;
    unmarkSkill(skill: string, nobroadcast?: boolean): void;
    countMark(skill: string): number;
    addMark(skill: string, num?: number, log?: boolean): void;
    removeMark(skill: string, num?: number, log?: boolean): void;
    storage: Record<string, any>;
    setStorage(name: string, value: any, mark?: boolean): void;

    // 更多选择方法
    chooseControl(choices: string[], prompt?: string): Promise<GameEvent>;
    chooseControl(params: Record<string, any>): Promise<GameEvent>;
    chooseToDiscard(position: string): Promise<GameEvent>;
    chooseToDiscard(num: number | [number, number]): Promise<GameEvent>;
    chooseToDiscard(num: number | [number, number], prompt: string): Promise<GameEvent>;
    chooseToDiscard(position: string, num: number | [number, number]): Promise<GameEvent>;
    chooseToDiscard(params: Record<string, any>): Promise<GameEvent>;
    chooseToDiscard(...args: any[]): Promise<GameEvent>;
    chooseToGive(target: Player, num?: number | [number, number], prompt?: string): Promise<GameEvent>;
    chooseToGive(params: Record<string, any>): Promise<GameEvent>;
    chooseToMove(prompt?: string): Promise<GameEvent>;
    chooseToMove(params: Record<string, any>): Promise<GameEvent>;
    chooseToGuanxing(num: number): Promise<GameEvent>;
    chooseToGuanxing(params: Record<string, any>): Promise<GameEvent>;
    chooseDrawRecover(num1?: number, num2?: number): Promise<GameEvent>;
    chooseDrawRecover(params: Record<string, any>): Promise<GameEvent>;

    // 标记与状态
    addGaintag(cards: Card | Card[], tag: string): void;
    removeGaintag(tag: string, cards?: Card | Card[]): void;
    hasJudge(name: string): boolean;
    getJudge(name: string): Card | undefined;
    getEquip(slot: string): Card | undefined;
    getEquips(subtype?: string): Card[];
    getHandcardNum(): number;

    // 链式技能
    when(signal: string | string[], instantlyAdd?: boolean): When;

    // 其他常用
    canUseTarget(card: Card, target: Player): boolean;
    getStat(key?: string): Stat | number | any;

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
    name: string;
    suit?: string;
    number?: number | string;
    nature?: string;
    cards?: Card[];
    isCard?: boolean;
    [key: string]: any;
}

declare interface LibFilter {
    notMe: (card?: Card, player?: Player, target?: Player) => boolean;
    all: (card?: Card, player?: Player, target?: Player) => boolean;
    all2: (card?: Card, player?: Player, target?: Player) => boolean;
    onlyMe: (card?: Card, player?: Player, target?: Player) => boolean;
    notMeCard: (card?: Card, player?: Player, target?: Player) => boolean;
    [key: string]: any;
}

declare interface Get {
    attitude(player: Player, target: Player): number;
    tag(card: Card | VCard, tag: string): boolean | number;
    value(card: Card | Card[], player?: Player): number;
    useful(card: Card, player?: Player): number;
    translation(target: string | Card | Player | VCard): string;
    mode(): string;
    itemtype(target: any): string;
    is: {
        object(target: any): boolean;
        array(target: any): boolean;
        player(target: any): boolean;
        card(target: any): boolean;
        select(target: any): boolean;
        position(target: any): boolean;
        filter(target: any): boolean;
        [key: string]: any;
    };
    select(select: number | [number, number] | (() => number | [number, number])): [number, number];
    suit(card: Card, player?: Player): string;
    number(card: Card): number | string;
    name(card: Card): string;
    color(card: Card): string;
    owner(card: Card): Player;
    cardPile(filter: (card: Card) => boolean, position?: string): Card;
    playerCardFilter(player: Player, position: string): boolean;
    info(skill: string): Skill;
    copy(skill: string): Skill;
    event(): GameEvent;
    player(): Player;
    target(): Player;
    targets(): Player[];
    card(): Card;
    cards(): Card[];
    effect(target: Player, card: Card | VCard | string, player: Player, viewer?: Player): number;
    damageEffect(target: Player, source: Player | null, player: Player, nature?: string): number;
    [key: string]: any;
}

declare interface Library {
    filter: LibFilter;
    skill: Record<string, Skill>;
    translate: Record<string, string>;
    config: Record<string, any>;
    [key: string]: any;
}

declare interface Game {
    me: Player;
    players: Player[];
    dead: Player[];
    playerMap: Record<string, Player>;
    online: boolean;
    connectMode: boolean;
    log(...args: any[]): void;
    delay(seconds?: number): Promise<GameEvent>;
    asyncDelay(seconds?: number): Promise<GameEvent>;
    broadcastAll(func: () => void): void;
    broadcast(func: (...args: any[]) => void, ...args: any[]): void;
    hasPlayer(filter: (player: Player) => boolean, includeOut?: boolean): boolean;
    countPlayer(filter: (player: Player) => boolean, includeOut?: boolean): number;
    filterPlayer(filter: (player: Player) => boolean, includeOut?: boolean): Player[];
    cardsDiscard(cards: Card | Card[]): Promise<GameEvent>;
    loseAsync(info: Record<string, any>): Promise<GameEvent>;
    createEvent(name: string, trigger?: boolean): GameEvent;
    check(event?: GameEvent): void;
    uncheck(): void;
    pause(): void;
    resume(): void;
    addGlobalSkill(skill: string): void;
    removeGlobalSkill(skill: string): void;
    trySkillAudio(skill: string, player: Player, direct?: boolean): void;
    logSkill(skill: string, player: Player, targets?: Player | Player[], nature?: string): void;
    [key: string]: any;
}

declare const lib: Library;
declare const game: Game;
declare const ui: any;
declare const get: Get;
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
