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
    cards?: Card[];
    hasGaintag(tag: string): boolean;
    hasNature(nature: string, player?: Player): boolean;
    addGaintag(gaintag: string | string[]): void;
    removeGaintag(tag?: string | true): void;
    addNature(nature: string): void;
    removeNature(nature: string): void;
    init(card: [string, string, number | string, string?] | Card | VCard): void;
    copy(): Card;
    clone(): Card;
    destroy(): void;
    selfDestroy(event?: GameEvent): void;
    willBeDestroyed(targetPosition: string, player?: Player, event?: GameEvent): boolean;
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
    isHealthy(): boolean;
    isTurnedOver(): boolean;
    isLinked(): boolean;
    isMaxHp(only?: boolean, raw?: boolean, filter?: (player: Player) => boolean): boolean;
    isMinHp(only?: boolean, raw?: boolean, filter?: (player: Player) => boolean): boolean;
    isMaxMaxHp(only?: boolean, filter?: (player: Player) => boolean): boolean;
    isMinMaxHp(only?: boolean, filter?: (player: Player) => boolean): boolean;
    isMaxCard(only?: boolean, filter?: (player: Player) => boolean): boolean;
    isMinCard(only?: boolean, filter?: (player: Player) => boolean): boolean;
    isMaxHandcard(only?: boolean, filter?: (player: Player) => boolean): boolean;
    isMinHandcard(only?: boolean, filter?: (player: Player) => boolean): boolean;
    isMaxEquip(only?: boolean, filter?: (player: Player) => boolean): boolean;
    isMinEquip(only?: boolean, filter?: (player: Player) => boolean): boolean;
    getHp(raw?: boolean): number;
    getDamagedHp(raw?: boolean): number;
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
    getCardIndex(position: string, name: string, card: Card, max?: number): number;

    // 基础操作
    draw(num?: number): Promise<GameEvent>;
    draw(params: Record<string, any>): Promise<GameEvent>;
    discard(cards: Card | Card[], delay?: boolean): Promise<GameEvent>;
    discard(params: Record<string, any>): Promise<GameEvent>;
    lose(cards: Card | Card[], hs?: boolean, es?: boolean, js?: boolean, ss?: boolean): Promise<GameEvent>;
    lose(params: Record<string, any>): Promise<GameEvent>;
    gain(cards: Card | Card[], log?: boolean): Promise<GameEvent>;
    gain(cards: Card | Card[], source: Player): Promise<GameEvent>;
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
    canRespond(event: GameEvent, card?: Card | string, type?: string): boolean;
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
    setStorage(name: string, value: any, mark?: boolean): any;

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

    // 名称
    getName(forDialog?: boolean): string;
    getName1(): string;
    getName2(): string;

    // 存储
    setStorage(name: string, value: any, mark?: boolean): any;
    getStorage(name: string, defaultValue?: any): any;
    hasStorage(name: string, value?: any): boolean;
    hasStorageAny(name: string, ...values: any[]): boolean;
    hasStorageAll(name: string, ...values: any[]): boolean;
    initStorage(name: string, value: any, mark?: boolean): any;
    updateStorage(name: string, operation: (value: any) => any, mark?: boolean): any;
    updateStorageAsync(name: string, operation: (value: any) => any | Promise<any>, mark?: boolean): Promise<any>;
    removeStorage(name: string, mark?: boolean): boolean;

    // 武将牌上（扩展区）的牌
    getExpansions(tag: string): Card[];
    countExpansions(tag: string): number;
    hasExpansions(tag: string): boolean;

    // 装备/判定栏
    hasEquip(slot: string): boolean;
    getVEquip(name: string | number): VCard | null;
    getVEquips(subtype?: string | number | Card | VCard): VCard[];
    hasVCard(name: string | ((vcard: VCard) => boolean), position: string): boolean;
    hasEmptySlot(type: string | number): boolean;
    countEmptySlot(type: string | number): number;
    hasEquipableSlot(type: string | number): boolean;
    countEquipableSlot(type: string | number): number;
    hasEnabledSlot(type: string | number): boolean;
    countEnabledSlot(type: string | number): number;
    hasDisabledSlot(type: string | number): boolean;
    countDisabledSlot(type: string | number): number;
    disableEquip(params: any): Promise<GameEvent>;
    enableEquip(params: any): Promise<GameEvent>;
    expandEquip(params: any): Promise<GameEvent>;
    isDisabledJudge(): boolean;

    // 特殊操作
    chooseToCompare(target: Player, prompt?: string): Promise<GameEvent>;
    chooseToPSS(prompt?: string): Promise<GameEvent>;
    gift(cards: Card | Card[], target: Player): Promise<GameEvent>;
    canGift(card: Card, target: Player, strict?: boolean): boolean;
    refuseGifts(card: Card, player: Player): boolean;
    getGiftEffect(card: Card, target: Player): number;
    getGiftAIResultTarget(card: Card, target: Player): number;
    recast(cards: Card | Card[], recastingLose?: any, recastingGain?: any): Promise<GameEvent>;
    canRecast(card: Card, source?: Player, strict?: boolean): boolean;
    executeDelayCardEffect(card: Card | string, target?: Player, judge?: (card: Card) => number, judge2?: (result: Result) => boolean): Promise<GameEvent>;
    addShownCards(cards: Card | Card[], gaintag?: string | string[]): Promise<GameEvent>;
    hideShownCards(cards: Card | Card[], gaintag?: string | string[]): Promise<GameEvent>;
    getShownCards(gaintag?: string): Card[];
    countShownCards(gaintag?: string): number;
    hasShownCards(gaintag?: string): boolean;
    getKnownCards(other: Player, filter?: string | ((card: Card) => boolean)): Card[];
    isAllCardsKnown(other: Player): boolean;
    hasKnownCards(other: Player, filter?: string | ((card: Card) => boolean)): boolean;
    countKnownCards(other: Player, filter?: string | ((card: Card) => boolean)): number;
    connectCards(cards: Card | Card[], source?: Player, log?: boolean): Promise<GameEvent>;
    resetConnectedCards(cards: Card | Card[], source?: Player, log?: boolean): Promise<GameEvent>;
    getConnectedCards(): Card[];
    countConnectedCards(): number;
    hasConnectedCards(): boolean;
    addZhanfa(id: string): void;
    removeZhanfa(id: string): void;
    hasZhanfa(id: string): boolean;
    addTip(index: string, message: string, isTemp?: boolean, css?: Record<string, string>): void;
    removeTip(index?: string): void;
    changeFury(amount: number, limit?: boolean): void;
    sortHandcard(sort?: string | ((cardA: Card, cardB: Card) => number)): void;
    sortHandcardOL(sort?: string | ((cardA: Card, cardB: Card) => number)): void;
    clearSkills(): void;
    hasHiddenSkill(skill: string): boolean;
    hasBannedSkill(skill: string): boolean;
    awakenSkill(skill: string): void;

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
    translation(target: string | Card | Player | VCard, ...args: any[]): string;
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
    suit(card: Card | VCard | undefined, player?: Player): string;
    number(card: Card | VCard | undefined): number | string;
    name(card: Card | VCard | undefined): string;
    color(card: Card | VCard | undefined): string;
    owner(card: Card | VCard | undefined): Player;
    cardPile(filter: (card: Card) => boolean, position?: string): Card;
    playerCardFilter(player: Player, position: string): boolean;
    info(skill: string): Skill;
    copy(skill: string): Skill;
    skill(skill: string): Skill;
    type(card: Card | VCard | undefined): string;
    type2(card: Card | VCard | undefined): string;
    subtype(card: Card | VCard | undefined, only?: boolean): string;
    rawName(str: string): string;
    groupnature(group: string, method?: string): string;
    numOf(arr: any[], item: any): number;
    strNumber(num: number | string, nature?: string): string;
    yingbianEffect(card: Card): string;
    yingbianLevel(card: Card): number;
    event(): GameEvent;
    player(): Player;
    target(): Player;
    targets(): Player[];
    card(): Card;
    cards(): Card[];
    effect(target: Player, card: Card | VCard | string, player: Player, viewer?: Player): number;
    damageEffect(target: Player, source: Player | null, player: Player, nature?: string): number;
    config(key: string, defaultValue?: any): any;
    [key: string]: any;
}

declare interface Library {
    filter: LibFilter;
    skill: Record<string, Skill>;
    card: Record<string, any>;
    translate: Record<string, string>;
    config: Record<string, any>;
    onresize: (() => void)[];
    onover: ((result: any) => void)[];
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
    print(...args: any[]): void;
    delay(seconds?: number): Promise<GameEvent>;
    delayx(): Promise<GameEvent>;
    asyncDelay(seconds?: number): Promise<GameEvent>;
    asyncDelayx(): Promise<GameEvent>;
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
    over(bool?: boolean): void;
    restart(): void;
    reload(): void;
    addGlobalSkill(skill: string): void;
    removeGlobalSkill(skill: string): void;
    trySkillAudio(skill: string, player: Player, direct?: boolean): void;
    logSkill(skill: string, player: Player, targets?: Player | Player[], nature?: string): void;
    saveConfig(key: string, value?: any): void;
    loadConfig(key?: string, defaultValue?: any): any;
    addVideo(type: string, player?: Player, info?: any): void;
    playVideo(): void;
    asyncWait(): Promise<void>;
    waitForPlayer(): void;
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
