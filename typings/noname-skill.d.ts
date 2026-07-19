// 此文件由 build-typings.js 自动生成，合并自项目 src/typings/type.d.ts 和 Skill.d.ts
// 用于在 VS Code 插件中为无名杀技能编辑提供 IntelliSense

//这里主要是声明各种游戏内常用的对象的结构
type listeners = {
    [key in keyof HTMLElementEventMap]?: EventListener;
};

type styleObj = {
    [key in keyof CSSStyleDeclaration]?: string;
}

/** 
 * @deprecated
 * key为字符串的Record
 */
type SMap<V> = Record<string, V>;

/** 单体与集合类型 */
type SAAType<T> = T | T[];


type Row_Item = SAAType<Card | Player | string>;
type Row_Item_Option<T = Row_Item> = {
    /**添加的东西，可以是string,card,player或它们的数组 */
    item: T;
    /**行中有多个框，每个框的样式 */
    itemContainerCss?: CSSStyleDeclaration;
    /**每个框中有多个项目，每个项目的样式，比如每个卡的样式 */
    itemCss?: CSSStyleDeclaration;
    /**自定义的方法，可以自定义加完后的一些逻辑 */
    custom?: (itemContainer: HTMLDivElement) => void;
    /**每个框所分配行的总宽度的比例 */
    ratio?: number;
    /**控制每个框中的项目是否可以支持点击 */
    ItemNoclick?: boolean;
    /**点击每个项目的回调函数
     * @param item 当前点击的item
     * @param itemContainer 当前item所在的容器
     * @param AllItemConatainers 所有的容器框
     * @param e 鼠标事件
     */
    clickItem?: (item: HTMLDivElement, itemContainer: HTMLDivElement, AllItemConatainers: HTMLDivElement[], e: MouseEvent) => void;
    /**
     * 点击框的回调事件
     * @param itemContainer 当前点击的框
     * @param item 框中最开始加入的原始的项目
     * @param AllItemConatainers 所有的容器框
     * @param e 鼠标事件
     */
    clickItemContainer?: (itemContainer: HTMLDivElement, item: T, AllItemConatainers: HTMLDivElement[], e: MouseEvent) => void;
    overflow?: 'fold' | 'scroll' | 'hidden';
};
declare type RowItem = Row_Item | Row_Item_Option<Row_Item>;

/** 技能content */
declare type ContentFuncByAll = (event: GameEvent, trigger: GameEvent, player: Player) => Promise<any>;
declare type ContentFuncsByAll = ((event: GameEvent, trigger: GameEvent, player: Player, result: Partial<Result>) => Promise<any>)[];

declare type OldContentFuncByAll = () => void

declare type Status = any;
declare type UI = any;
declare type AI = any;

// Button 类型由下方的简化定义提供
// Card 类型由下方的简化定义提供
// VCard 类型由下方的简化定义提供
// Dialog 类型由下方的简化定义提供
// GameEvent 类型由下方的简化定义提供
// Player 类型由下方的简化定义提供
// Control 类型由下方的简化定义提供
// Game / Library / Get 类型由下方的简化定义提供

// Video 类型由下方的简化定义提供
// Videos 类型由下方的简化定义提供
// GameHistory 类型由下方的简化定义提供

declare type Sex = 'male' | 'female' | 'dobule' | 'none';
declare type Character = [Sex, string, number | string, string[], string[]] | [Sex, string, number | string, string[]] | any;
declare type Select = [begin: number, end: number];

declare interface progress extends HTMLDivElement {
    /** 获取标题 */
    getTitle: () => string;
    /** 更改标题 */
    setTitle: (title: string) => void;
    /** 获取显示的文件名 */
    getFileName: () => string;
    /** 更改显示的文件名 */
    setFileName: (title: string) => void;
    /** 获取进度*/
    getProgressValue: () => number;
    /** 更改进度*/
    setProgressValue: (value: number) => void;
    /** 获取下载文件总数 */
    getProgressMax: () => number;
    /** 修改下载文件总数 */
    setProgressMax: (max: number) => void;
    /** 通过数组自动解析文件名 */
    autoSetFileNameFromArray: (fileNameList: string[]) => void;
}

/**
 * 导入武将包的配置
 */
declare interface importCharacterConfig {
    /** 武将包名 */
    name: string;
    /** 
     * 设置该武将包是否可以联机 
     */
    connect?: boolean;
    /** 
     * 设置联机武将禁用列表 
     * */
    connectBanned?: string[];
    /** 
     * 设置武将基本配置信息
     */
    character: Record<string, Character>;
    /** 
     * 设置武将介绍 
     * */
    characterIntro?: Record<string, string>;
    /** 
     * 设置武将标题（用于写称号或注释）
     * */
    characterTitle?: Record<string, string>;
    /** 
     * 设置技能 
     * */
    skill?: Record<string, Skill>;
    /** 
     * 设置珠联璧合武将 
     * */
    perfectPair?: Record<string, string[]>;
    /** 
     * 设置指定武将的过滤方法（传入一个mode，用于过滤玩法模式） 
     * */
    characterFilter?: Record<string, (mod: string) => boolean>;
    /** 
     * 设置在武将包界面分包
     */
    characterSort?: Record<string, Record<string, string[]>>;
    /** 
     * 设置该武将包独有的卡牌（或者是特殊卡牌） 
     * 
     * */
    card?: Record<string, any>;
    /** 
     * 设置自定义卡牌类型的排序用的优先级
     * */
    cardType?: Record<string, number>;
    /**
     * 设置动态翻译（本地化）【v1.9.105】
     * 
     * 指定lib.dynamicTranslate.xxx为一个函数 即可让技能xxx显示的描述随玩家状态而变化 并实现技能修改等
     * 
     * Player:指技能拥有者
     */
    dynamicTranslate?: Record<string, (player: Player) => string>;
    /** 
     * 选择武将时，武将左下角可进行替换的武将配置【v1.9.106.3】 
     * 
     * */
    characterReplace?: Record<string, string[]>;

    translate?: Record<string, string>;
    /**
     * 对应lib.element
     * 
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    element?: Record<string, any>;
    /**
     * 对应ai
     * 
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    ai?: Record<string, any>;
    /**
     * 对应ui
     * 
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    ui?: Record<string, any>;
    /**
     * 对应game
     * 
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    game?: Record<string, any>;
    /**
     * 类型：键值对
     * 
     * 作用：对应get
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    get?: Record<string, any>;
    /**
     * 帮助内容将显示在菜单－选项－帮助中
     * 
     * 游戏编辑器的帮助代码基本示例结构：
     * 
     * "帮助条目":
     * ```jsx
     *  <ul>
     *      <li>列表1-条目1
     *      <li>列表1-条目2
     *  </ul>
     *  <ol>
     *      <li>列表2-条目1
     *      <li>列表2-条目2
     *  </ul>
     * ```
     * (目前可显示帮助信息：mode，extension，card卡包，character武将包)
     */
    help?: Record<string, string>;

    [key: string]: any;
}
/**
 * 导入卡牌包的配置
 */
declare interface importCardConfig {
    /** 卡牌包名 */
    name: string;
    /** 
     * 设置该卡包是否可以联机 
     * */
    connect?: boolean;
    /** 
     * 设置卡牌
     * */
    card: Record<string, Card>;
    /** 
     * 设置卡牌技能 
     * */
    skill: Record<string, Skill>;
    /** 
     * 设置从牌堆添加指定卡牌
     * */
    list: CardBaseUIData[];
    /** 卡牌翻译 */
    translate: Record<string, string> | string;
    /**
     * 帮助内容将显示在菜单－选项－帮助中
     * 
     * 游戏编辑器的帮助代码基本示例结构：
     * 
     * "帮助条目":
     * ```jsx
     *  <ul>
     *      <li>列表1-条目1
     *      <li>列表1-条目2
     *  </ul>
     *  <ol>
     *      <li>列表2-条目1
     *      <li>列表2-条目2
     *  </ul>
     * ```
     * (目前可显示帮助信息：mode，extension，card卡包，character武将包)
     */
    help?: Record<string, string>;

    [key: string]: any;
}

/**
 * 导入玩法模式的配置
 */
declare interface importModeConfig {
    /** 模式名 */
    name: string;
    /** 技能（主要是放些该模式下特有的技能） */
    skill?: Record<string, Skill>;
    /** 
     * 武将包
     */
    characterPack?: Record<string, Record<string, Character>>;
    /**
     * 武将分类排序
     */
    characterSort?: Record<string, Record<string, string[]>>;
    /** 卡牌（主要是放些该模式下特有的卡牌） */
    card?: Record<string, Card>;
    /** 
     * 卡包
     */
    cardPack?: Record<string, Record<string, string[]>>;
    /**
     * mode的init方法（若有，init是最早启动的方法）
     */
    init?(): void;
    /**
     * mode的start启动方法
     */
    start: ContentFuncByAll;
    /**
     * mode的start启动之前的处理方法
     */
    startBefore?(): void;
    /**
     * 重新初始化
     * 
     * 在lib.client.reinit中，
     * 
     * game.loadModeAsync，读取mode时启用这个初始化。
     * 
     * 具体作用：有待考究
     */
    onreinit?(): void;
    /**
     * 对应lib.element
     * 
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    element?: Record<string, any>;
    /**
     * 对应ai
     * 
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    ai?: Record<string, any>;
    /**
     * 对应ui
     * 
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    ui?: Record<string, any>;
    /**
     * 对应game
     * 
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    game?: Record<string, any>;

    /**
     * 类型：键值对
     * 
     * 作用：对应get
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    get?: Record<string, any>;
    /**
     * 帮助内容将显示在菜单－选项－帮助中
     * 
     * 游戏编辑器的帮助代码基本示例结构：
     * 
     * "帮助条目":
     * ```jsx
     *  <ul>
     *      <li>列表1-条目1
     *      <li>列表1-条目2
     *  </ul>
     *  <ol>
     *      <li>列表2-条目1
     *      <li>列表2-条目2
     *  </ul>
     * ```
     * (目前可显示帮助信息：mode，extension，card卡包，character武将包)
     */
    help?: Record<string, string>;

    [key: string]: any;
}

/**
 * 导入武将的配置
 */
declare interface importPlayerConfig {
    /** 武将包名 */
    name: string;
    /** 禁用此扩展的模式 */
    forbid: string[];
    /** 可使用模式 */
    mode: string[];
    //自定义是实现核心初始化方法
    init?(): void;
    arenaReady?(): void;
    /**
      * 对应lib.element
      * 
      * 若里面是项目内的同名字段，将覆盖原方法
      */
    element?: Record<string, any>;
    /**
     * 对应ai
     * 
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    ai?: Record<string, any>;
    /**
     * 对应ui
     * 
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    ui?: Record<string, any>;
    /**
     * 对应game
     * 
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    game?: Record<string, any>;

    /**
     * 类型：键值对
     * 
     * 作用：对应get
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    get?: Record<string, any>;

    [key: string]: any;
}

/**
 * 导入扩展的配置
 */
declare interface importExtensionConfig {
    /** 扩展名 */
    name: string;
    /** 用于解析用的key，不直接参与游戏逻辑，参与自己定义的解析流程，统一该包的前缀 */
    key?: string;
    /** 
     * 是否可编辑该扩展（需要打开显示制作扩展）
     * 
     * （都满足条件，则可以开启“编辑此扩展”功能）
     */
    editable?: boolean;
    /** 
     * 该扩展菜单的配置 
     * 
     * 名字："extension_" + key
     * 
     * 内容： value
     * 
     * (也是游戏编辑器中的选项代码部分)
     */
    config?: Record<string, SelectConfigData>;
    /**
     * 联机配置（目前扩展已经不能联机）
     * 
     * 特殊接口：update
     */
    connect?: Record<string, SelectConfigData>;
    /**
     * 扩展的包信息。
     * 
     * 包括卡牌，技能，人物的代码以及中文翻译
     */
    package: PackageData;
    /**
     * 函数执行时机为游戏数据加载之后、界面加载之前
     * 
     * （游戏编辑器中的主代码部分）
     * 
     * 注：即选择了玩法模式之后加载的内容部分；
     * @param config 扩展选项/配置
     * @param pack 扩展定义的武将、卡牌和技能等
     */
    content?(config: Record<string, any>, pack: PackageData): void;
    /**
     * 函数执行时机为游戏数据加载之前，且不受禁用扩展的限制，除添加模式外请慎用
     * 
     * （也是游戏编辑器中的启动代码部分）
     * 
     * 注：game.import添加扩展时就加载，即当前游戏加载菜单界面时就已经加载；
     * 
     * 注2：当前扩展联机时，需要直接再此扩展；为了方便扩展，大部分扩展直接在这里扩展；
     * @param data 保存在lib.config中”extension_扩展名“为前缀的配置
     */
    precontent?(data?: Record<string, any>): void;
    /** 删除该扩展后调用 */
    onremove?(): void;
    /** 
     * 帮助内容将显示在菜单－选项－帮助中
     * 
     * 游戏编辑器的帮助代码基本示例结构：
     * 
     * "帮助条目":
     * ```jsx
     *  <ul>
     *      <li>列表1-条目1
     *      <li>列表1-条目2
     *  </ul>
     *  <ol>
     *      <li>列表2-条目1
     *      <li>列表2-条目2
     *  </ul>
     * ```
     * (目前可显示帮助信息：mode，extension，card卡包，character武将包)
     */
    help?: Record<string, string>;
    /** 相关文件名 */
    files?: {
        character?: string[],
        card?: string[],
        skill?: string[]
    };
    /**
     * 【特殊】用于game.addMode添加时，
     * 用于显示模式icon，所有的图片路径的imgsrc，指定外层扩展文件名；
     */
    extension?: string;
    /**
     * 对应lib.element,
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    element?: Record<string, any>;
    /**
     * 对应ai
     */
    ai?: Record<string, any>;
    /**
     * 对应ui
     */
    ui?: Record<string, any>;
    /**
     * 对应game
     */
    game?: Record<string, any>;
    /**
     * 对应get
     */
    get?: Record<string, any>;
    /** 
     * 可以继续加入更多对象：
     * 这些对象会对应附加在lib中，或替换对应lib位置的对象：
     * 例如：translate，help，skill... ... 或者其他自定义的...
     */
    [key: string]: any;
}

/**
 * 导入玩法的配置
 */
declare interface importPlayConfig {
    /** 扩展名 */
    name: string;
    arenaReady?: Function;
    /**
     * 设置播放录像
     */
    video?: Function;
    /** 
     * 设置技能 
     * */
    skill?: Record<string, Skill>;
    /** 
     * 设置该武将包独有的卡牌（或者是特殊卡牌） 
     * 
     * */
    card?: Record<string, any>;
    translate?: Record<string, string>;
    /**
     * 对应lib.element
     * 
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    element?: Record<string, any>;
    /**
     * 对应ai
     * 
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    ai?: Record<string, any>;
    /**
     * 对应ui
     * 
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    ui?: Record<string, any>;
    /**
     * 对应game
     * 
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    game?: Record<string, any>;
    /**
     * 类型：键值对
     * 
     * 作用：对应get
     * 若里面是项目内的同名字段，将覆盖原方法
     */
    get?: Record<string, any>;
    /**
     * 帮助内容将显示在菜单－选项－帮助中
     * 
     * 游戏编辑器的帮助代码基本示例结构：
     * 
     * "帮助条目":
     * ```jsx
     *  <ul>
     *      <li>列表1-条目1
     *      <li>列表1-条目2
     *  </ul>
     *  <ol>
     *      <li>列表2-条目1
     *      <li>列表2-条目2
     *  </ul>
     * ```
     * (目前可显示帮助信息：mode，extension，card卡包，character武将包)
     */
    help?: Record<string, string>;
    [key: string]: any;
}

/** 
 * 菜单的选项的配置 
 * 
 * config的功能菜单的node._link.config，就是该config
 * 内部代码略复杂，太多UI相关逻辑，看不懂（等日后精进，再继续再战）
 */
declare interface SelectConfigData {
    /** 功能名 */
    name: string;
    /** 
     * 【核心】初始化时默认的选项/配置/模式（对应下面item的key）
     */
    init?: boolean | string;
    /** 
     * 【核心】二级菜单配置(当前config内容的菜单)
     */
    item?: Record<string, string> | (() => Record<string, string>);
    /** 
     * 功能说明
     * 
     * 若没有，也不是其他特殊的选项，则显示“设置 + name”
     */
    intro?: string | (() => string);

    /**
     * 显示bar(添加了“withbar”,有一定的居中效果，即当前menu的头部或者尾部)
     * 
     * @param node 创建出来的visualBar节点
     * @param item item选项
     * @param create 即内部自定义的createNode方法，一般不直接使用该方法，目前来看，可以内部重新定义覆盖该方法，自己达成创建item列表的方式
     * @param switcher 当前config的item的node节点
     */
    visualBar?: (node: HTMLDivElement, item: Record<string, string>, create: (arg: string) =>  void, switcher?: HTMLDivElement) => void
    /**
     * 显示菜单
     * 显示一个以3列为一行的显示列表（内部实现）
     * @param node 当前配置项的节点
     * @param item 当前node的node._link
     * @param name item选项
     * @param config 当前的config
     */
    visualMenu?: (node: HTMLDivElement, link: any, name: string, config: SelectConfigData) => void;
    /**
     * 文本菜单
     * 当前不存在visualMenu的话，则创建item列表节点，若有该属性则执行
     * @param node 
     * @param link 
     */
    textMenu?(node: HTMLDivElement, link: string, config: SelectConfigData): void;

    /** 
     * 清理游戏，核心选项，应该默认是false(undefined)<--该功能不知是否存在
     * 
     * 若没有nopointer配置（false/undefined）,则设置“pointerspan”
     * 
     * 通“click”,即当前整个node都可以点击<--这个应该才是真实的功能
     */
    clear?: boolean;
    /** 指定该项没有功能，仅展示，项目内多用于描述上 */
    nopointer?: boolean;
    /** 
     * 点击触发事件
     * 
     * 若有返回值false，则当前点击事件的toggle切换无效
     */
    onclick?(item: any): void | boolean;
    onclick?(link: any, node: HTMLDivElement): void | boolean;

    /** 当前没有onclick方法时，除了默认game.saveConfig保存数据配置key的数据，可以使用该方法进行数据处理啊 */
    onsave?(reslut: any): void;

    /**
     * 输入框
     * 
     * 其输入框的默认值是当前的init属性
     */
    input?: boolean;
    /** 取值true，若没有设置可以进行input输入 */
    fixed?: boolean;
    /** 设置input节点的onblur事件的回调（焦点离开输出框） */
    onblur?(): void;

    /**
     * 用于扩展菜单lib.extensionMenu中(目前未见使用)
     */
    onswitch?(bool: boolean): void;

    /** 核心，更新方法 */
    update?(config: Record<string, any>, map: Record<string, HTMLDivElement>): any;

    /**
     * 在玩法模式选择中： 
     *  是否需要“重启”游戏，若为true，则“启”按钮会高亮（添加“glowing”）
     * 在选项中：
     *  每次改变该选项，都会重置当前的ui选项（增加，减少一些功能项） 
     */
    restart?: boolean | (() => boolean);
    /** 应该与unfrequent功能时一致的，相反判断，直接显示出来的功能项 */
    frequent?: boolean,
    /** 加入更多中（随着下拉出现），用得较多 */
    unfrequent?: boolean;
    /** 不明，用得很少 */
    content?(bool: boolean): void;

    /** 内部属性，记录当前配置的key */
    _name?: string;
}

/** 
 * 扩展的包信息
 * 游戏自带编辑器的代码编辑区域的扩展结构：
 * （主要是通过系统内部自带编译器编辑的代码，导入逻辑其实基本一致）
 */
declare interface PackageData {
    /** 扩展制作作者名 */
    author?: string,
    /** 扩展描述 */
    intro?: string,
    /** 讨论地址 */
    diskURL?: string,
    /** 网盘地址 */
    forumURL?: string,
    /** 扩展版本 */
    version?: string,
    /** 扩展在UI中显示的名字 */
    translation?:string;

    /** 武将导入信息 */
    character?: {
        character: Record<string, Character>;
        translate: Record<string, string>;
    };
    /** 卡牌导入信息 */
    card?: {
        card: Record<string, Card>;
        translate: Record<string, string>;
        list: CardBaseUIData[];
    };
    /** 技能导入信息 */
    skill?: {
        skill: Record<string, Skill>;
        translate: Record<string, string>;
    };

    /** 相关文件名（扩展所使用的一些图片） */
    files?: {
        character: string[];
        card: string[];
        skill: string[];
    }

    /** 主代码中，pack.code包括以下属性： */
    code?: {
        /** 扩展的config配置信息 */
        config?: Record<string, SelectConfigData>;
        /** 扩展主代码 */
        content?: (config: Record<string, any>, pack: PackageData) => void;
        /** 扩展帮助信息 */
        help?: Record<string, string>;
        /** 扩展启动代码 */
        precontent?: (data?: Record<string, any>) => void;
    }
}




interface When {
    /**一次性技能的内容，一个then中写一个step中的内容 */
    then(fun: ContentFuncByAll): When
    /**
     * ```plain
     * 闭包用法的then，不再提供parsex变量，改为使用闭包访问
     * 传参为 event, trigger, player
     *
     * 闭包即你可以直接在when里面访问when外面的变量
     * 如下：
     * ```
     * ```javascript
     * var att = get.attitude(player, target);
     *
     * player.when("phaseEnd")
     *     .step(() => {
     *         if (att > 0) // 闭包访问了外面定义的变量 att
     *             player.say("你好喵!");
     *     });
     * ```
     */
    step(fun: ContentFuncByAll): When
    /**添加临时技能的必要筛选条件，只有当添加的筛选条件都通过时，才能触发 */
    filter(fun: Required<Skill>['filter']): When
    /**
     * 向临时技能中添加技能可以拥有的一切属性
     *  */
    assign(obj: Skill): When
    /**触发时，弹出的显示提示字样 */
    popup(str: string): When
    /**
     * 用于在then中用到的变量
     * ```
     * player.when('useCard').vars({
     * targets:result.targets
     * }).then(()=>{
     * //这里面可以使用vars中传递的参数
     * targets.gain()
     * })
     * ```
    */
    vars(obj: Record<string, any>): When
    translation(str: string): When
    /**
     * 获得技能
     * 如果instantlyAdd为false，则需要以此法获得技能
     **/
    finish(): When
}

type _AllCardName = "caoyao" | "dinvxuanshuang" | "du" | "fengyinzhidan" | "hufu" | "jiu" | "sha" | "shan" | "shenmiguo" |
    "shoulijian" | "tao" | "tianxianjiu" | "xuejibingbao" | "yunvyuanshen" | "ziyangdan" | "caochuan" | "caochuanjiejian" |
    "zhulu_card" | "chenghuodajie" | "chenhuodajie" | "chiyuxi" | "chuansongmen" | "chuqibuyi" | "diaobingqianjiang" |
    "diaohulishan" | "dongzhuxianji" | "dunpaigedang" | "fudichouxin" | "geanguanhuo" | "guaguliaodu" | "guisheqi" | "guohe" |
    "heilonglinpian" | "huogong" | "huoshaolianying" | "jiedao" | "jiejia" | "jihuocard" | "jinchan" | "jingleishan" |
    "jinlianzhu" | "juedou" | "kaihua" | "linghunzhihuo" | "liufengsan" | "liuxinghuoyu" | "nanman" | "qijia" | "shandianjian" |
    "shatang" | "shencaojie" | "shenenshu" | "shengdong" | "shezhanqunru" | "shihuifen" | "shijieshu" | "shuiyanqijun" |
    "shuiyanqijunx" | "shujinsan" | "shunshou" | "suijiyingbian" | "tanshezhiren" | "taoyuan" | "tiesuo" | "toulianghuanzhu" |
    "tuixinzhifu" | "wangmeizhike" | "wanjian" | "wugu" | "wuxie" | "wuzhong" | "xianluhui" | "xietianzi" | "xingjiegoutong" |
    "yangpijuan" | "yiyi" | "youdishenru" | "yuanjiao" | "yuansuhuimie" | "zengbin" | "zhaomingdan" | "zhiliaobo" | "zhufangshenshi" |
    "zhujinqiyuan" | "bingliang" | "caomu" | "fulei" | "guiyoujie" | "hongshui" | "huoshan" | "lebu" | "shandian" | "chilongya" |
    "cixiong" | "duanjian" | "fangtian" | "fengxueren" | "guanshi" | "guding" | "guiyanfadao" | "hanbing" | "kuwu" | "pangufu" |
    "qibaodao" | "qilin" | "qinggang" | "qinglong" | "qixingbaodao" | "sanjian" | "wufengjian" | "wutiesuolian" | "wuxinghelingshan" |
    "xuanyuanjian" | "yajiaoqiang" | "yinyueqiang" | "yitianjian" | "zhangba" | "zheji" | "zhuge" | "zhungangshuo" | "zhuque" |
    "bagua" | "baihupifeng" | "baiyin" | "guangshatianyi" | "heiguangkai" | "huxinjing" | "lanyinjia" | "mianju" | "mutoumianju" |
    "nvzhuang" | "qinglianxindeng" | "renwang" | "serafuku" | "suolianjia" | "tengjia" | "yexingyi" | "yinfengjia" | "yinfengyi" |
    "dilu" | "hualiu" | "jueying" | "xiayuncailing" | "zhanxiang" | "zhuahuang" | "chitu" | "daihuofenglun" | "dawan" | "jingfanma" |
    "numa" | "yonglv" | "zixin" | "donghuangzhong" | "fuxiqin" | "gjyuheng" | "guilingzhitao" | "haotianta" | "jinhe" | "jiuwei" |
    "kongdongyin" | "kunlunjingc" | "langeguaiyi" | "lianyaohu" | "monkey" | "muniu" | "nvwashi" | "qiankundai" | "qinglonglingzhu" |
    "sadengjinhuan" | "shennongding" | "shentoumianju" | "shuchui" | "sifeizhenmian" | "taigongyinfu" | "tianjitu" | "tongque" | "xinge" |
    "xingjunyan" | "xixueguizhihuan" | "xuelunyang" | "yufulu" | "yuruyi" | "baishouzhihu" | "bingpotong" | "cangchizhibi" | "chunbing" |
    "feibiao" | "gouhunluo" | "gudonggeng" | "huanglinzhicong" | "jiguanfeng" | "jiguanshu" | "jiguantong" | "jiguanyaoshu" | "jiguanyuan" |
    "lingjiandai" | "liutouge" | "liyutang" | "longxugou" | "luyugeng" | "mapodoufu" | "mianlijinzhen" | "mizhilianou" | "molicha" |
    "mujiaren" | "qiankunbiao" | "qinglongzhigui" | "qingtuan" | "shenhuofeiya" | "tanhuadong" | "xiajiao" | "xuanwuzhihuang" | "yougeng" |
    "yuanbaorou" | "yuchandui" | "yuchangen" | "yuchankan" | "yuchankun" | "yuchanli" | "yuchanqian" | "yuchanxun" | "yuchanzhen" |
    "zhiluxiaohu" | "zhuquezhizhang"

type AllCardName = _AllCardName | (string & {})

//--------------------


//所有的由event.trigger()发出的时机信号汇总
type Signal_Trigger = `addShownCardsAfter` | `addToExpansionBefore` | `boss_baonuwash` | `changeHp` | `changeSkillsAfter` | `changeSkillsBefore` | `changeSkillsBegin` | `changeSkillsEnd` | `compare` | `compareCardShowBefore` | `compareFixing` | `damage` | `damageBegin1` | `damageBegin2` | `damageBegin3` | `damageBegin4` | `damageSource` | `damageZero` | `debateShowOpinion` | `die` | `discard` | `dying` | `enterGame` | `eventNeutralized` | `executeDelayCardEffect` | `fellow` | `gameStart` | `gift` | `giftAccept` | `giftAccepted` | `giftDenied` | `giftDeny` | `hideShownCardsAfter` | `jiananUpdate` | `judge` | `judgeFixing` | `juedou` | `loseToDiscardpile` | `phaseAfter` | `phaseBefore` | `phaseBeforeEnd` | `phaseBeforeStart` | `phaseBegin` | `phaseBeginStart` | `phaseChange` | `phaseDiscard` | `phaseDrawBegin1` | `phaseDrawBegin2` | `phaseEnd` | `phaseJudge` | `phaseOver` | `phaseUseAfter` | `phaseUseBefore` | `phaseUseBegin` | `phaseUseEnd` | `recast` | `recastingGain` | `recastingGained` | `recastingLose` | `recastingLost` | `removeCharacterBefore` | `removeSubPlayer` | `respond` | `rewriteDiscardResult` | `rewriteGainResult` | `roundStart` | `shaDamage` | `shaHit` | `shaMiss` | `shaUnhirt` | `showCharacterAfter` | `showCharacterEnd` | `skillAfter` | `subPlayerDie` | `triggerAfter` | `triggerHidden` | `triggerInvisible` | `useCard` | `useCard0` | `useCard1` | `useCard2` | `useSkill` | `washCard` | `wuguRemained` | `yingbian` | `zhuUpdate`;
//所有的带额外时机的事件汇总
type EventWithTrigger = `${_AllCardName}` | `${_AllCardName}Cancel` | `${_AllCardName}ContentAfter` | `${_AllCardName}ContentBefore` | `[skillname]` | `[skillname]ContentAfter` | `[skillname]ContentBefore` | `[skillname]_cost` | `_save` | `addFellowAuto` | `addJudge` | `addToExpansion` | `boss_jingjia` | `callSubPlayer` | `caochuan_gain` | `cardsDiscard` | `cardsGotoOrdering` | `cardsGotoPile` | `cardsGotoSpecial` | `carryOutJunling` | `changeCharacter` | `changeGroup` | `changeHp` | `changeHujia` | `changeVice` | `chessMech` | `chessMechRemove` | `chooseBool` | `chooseButton` | `chooseButtonOL` | `chooseCard` | `chooseCardOL` | `chooseCardTarget` | `chooseCharacter` | `chooseCharacterOL` | `chooseControl` | `chooseCooperationFor` | `chooseJunlingControl` | `chooseJunlingFor` | `choosePlayerCard` | `chooseSkill` | `chooseTarget` | `chooseToCompare` | `chooseToDebate` | `chooseToDisable` | `chooseToDiscard` | `chooseToDuiben` | `chooseToEnable` | `chooseToGive` | `chooseToGuanxing` | `chooseToMove` | `chooseToMoveChess` | `chooseToMove_new` | `chooseToPSS` | `chooseToPlayBeatmap` | `chooseToRespond` | `chooseToUse` | `chooseUseTarget` | `compareMultiple` | `damage` | `die` | `disableEquip` | `disableJudge` | `discard` | `discardPlayerCard` | `discoverCard` | `doubleDraw` | `draw` | `dying` | `enableEquip` | `enableJudge` | `equip` | `equip_${_AllCardName}` | `executeDelayCardEffect` | `exitSubPlayer` | `expandEquip` | `finish_game` | `gain` | `gainMaxHp` | `gainPlayerCard` | `game` | `gameDraw` | `gift` | `guozhanDraw` | `gzzhenxi_use` | `hideCharacter` | `judge` | `link` | `loadMap` | `loadPackage` | `lose` | `loseAsync` | `loseHp` | `loseMaxHp` | `loseToDiscardpile` | `lose_${_AllCardName}` | `lose_[VEquip.name]` | `mayChangeVice` | `moveCard` | `nvzhuang_lose` | `phaseDiscard` | `phaseDraw` | `phaseJieshu` | `phaseJudge` | `phaseLoop` | `phaseZhunbei` | `phaseAny` | `pre_[event.wuxieresult2]` | `pre_[skillname]` | `qinglong_guozhan` | `recast` | `recover` | `removeCharacter` | `replaceChessPlayer` | `replaceEquip` | `replaceHandcards` | `replacePlayer` | `respond` | `showCards` | `showHandcards` | `stratagemCamouflage` | `stratagemInsight` | `swapEquip` | `toggleSubPlayer` | `turnOver` | `useCard` | `useSkill` | `versusDraw` | `viewCards` | `viewCharacter` | `yingbianEffect` | `yingbianZhuzhan` | `zhuque_clear` | `undefined`;
//所有的不带额外时机的事件汇总,即game.createEvent(xxx,false)
type EventWithoutTrigger = `[eventname]Inserted` | `addShownCards` | `arrangeTrigger` | `changeSkills` | `chooseDrawRecover` | `debateCallback` | `delay` | `delayx` | `dieAfter` | `enterGame` | `gainMultiple` | `game` | `hideShownCards` | `judgeCallback` | `leaderView` | `loadMode` | `logSkill` | `logSkillBegin` | `orderingDiscard` | `phase` | `phaseUse` | `qianlidanji_replace` | `replacePlayer` | `replacePlayerSingle` | `replacePlayerTwo` | `shidianyanluo_huanren` | `showCharacter` | `showYexings` | `swapHandcards` | `trigger` | `useCardToExcluded` | `useCardToPlayer` | `useCardToPlayered` | `useCardToTarget` | `useCardToTargeted` | `video` | `waitForPlayer` | `wuxianhuoli_reward` | `year_limit_pop`;
//所有的事件汇总
type AllEvent = EventWithTrigger | EventWithoutTrigger;
//----------------------

//所有的由event派生的额外的时机信号
type Signal_Event = `${EventWithTrigger}Before` | `${EventWithTrigger}Begin` |
    `${EventWithTrigger}End` | `${EventWithTrigger}After` | `${EventWithTrigger}Skipped`

//【最终的所有的总的时机信号】 = 【由事件派生的】 + 【event.trigger()手动触发的】
type Signal = Signal_Event | Signal_Trigger | (string & {})


type EnableSignal1 = 'chooseToUse' | 'chooseToRespond' | 'chooseCard'
//技能的enable
type EnableSignal = 'phaseUse' | EnableSignal1 | EnableSignal1[]


interface CheckMod {
    <T extends string & keyof Mod>(...args: [...Parameters<Required<Mod>[T]>, name: T, skills: string[]]): ReturnType<Required<Mod>[T]>
}

interface History_UseSkill {
    /** 技能事件 */
    event: GameEvent,
    /** 技能名 */
    skill: string;
    /** 来源技能 */
    sourceSkill: string;
    /** 技能目标 */
    targets: Player[] | false;
    /** 技能类型 */
    type: "global" | "player";
}
interface ActionHistory {
    /** 使用卡牌 */
    useCard: GameEvent[],
    /** 响应 */
    respond: GameEvent[],
    /** 跳过 */
    skipped: GameEvent[],
    /** 失去卡牌 */
    lose: GameEvent[],
    /** 获得卡牌 */
    gain: GameEvent[],
    /** 伤害来源 */
    sourceDamage: GameEvent[],
    /** 造成伤害 */
    damage: GameEvent[],
    /** 自定义的东西 */
    custom: any[],
    /**使用的技能 */
    useSkill: History_UseSkill[]
    /**是否是[我this]的回合 */
    isMe?: boolean
    /**是否一轮的开端 */
    isRound?: boolean
}
type Stat = {
    /** 出牌(不同名字的牌单独计数) */
    card: Record<AllCardName, number>;
    /** 使用技能（不同名字的技能单独计数） */
    skill: Record<string, number>;
    /** 伤害 */
    damage?: number;
    /** 受到伤害 */
    damaged?: number;
    /** 摸牌 */
    gain?: number;
    /** 杀敌 */
    kill?: number;
    /** 使用技能次数（不区分统一计数） */
    allSkills?: number;
}

declare interface menuData {
    /** 菜单左方的数据列表 */
    leftPaneData: { name: string; attrs: Record<string, any> }[][];
    /** 缓存的vue实例 */
    rightPaneApps: Map<
      HTMLElement,
      { element: HTMLElement; app: any }
    >;
    /** 响应式的config */
    configDatas: Map<string, {
      [key: string]: SelectConfigData;
      update: (config: any, map: any) => any;
    }>;
    /** 初始化菜单左方的数据列表
     * @param connectMenu 是否是联机菜单
     */
    initLeftPaneData(connectMenu: boolean): { name: string; attrs: Record<string, any> }[][];
    /** 获取默认选中的元素 */
    getDefaultActive(
      connectMenu: boolean,
      nodes: HTMLElement[]
    ): HTMLElement | void;
    /** 初始化配置 */
    initConfigs(
      connectMenu: boolean,
      node: HTMLElement,
      startButton: HTMLElement
    ): void;
    /** 右方html模板 */
    rightPaneTemplate: any;
}


type BroadSelect = number | Select;

/** 时机 */
declare interface SkillTrigger {
	/** 
	 * 全场任意一名角色 
	 * 
	 * 代表所有人
	 */
	global?: Signal | Signal[];
	/** 
	 * 玩家自己 
	 * 
	 * 触发时件中，技能拥有者为事件的发起者;
	 * 
	 * 注：需要是自己引发的事件；
	 */
	player?: Signal | Signal[];
	/**
	 * 你自己成为目标时
	 */
	target?: Signal | Signal[];
	/**
	 * 来源是你自己时
	 */
	source?: Signal | Signal[];
}

/**
 * hookTrigger在不同方法中触发的方法接口
 * 
 * 注：似乎时用于模式，作为，游戏全局的一些每次都需要触发的方法（算是不实用的一个接口）
 */
declare interface SkillHookTrigger {
	/**
	 * 【hookTrigger相关】
	 * 
	 * 之后处理方法
	 * 
	 * 在createTrigger中最终步骤中，需要当前没有hookTrigger配置才调用到
	 * 
	 * 若返回true时，会触发“triggerAfter”
	 * 
	 * @param event 
	 * @param player 
	 * @param triggername 
	 */
	after?(event: GameEvent, player: Player, triggername: string): boolean;
	/**
	 * 【hookTrigger相关】
	 * 
	 * 在filterTrigger中执行，过滤发动条件，和filter有些类似，具体功能稍后分析
	 */
	block?(event: GameEvent, player: Player, name: string, skill: string): boolean;
	/**
	 * 【hookTrigger相关】
	 * 
	 * 在logSkill中执行，每次触发logSkill都会触发
	 */
	log?: (player: Player, skill: string, targets: Player[]) => void;
}

/** mod的配置 */
declare interface Mod {
	/**
	 * 卡牌能否主动弃置
	 */
	cardDiscardable?(card: Card, player: Player, eventName: string, result: boolean): boolean | void;
	/**
	 * 卡牌是否可用(卡牌能否被选择)
	 * 比cardEnabled2更弱一些
	 * 
	 * 适用范围：player.canUse，lib.filter.cardEnabled，默认lib.filter.filterCard
	 * 
	 */
	cardEnabled?(card: Card, player: Player, result: boolean): boolean | void;
	/**
	 * 卡牌是否可用（适用范围基本可以视为所有情况下）
	 * 
	 * 比cardEnable更弱一些
	 * 
	 * 适用范围：event.backup中技能信息触发（viewAS），cardEnabled（优先于该mod的触发），cardRespondable（优先于该mod的触发），_save（优先于cardSavable的mod触发）中均触发
	 */
	cardEnabled2?(card: Card, player: Player, result: boolean): boolean | void;
	/**卡牌能否被赠与 */
	cardGiftable?(card: Card, player: Player, target: Player, current: boolean): boolean | void
	/**卡牌能否被重铸 */
	cardRecastable?(card: Card, player: Player, source: Player, result: boolean): boolean | void
	/**
	 * 卡牌是否可用（改变卡牌的使用次数）
	 * 
	 * 要与cardEnabled一起使用（目前看来两个效果一致）
	 * 
	 * @param card  牌
	 * @param player  玩家
	 * @param num 使用次数
	 */
	cardUsable?(card: Card, player: Player, num: number): boolean | number | void;
	/**
	 * 卡牌是否可以响应
	 * 
	 * 要与cardEnabled一起使用（目前看来两个效果一致）
	 * 
	 */
	cardRespondable?(card: Card, player: Player, result: boolean): boolean | void;
	/**
	 * 卡牌是否可以救人
	 * 
	 * 要与cardEnabled一起使用（目前看来两个效果一致）
	 * 
	 * 注：还是和cardEnabled不同，设置了该mod检测，只要是在_save，濒死求救阶段，都可以触发；
	 * 
	 * 不过前提，可能还是要通过该阶段的cardEnabled的检测，目前还没确定，日后再做分析
	 * 
	 * 适用范围：濒死阶段的filterCard
	 * 
	 * @param card 牌
	 * @param player 玩家
	 * @param taregt 当前处于濒死求救得玩家
	 */
	cardSavable?(card: Card, player: Player, taregt: Player, reslut: boolean): boolean | void;
	/** 
	 * 在全局的防御范围 （globalToYou其他玩家到你的距离）
	 * 注：防御距离就是要和别人的距离越远，所以，拉开距离需要增加；
	 * @param from 表示其他玩家
	 * @param to 表示技能的拥有者
	 * @param current 当前的数值
	 */
	globalTo?(from: Player, to: Player, current: number): number | void;
	/** 
	 * 在全局的进攻距离 （globalFormYou其他玩家远离你的距离）
	 * 注：进攻距离就是要和别人的距离越近，所以，要打到别人需要减少；
	 * @param from 技能的拥有者
	 * @param to 表示其他玩家
	 * @param current 当前的距离
	 */
	globalFrom?(from: Player, to: Player, current: number): number | void;
	/**
	 * 你对其他角色的攻击范围
	 * @param from 技能的拥有者
	 * @param to 自带到谁的攻击距离
	 * @param range 当前的数值
	 * 
	 * 注：和globalForm同理，减少距离，减少；
	 */
	attackFrom?(from: Player, to: Player, range: number): number | void;
	/**
	 * 其他角色对你的攻击距离
	 * @param from 表示其他玩家
	 * @param to 表示技能的拥有者
	 * @param current 当前的数值
	 *  注：和globalTo同理，拉开距离，增加；
	 */
	attackTo?(from: Player, to: Player, range: number): number | void;
	/**
	 * 蓄力点上限
	 * @param player 玩家
	 * @param max 当前上限
	 */
	maxCharge?(player: Player, max: number): number | void;
	/** 手牌上限 */
	maxHandcard?(player: Player, num: number): number | void;
	/**
	 * 选择的目标范围,直接对range进行修改即可，无需返回值。
	 */
	selectTarget?(card: Card, player: Player, range: Select): void;
	/**
	* 【表示能否成为你的目标，返回true表示必须是你的目标，false不能成为你的目标】
	* @param card
	* @param player 源玩家（使用牌的角色）
	* @param target 目标玩家
	*/
	playerEnabled?(card: Card, player: Player, target: Player, result: boolean): boolean | void;
	/**
	* 【表示你能否成为其他角色的目标】 
	* @param card
	* @param player 使用牌的角色
	* @param target 玩家
	*/
	targetEnabled?(card: Card, player: Player, target: Player, result: boolean): boolean | void;

	/**
	 * 可以指定任意（范围内）目标
	 * @param card 牌
	 * @param player 玩家(使用牌的角色)
	 * @param target 目标
	 * @return 返回bool值可以不接受，范围检测，使用返回的结果;返回number，即计算距离是增加该距离；不返回，默认正常的范围检测
	 */
	targetInRange?(card: Card, player: Player, target: Player, result: boolean | number): boolean | number | void;
	/**
	 * 弃牌阶段时，忽略弃置的的手牌
	 * @param card 
	 * @param player 
	 */
	ignoredHandcard?(card: Card, player: Player, current: boolean): boolean | void;
	/** 表示自己牌能否被别人弃置 */
	canBeDiscarded?(card: Card, player: Player, target: Player, eventName: string, result: boolean): boolean | void;
	/** 
	 * 自己的牌能否被别人获得
	 * 装备区的牌能否被移动到其他角色装备区内
	 */
	canBeGained?(card: Card, player: Player, target: Player, eventName: string, reslut: boolean): boolean | void;
	/**往往用于装备牌，能否被顶替 */
	canBeReplaced?(card: Card, player: Player, current: boolean): boolean | void;
	/**
	 * 改变花色	用于get.suit
	 */
	suit?(card: Card, suit: string): string | void;
	/**
	 * 改变最终的判定结果
	 * @param player 
	 * @param result 
	 */
	judge?(player: Player, result: Result): Result | void;

	/** 是否能在判定阶段使用无懈 */
	wuxieJudgeEnabled?(card: Card, player: Player, current: Player, reslut: boolean): boolean | void;
	/** 是否能在判定阶段响应无懈 */
	wuxieJudgeRespondable?(card: Card, player: Player, current: Player, result: boolean): boolean | void;
	/** 是否能使用无懈 */
	wuxieEnabled?(card: Card, player: Player, target: Player, current: Player, result: boolean): boolean | void;
	/** 是否能响应无懈 */
	wuxieRespondable?(card: Card, player: Player, target: Player, current: Player, result: boolean): boolean | void;

	/** 改变卡牌名字  用于get.name*/
	cardname?(card: Card, player: Player, currentname: string): string | void;
	/** 改变卡牌伤害属性   用于get.nature*/
	cardnature?(card: Card, player: Player, currentnature: string): string | void | boolean;
	/** 改变卡牌的点数	用于get.number*/
	cardnumber?(card: Card, player: Player, num: number): number | void;
	/** 改变最终花色	用于get.suit*/
	cardsuit?(card: Card, player: Player, suit: string): string | void;
	/** 对特定角色使用牌的次数限制（用于优化【对特定角色使用牌无次数限制】的机制）【v1.9.105】 */
	cardUsableTarget?(card: Card, player: Player, target: Player, result: boolean): boolean | void;

	/** 用于get.value，对最后得返回value结果做处理 */
	aiValue?(player: Player, card: Card, num: number): number | void;
	/** 用于get.order，对最后得返回order结果做处理 */
	aiOrder?(player: Player, card: Card, num: number): number | void;

	/**
	 * 其他角色（to）是否在玩家（from）攻击范围内
	 * @param from 指代技能的拥有者
	 * @param to 表示其他迭代玩家
	 * */
	inRange?(from: Player, to: Player, current: boolean): boolean | void;
	/**
	* 玩家（to）是否在其他角色（from）的攻击范围内
	* @param from 表示其他人，迭代玩家
	* @param to 表示技能拥有者，即自己
	* */
	inRangeOf?(from: Player, to: Player, current: boolean): boolean | void;
	/** 用于手牌上限的判断，最先生效，主要用于改变手牌上限基数 */
	maxHandcardBase?(player: Player, num: number): number | void;
	/** 用于手牌上限的判断，最后生效，主要用于实现固定手牌上限 */
	maxHandcardFinal?(player: Player, num: number): number | void;

	/** 用于get.useful，对最后得返回useful结果做处理 */
	aiUseful?(player: Player, card: Card, num: number): number | void;
	/**
	 * 玩家的攻击范围
	 * @param player 玩家
	 * @param num 当前的数值
	 */
	attackRange?(player: Player, num: number): number | void;
	/**
	 * 玩家的攻击范围的基数
	 * @param player 玩家
	 * @param num 当前的数值
	 */
	attackRangeBase?(player: Player, num: number): number | void
	/**
	 * 玩家的攻击范围的最终数值
	 * @param player 玩家
	 * @param num 当前的数值
	 */
	attackRangeFinal?(player: Player, num: number): number | void
	chessMove?(player: Player, move: number): number | void

}

/** 技能 */
declare interface Skill {

	/** 【主动技中使用】能否选择死亡的玩家	*/
	deadTarget?: boolean
	/** 
	 * 【主动技中使用】能否在战棋/塔防模式中无视距离上限选择玩家
	 */
	chessForceAll?: boolean,
	/** 【主动技中使用】能否选择离场的玩家，例如调虎离山等*/
	includeOut?: boolean

	/** 
	 * 技能按钮名字，不写则默认为此技能的翻译（可认为为该技能用于显示的翻译名）
	 * 注：用得挺少得，貌似主要是使用翻译得
	 */
	name?: string;
	/** 
	 * 新版：用于记录自身名字key，希望能用于自身某些配置上直接使用......，需要测试过才肯定；【结果：失败，还是没用，屏蔽掉】
	 * 
	 * 旧版：用于解析用的key，不直接参与游戏逻辑，参与自己定义的解析流程，实质就是技能的名字，规范按技能名命名 
	 */
	// key?:string;

	/**
	 * 继承
	 * 
	 * 比较特殊的属性，继承当前技能没有的，而inherit继承技能中有的属性；
	 * 其中“audio”属性，尽可能直接继承赋值为inherit的名字；
	 * 同时，对应的翻译会覆盖成继承技能的翻译。
	 */
	inherit?: string;

	//声音
	/**
	 * 配音：
	 * 
	 * 主要分为：audioname（默认技能名），audioinfo（默认info.audio）
	 * 
	 * 若为字符串时，带有“ext:”，则使用无名杀录目\extension\扩展名内的配音（扩展的配音）
	 * 
	 * ，命名方法：技能名+这是第几个配音
	 * 
	 * 
	 * 否则，该字符串指代的是另一个技能的名字，若该技能名存在，则audioinfo为该技能的audio;
	 * 
	 * 若为数组，则是[audioname,audioinfo]，分布覆盖原有的值。
	 * 
	 * audioinfo为数字时，数字为配音数量索引（同一技能有多个配音），从1开始，使用无名杀目录\audio\skill内的配音（audioname1~audioinfo序号）;
	 * 
	 * audioinfo为布尔值true或者字符串非空时，执行game.playSkillAudio(audioname)，使用无名杀目录\audio\skill内的配音;
	 * 
	 * 否则，若为false，空字符串，null结果，则不播音，
	 * 
	 * 若info.audio:true，则使用game.playSkillAudio(audioname)。
	 * 
	 * 扩展(以game.trySkillAudio为准)：
	 * 
	 * 若info.audio是字符串：
	 * 
	 *     1.则主要是播放扩展声音,格式：ext:扩展包的名字:额外参数；
	 * 
	 *     2.直接就是技能名，即继承该技能的播放信息，audioinfo；
	 * 
	 * 若info.audio是数组，则[扩展名,额外参数]；
	 * 
	 * 额外参数：1."true"，则直接播放该名字的声音；2.数字，则是随机选一个该"技能名+1-数字范围"的声音播放；
	 *  
	 * 若info.audio是数字，则直接就是用解析出来的"audioname+1-数字范围";
	 */
	audio?: number | string | boolean | [string, number];
	/** 
	 * 指定武将名的音频。
	 * 
	 * 强制使用该audioname覆盖上面解析出来的audioname，其解析出来的audioname为“audioname_玩家武将名”,
	 * 
	 * 最终路径为：无名杀目录\audio\“audioname_玩家武将名”
	 * 
	 * 扩展：
	 *  若info.audioname存在，且是数组，且方法参数有player，则播放"audioname_玩家名"的声音（即可同一个技能，不同人播放不同声音）
	 */
	audioname?: string[];
	//【v1.9.102】
	/**
	 * 添加audioname2机制，用于重定向特定角色的语音到特定技能
	 * 
	 * 其key值为人物的name；
	 */
	audioname2?: Record<string, string>;
	/** 强制播放音频 */
	forceaudio?: boolean;


	//时机与触发相关
	/** 
	 * 触发的时机 
	 * 
	 * 一般用于触发技能（被动技能）
	 * 
	 * 注1：主动触发enable，是没有event._trigger;
	 * 
	 * 注2：有trigger，就表示这是一个触发技能，触发技能必须要有触发内容“content”，没有会引发报错；
	 */
	trigger?: SkillTrigger;

	/**
	 * 为true时，将该技能加入到_hookTrigger
	 * 
	 * 根据代码理解：
	 * 
	 * 通过addSkillTrigger，挂载在player._hookTrigger中；
	 * 
	 * 作为一个单独触发的方式，每次createTrigger，logSkill，filterTriggers时执行所有挂载在_hookTrigger所有对应的hookTrigger；
	 * 
	 * 目前可知，其相关使用方法：after,block,log【目前只有于国战方法中，应该是作为全局执行方法的一种简约写法，实用不大】
	 */
	hookTrigger?: SkillHookTrigger;

	/** 同时机技能发动的优先度 */
	priority?: number;

	//基本都在核心createTrigger，addTrigger，trigger中逻辑触发相关，属于重要得属性
	/** 
	 * 目前具体不知什么功能，当前所知，非常重要，和createTrigger，addTrigger，trigger相关
	 * （推测，这属性是指明客户端是否显示该技能的操作按钮）
	 * 
	 * 1.用于双将，若该设置不为true，该技能时在hiddenSkills隐藏技能列表中，且为“非明置”状态，结束当前“createTrigger”事件的触发；
	 * 即该设置，可以让隐藏技能触发；
	 * 
	 * 2.用于event.addTrigger，event.trigger中，若该设置为true，默认为其priority+1，影响技能的触发顺序
	 * （该顺序从代码看起来主要受priority影响，因为会*100，设置这个，会比其他同级优先一点）
	 * 
	 * 3.当设置了该值为true，
	 *  若forced没设置到，则默认为true；
	 *  若popup没设置到，则默认为false；
	 * 
	 * 故该设置核心功能：表明该技能是强行触发技能,并且不提示
	 */
	silent?: boolean;
	/** 
	 * 使用content接管整个skill发动流程
	 */
	direct?: boolean;
	/**
	 * 此技能是否可以被设置为自动发动（不询问）
	 * 
	 * 设置了该属性的技能，可加入到配置选项中，自己设置是否自动发动（即该技能非必发技能）
	 * 
	 * 若该属性值是“check”，则调用当前技能得check方法检测
	 */
	frequent?: boolean | string | ((event: GameEvent, player: Player) => number | boolean);
	/** 
	 * 此技能是否可以被设置为自动发动2 
	 * 
	 * 可以细分当前技能强制发动选项，（应该是为了细分子技能），保存到lib.config.autoskilllist，
	 * 
	 * 在ui.click.autoskill2中执行,
	 * 
	 * 取值为子技能的名字（注：目前，看来，只是在UI上作用，自动发动，更多是依赖frequent参数）
	 */
	subfrequent?: string[];
	/**
	 * 自动延迟的时间
	 * 
	 * 可以影响技能触发响应时间（主要影响loop之间的时间,即game.delayx的调用情况）
	 */
	autodelay?: boolean | number | ((event: GameEvent, player: Player) => number);
	/** 第一时刻执行？（将发动顺序前置到列表前） */
	firstDo?: boolean;
	/** 最后一刻做？（将发动顺序置于列表后方） */
	lastDo?: boolean;

	/** 
	 * 此技能是否能固定触发（即自动发动）。
	 * 
	 * true为固定触发（可视为一种锁定技的，锁定技实质是mod里的技能）
	 * 国战可以触发亮将。
	 * 
	 * 【核心】作为game.check检测用的标准属性之一，在满足条件下强制执行。
	 */
	forced?: boolean;
	/** 
	 * 死亡后是否可以发动技能
	 */
	forceDie?: boolean;
	/** 
	 * 是否触发技能发动(logSkill)
	 * 
	 * 若为false，发动技能将不会自动在武将牌上弹出技能发动文本，记录中也不会有发动技能的记录
	 * 
	 * 若为字符串，则在createTrigger【step 3】触发技能时，使用player.popup弹出该提示文本；
	 */
	popup?: boolean | string;
	/**
	 * 获得此技能后武将信息栏将不会显示此技能描述
	 * 
	 * 一般用于有技能描述但不属于“主技能”的技能，如曹嵩的6枚“金”
	 */
	nopop?: boolean;
	/**
	 * 取消触发后的处理
	 * 
	 * 在createTrigger中step 3处理
	 * 
	 * @param trigger 
	 * @param player 
	 */
	oncancel?(trigger: GameEvent, player: Player): void;

	//触发内容基本触发流程
	/**
	 * 在content之前执行
	 * 
	 * 在chooseToUse，step2中执行：
	 *  其执行时机和chooseButton一致，当chooseButton不存在时且game.online为false，则会执行这个
	 * @param config 
	 */
	precontent?: ContentFuncByAll | OldContentFuncByAll;
	/**
	 * 在content之前触发内容
	 * 
	 * 在useSkill中使用，主动触发技能content之前
	 */
	contentBefore?: ContentFuncByAll | OldContentFuncByAll;
	/**
	 * 触发内容（技能内容）
	 * 
	 * 作为被动触发技能：
	 *  在createTrigger，step3中创建当前技能的事件，设置该content为事件content作为触发内容；
	 * 
	 * 作为主动触发技能：
	 *  在useSkill中创建当前技能的事件
	 * 分步执行(通过step x分割开执行逻辑步骤)
	 * 
	 * 注：此时的content，已经为触发该技能的效果而创建的，该技能执行中的事件，此时的event一般是不具备
	 *  触发信息，触发的信息，主要在trigger触发事件中获取。
	 */
	content?: ContentFuncByAll | OldContentFuncByAll;
	/**
	 * 在content之后触发内容
	 * 
	 * 在useSkill中使用，主动触发技能content之后
	 */
	contentAfter?: ContentFuncByAll | OldContentFuncByAll;

	//技能初始化与移除：
	/**
	 * 获得技能时发动，初始化技能
	 * 
	 * 技能的话，则在addSkillTrigger，若第三个参数triggeronly取值为true，只设置触发，不初始化该技能；
	 * 
	 * 正常在addSkill处理，this.addSkillTrigger(skill)，使用此初始化；
	 */
	init?(player: Player, skill: string): void;
	/** 
	 * 添加技能时，初始化技能信息
	 * 
	 * 在addSkill中调用，每次添加都会执行
	 */
	init2?(player: Player, skill: string): void;
	/** 在执行player.disableSkill丧失技能时，若该属性为true，则执行技能的onremove */
	ondisable?: boolean;
	/**
	 * 失去技能时发动
	 * 当值为string时:
	 * 
	 *  若为“storage”，删除player.storage中该技能的缓存（用于保存标记等信息）；
	 *      注：失去这个技能时销毁标记。
	 * 
	 *  若为“discard”，若player.storage[skill]缓存的是卡牌时，执行game.cardsDiscard，并播放丢牌动画，然后移除player.storage[skill]；
	 *  
	 *  若为“lose”，和“discard”差不多，不过不播丢牌动画；
	 * 
	 * 当值为true时，直接移除player.storage[skill]；
	 * 
	 * 当值为字符串集合时，则是删除集合中对应player.storage（即删除多个指定storage）
	 * 
	 * 注：当前disableSkill中，若当前info.ondisable，调用onremove必须是方法，且不注入skill参数；
	 */
	onremove?: ((player: Player, type: string) => void) | string | string[] | boolean;
	/** 是否持续的附加技能，在removeSkill中使用 */
	keepSkill?: boolean;


	//以下3个属性基本功能时一致：在某些模式下是否能使用，只使用一个就差不多
	/**
	 * 指定该技能在哪些模式下禁用
	 * 
	 * 注：在指定模式被禁用的技能，会被设置成空对象，并且“技能_info”的描述变成“此模式下不可用”。
	 */
	forbid?: string[];
	/** 与forbid相反，只能在指定玩法模式下才能被使用，其他逻辑一致 */
	mode?: string[];
	/** 当前模式下是否能使用，返回false则不能使用，其实和forbid逻辑一致 */
	available?(mode: string): boolean;


	//技能相关设置：
	/** 
	 * 技能组：
	 * 
	 * 拥有这个技能时相当于拥有技能组内的技能
	 * 
	 * 注：一些特殊技能标签：
	 * 
	 * “undist”：不计入距离的计算且不能使用牌且不是牌的合法目标
	 * 
	 *  （被隔离玩家，目前确定的作用：player.getNext获取下一位玩家，player.getPrevious确定上一位玩家，player.distance计算玩家距离）；
	 */
	group?: string | string[];
	/** 
	 * 子技能：
	 * 
	 * 你不会拥有写在这里面的技能，可以调用，可以用技能组联系起来;
	 * 
	 * 子技能名字：“主技能_子技能”，翻译为主技能翻译
	 * 
	 * 注：子技能，会被视为“技能_子技能”独立保存起来。
	 */
	subSkill?: Record<string, Skill>;
	/**
	 * 全局技能?:
	 * 
	 * 你拥有此技能时，所有角色拥有此技能（global的值为技能名）
	 * 
	 * 注：无论是否拥有此技能，此技能都为全局技能写法：技能名前 + _
	 */
	global?: string | string[];
	/**
	 * 在game.addGlobalSkill中使用：
	 * 
	 * 强行设置global技能；
	 */
	globalSilent?: boolean;

	//技能相关设置=>功能设置
	/** 
	 * 每回合限制使用次数
	 * 
	 * 主要在createTrigger，step3中触发计数。
	 * 
	 * enable类技能触发后，若当前技能事件的addCount属性不为false，会在玩家的stat[玩家最新stat属性于stat位数].skill属性中添加此技能的发动计数，获取方式为：player.stat[获取所需回合数].skill[当前技能名]
	 * 
	 * trigger类技能触发后，若此技能设有此属性，会在玩家身上添加“counttrigger”技能，计数记录在：player.storage.counttrigger[当前技能名]
	 * @param skill 获取发动次数的技能
	 * @param player 
	 */
	usable?: ((skill: string, player: Player) => number) | number;
	/** 
	 * 每一轮的使用次数
	 * 
	 * 设置了该属性，会创建一个“技能名_roundcount”技能，将其加入group（技能组）中；
	 * 
	 * 该技能的触发阶段“roundStart”（一轮的开始），用于记录当前技能的在一轮中使用的次数
	 */
	round?: number;
	/** 用于“技能名_roundcount”技能中，当前技能不可使用时，“n轮后”xxx，中xxx的部分显示（即后面部分） */
	roundtext?: string;
	/** 增加显示的信息，这部分时增加，“n轮后”前面部分 */
	addintro?(storage: Record<string, any>, player: Player): string;
	/** 延迟的时间 */
	delay?: number | boolean;
	/** 
	 * 锁定技
	 * 
	 * 若取值false，则get.is.locked，直接返回就false了；
	 * 
	 * （锁定技的判定：1.info.trigger&&info.forced；2.info.mod；3.info.locked）
	 * 
	 * 是否可以被“封印”（内置技能“fengyin”）的技能，取值为false时，get.is.locked返回为false；true则正常逻辑 
	 */
	locked?: boolean | ((skill: string, player: Player) => boolean);
	/** 是否是旧版技能，值为true，添加到lib.config.vintageSkills中，可以实现新/旧版技能切换，如果该为true，则“原翻译名_alter”即作为当前的翻译 */
	alter?: boolean;


	//锁定技
	/** 
	 * mod技能的设置
	 * 
	 * 如果有，技能视为锁定技 
	 * */
	mod?: Mod;

	//【重点】标记的key需要和技能名一致，游戏内都是通过对应skill取得对应的标记key，即player.storage[skill]
	//限定技与觉醒技与技能标记
	/*
	关于限定技规范：
		一般情况下，需要在filter中，可加入!player.storage.xxx==true判定，
		在发动后，content内设置player.storage.xxx=true，代表已经触发了；
		目前，可以采用另一种简洁的方法，即觉醒技方法：
			player.awakenSkill("xxx");
		这样就会屏蔽发动过的技能，不会发动第二次；
	*/

	/**
	 * 限定技（标记）
	 * 
	 * 该标记为true时，若没有设置以下内容，则会自动设置：
	 * 
	 *  mark设置为true；
	 * 
	 *  intro.content设置为“limited”；
	 * 
	 *  skillAnimation设置为true；
	 * 
	 *  init设置为初始化玩家缓存的该技能名标记为false；
	 */
	limited?: boolean;
	/** 
	 * 是否开启觉醒动画
	 * 
	 * 准备来说，常用于觉醒动画，实际是指技能动画
	 * 
	 * 字符串时取值：epic，legend
	 */
	skillAnimation?: boolean | string;
	/** 是否只显示文字特效 */
	textAnimation?: boolean;
	/** 动画文字(可用于觉醒文字) */
	animationStr?: string;
	/** 动画文字颜色(觉醒文字颜色) */
	animationColor?: string;
	/**
	 * 觉醒技标记：
	 * 
	 * (目前来看，这个目前单纯是技能标记，在主逻辑上并没使用，但貌似会被某些技能本身用到，或者类似左慈判断不能获得的技能的)
	 */
	juexingji?: boolean;
	/** 
	 * 获得技能时是否显示此标记，
	 * 
	 * 若为false，可以用 markSkill 来显示此标记，
	 * 
	 * 可以用 unmarkSkill 不显示标记
	 * 
	 * mark的常量值："card","cards","image","character"，表示，标记显示的特殊形式（UI上）
	 * 
	 * 注：character，只能在表示一个角色时使用，标记以角色牌形式显示；
	 * 
	 * 注：取值“auto”，在updateMark时，有计数时，执行unmarkSkill(?????)
	 */
	mark?: boolean | string;
	/** 标记显示文本，一般为一个字 */
	marktext?: string;
	/** 标记显示内容 */
	intro?: {
		/** 自定义mark弹窗的显示内容 */
		mark?: (dialog: Dialog, storage: any, player: Player) => string | void;
		/** 用于info.mark为“character”，添加，移除标记时，log显示的标记名（好像意义不大） */
		name?: string | ((arg: any, player: Player) => string);
		name2?: string | ((arg: any, player: Player) => string);
		/** 
		 * 标记显示内容？
		 * 为cards时显示标记内的牌.
		 * 
		 * 当标记显示内容是文本:
		 * 
		 *  "mark":有（数）个标记；
		 * 
		 *  "card":一张牌；
		 * 
		 *  "cards":多张牌；
		 * 
		 *  "limited":限定技，觉醒技专用；(若没设置，在info.limited为true下回默认设置这个)
		 *  
		 *  "time":剩余发动次数；
		 * 
		 *  "turn":剩余回合数；
		 * 
		 *  "cardCount":牌数；
		 * 
		 *  "info":技能描述；
		 * 
		 *  "character":武将牌；
		 * 
		 *  "player":一个玩家；
		 * 
		 *  "players":多个玩家；
		 * 
		 *  可以只是一个描述文本；
		 * 
		 * 在get.storageintro 中使用,以上，即为该方法的type，返回标记的描述内容
		 * 
		 * 若info.mark为“character”，则一般为一个描述文本；
		 * 
		 * 注:info.mark为true时，也可以使用文本描述，比较自由（按道理都可以，不过默认搭配而已）；
		 * 
		 * 其中，文本可使用以下占位符：
		 * 
		 *  "#"：(this.storage[skill])获取对应的计数,
		 * 
		 *  "&"：get.cnNumber(this.storage[skill])获取对应的计数(需要使用到get.cnNumber来获取的数量),
		 *  
		 *  "$"：get.translation(this.storage[skill])获取对应描述(一般是描述的角色名)
		 * 
		 * 也可以是个自定义的方法
		 */
		content?: string | ((storage: any, player: Player, skill: string) => string | void);
		/** 
		 * 标记数
		 * 
		 * 主要在player.updateMark时使用，实际顶替this.storage[i+'_markcount']获取标记数 
		 */
		markcount?: number | ((storage: any, player: Player) => number | string) | string;
		/** 是否不启用技能标记计数 */
		nocount?: boolean;
		/**
		 * 移除该标记时，在unmarkSkill执行
		 * 
		 * 若值为字符串“throw”，该玩家缓存中该技能标记的为牌时，播放丢牌动画；
		 * 
		 * 若是方法，则直接使用该回调方法处理。
		 * 
		 * 注：该参数原本只在把整个标记移除时执行，后续可能自己扩展；
		 */
		onunmark?: ((storage: any, player: Player) => void) | string | boolean;
		// id?:string; //id名字需带“subplayer”，用于特殊模式显示信息用
	};

	//主公技
	/** 
	 * 是否为主公技：
	 * 
	 * true时，将这个技能设置为主公技 
	 * 
	 * (目前来看，这个目前单纯是技能标记，在主逻辑上并没使用，但貌似会被某些技能本身用到)
	 */
	zhuSkill?: boolean;

	/**
	 * 是否为势力技：
	 * 
	 * 请填写对应势力
	 */
	groupSkill?: string;
	/**
	 * 是否影响登场势力
	 * 
	 * 请填写对应势力
	 */
	initGroup?: string;

	/**
	 * 是否与座位号/交换座次相关（若为字符串'changeSeat'则表示与交换座次相关）：
	 * 
	 * 必须要用到座位号的技能都应有此标签
	 * 
	 * 挑战、战棋、塔防、炉石以及对决模式中部分场景由于可能有自己的phaseLoop来确定玩家执行回合的顺序导致出现使用player.getSeatNum获取座位号信息默认为0的情况（纯本体具体哪些场景请查看神鲁肃【榻谟】）
	 */
	seatRelated?: string | boolean;


	/**
	 * 是否与【杀】相关：
	 * 
	 * 用于DIY张绣〖百鸣〗检测
	 * 
	 * 默认技能描述中含“【杀】”的是“与杀相关的技能”
	 * 
	 * 若shaRelated为true，则直接视为该技能是符合条件的技能
	 * 若shaRelated为false，则直接视为该技能不是符合条件的技能
	 * 
	 * @deprecated 类似的判断请按照神典韦的“判断技能描述是否含有牌名【杀】”进行
	 */
	shaRelated?: boolean;

	/**
	 * 是否会交换/变更座次：
	 * 
	 * 必须要交换/变更座次的技能都应有此标签
	 * 
	 * 对决模式中固定位置的场景将屏蔽拥有此标签的技能以避免潜在的问题
	 * 
	 * @deprecated 与此相关的判断请改为使用seatRelated:'changeSeat'
	 */
	changeSeat?: boolean;

	/**
	 * 是否为预亮技能：
	 * 
	 * 用于国战模式。有此标签可在暗置状态选择激活此技能，在技能对应触发时机系统将会询问是否发动技能
	 * 
	 * 若技能没有预亮，在武将牌没有明置的情况下即使达到技能触发条件也不能发动技能。
	 */
	preHidden?: boolean;

	//主动技能（主动使用技能，包含技能使用的相关操作配置）
	/** 
	 * 可使用的阶段 
	 * 
	 * 一般用于主动技能
	 * 
	 * 注：从这个info.enable==event.name看出，其实和trigger差不多，所有事件的发动都会阶段时点；
	 * 
	 * 即，当前执行的事件，触发game.check，时，检测触发的技能的event.name，即是info.enable;
	 * 
	 * 常用的阶段：
	 * 
	 * phaseUse：出牌阶段使用；
	 * 
	 * chooseToRespond：用以响应；
	 * 
	 * chooseToUse：常用于“濒死使用”/打出使用
	 */
	enable?: EnableSignal
	/**
	 * 是否显示弹出该技能使用卡牌的文字
	 * 
	 * useCard中使用，
	 * 
	 * 若为true的话，则执行player.popup
	 * 
	 * 例如：player.popup({使用卡牌名name，使用卡牌nature}，'metal')
	 */
	popname?: boolean;

	//视为技（转换卡牌的技能）
	/**
	 * (视为)目标卡牌
	 * 
	 * 一般用于视为技能
	 * 
	 * 【v1.9.102】扩展：可以使用函数式viewAs，目前核心支持使用地方：backup,ok;
	 */
	viewAs?: string | CardBaseUIData | ((cards: Card[], player: Player) => string | VCard | CardBaseUIData | null);
	/**
	 * 视为技按钮出现条件（即发动条件）
	 * @param player 
	 */
	viewAsFilter?(player: Player): boolean | void;
	/**
	 * 使用视为牌时触发内容。
	 * 
	 * result.cards是视为前的牌
	 * 
	 * 注：实际是useResult，若当前处理的是技能，则先触发这个，后面再更具具体情况执行useCard,useSkill;
	 * 
	 * 一般是用于视为技作为，效果处理，作为其他处理，会显得多余，算是视为技的扩展操作
	 * 
	 * @param result 
	 * @param player 
	 */
	onuse?(result: Result, player: Player): void;
	/**
	 * 选择按钮（牌）
	 * 
	 * 常用于视为技需要实现复杂的功能选项时使用；
	 * 
	 * 当前使用范围：
	 * 
	 * chooseToUse
	 * 
	 * chooseToRespond
	 */
	chooseButton?: ChooseButtonConfigData;
	/**
	 * 源技能
	 * 
	 * (该属性应该是动态生成的,用于记录执行backup的技能名，即执行backup的视为技能，实质是执行本技能)
	 * 
	 * 在chooseToUse，step1中使用，若有，将器添加到event._aiexclude中；
	 * 
	 * 
	 * 目前来看，该字段不是配置进去的，而是chooseToUse，step3中，执行chooseButton的backup方法，
	 * 
	 * 返回一个新的“视为”技能：“技能名_backup”，并设置到lib.skill中，
	 * 
	 * 并且将技能名作为该技能的源技能设置到这个新技能的sourceSkill中。
	 */
	sourceSkill?: string;


	//具体功能的处理
	//弃牌，失去牌(默认不设置discard，lose，则直接player.discard弃置选择的牌)
	//discard，lose其中一个false，都会为非视为技走lose事件失去卡牌，且提供丰富的参数设置；
	/**
	 * 是否弃牌
	 * 
	 * 在useSkill中调用，
	 * 
	 * 选择牌发动技能后，被选择的牌都要弃置
	 * 
	 * 取值false（因为undefined != false结果为true，故默认不填和true效果一致）
	 */
	discard?: boolean | ContentFuncByAll | OldContentFuncByAll;
	/** 
	 * 是否失去牌（是否调用player.lose）
	 * 
	 * 与discard调用时机一致，都在useSkill中，
	 * 取值为false
	 */
	lose?: boolean;
	/**
	 * 不弃牌，准备用这些牌来干什么（用于播放动画）
	 * 
	 * 其字符串枚举有：
	 * 
	 * give，give2，throw，throw2
	 * 
	 * 若不是字符串，则执行该方法
	 */
	prepare?: string | ((cards: Card[], player: Player, targets: Player[]) => string | void);
	/** 在lose事件中使用，触发执行“lose_卡牌名”事件的content */
	onLose?: OldContentFuncByAll | OldContentFuncByAll[];
	/**
	 *  在lose事件中使用，必须要失去的卡牌为“equips”（装备牌），有onLose才生效。
	 * 若符合以上条件，则检测该牌是否需要后续触发执行“lose_卡牌名”事件，既上面配置的onLose
	 */
	filterLose?: ((card: Card, player: Player) => boolean);
	/** 在lose事件中使用，取值为true，作用貌似强制延迟弃牌动画处理 */
	loseDelay?: boolean;

	/** 
	 * 是否触发lose失去牌阶段
	 * 
	 * 取值false；
	 * 
	 * 若为false，则跳过该触发
	 * 
	 * 适合lose绑定一起使用，为false时，设置丢失牌事件_triggered为null
	 */
	//新版本出牌阶段主动技的新参数（均仅在discard为false且lose不为false时有效），且losetrigger不为false，
	//是默认情况下：执行player.lose(cards,ui.special)，以下为
	losetrigger?: boolean;
	/** 让角色失去卡牌的过程中强制视为正面朝上失去(losetrigger不为false时，既默认情况下生效) */
	visible?: boolean;
	/** 
	 * 指定失去特殊区卡牌的去向 (即设置卡牌的position)
	 * 
	 * 其值采用的是ui的成员，即通过ui[info.loseTo]，获取实体对象设置；
	 * 
	 * 默认为："special",
	 * 
	 * 取值："special","discardPile","cardPile","ordering"，"control"(这一般都不会用上,好像没看见)
	 */
	loseTo?: string;
	/**
	 * 需要失去的牌的区域ui.special(默认情况是这个，受loseTo影响)，
	 * 
	 * 设置lose事件的toStorage为true，失去的牌到牌记录到自己的storage中；
	 */
	toStorage?: boolean;
	/** 
	 * 用于将失去的牌置于某个区域的顶端（而非默认的顶端）；【v1.9.108.6】
	 */
	insert?: boolean;

	/** 
	 * 技能响应前处理(非联机时，不在线时处理，估计时用于自动响应)
	 * 
	 * 在chooseToRespond中使用
	 */
	prerespond?(result, player: Player): void;
	/** 
	 * 技能响应(可直接使用技能来响应，在这里进行响应的处理)
	 * 
	 * 在respond中使用
	 */
	onrespond?(event: GameEvent, player: Player): void;
	/**
	 * 过滤发动条件，返回true则可以发动此技能
	 * 
	 * 主要在filterTrigger,game.check中处理,返回false则不处理（可以不设置该配置，相当于默认true结果）
	 * 
	 * 注：
	 * 
	 * 1.主动触发：一般走的是game.check,其filter,传入的event指的是当前game.check处理的事件；
	 * 
	 * 2.被动触发：一般走的是lib.filter.filterTrigger,其filter,传入的event指的是当前的触发事件，其中还会把触发事件名传入第三个参数；
	 * @param event 事件，即event._trigger,相当于trigger时机（此时的event为触发该技能时机时的事件）
	 * @param player 
	 * @param name 触发名，为event.triggername，目前只有在lib.filter.filterTrigger中才传该值，即被动触发，主动触发不检测该值，目前暂未完善
	 * @param target v1.10.11 触发的目标
	 */
	filter?(event: GameEvent, player: Player, name?: string, target?: Player): boolean | void | null;
	/**
	 * 选择的目标武将牌上出现什么字。
	 * 
	 * 使用地方：ui.click.target/player，....
	 * 
	 * 如果是数组第几元素对应第几个目标；
	 * 
	 * 如果是方法，则直接根据入参target，判断返回的文本；
	 * 
	 * 例子：
	 * targetprompt:['出杀','出闪'],依次就是你点击第一个角色后在其旁边显示出杀，第二个角色显示出闪
	 */
	targetprompt?: string | string[] | ((target: Player) =>  string);
	/**
	 * 是否每个目标都结算一次(多个目标)
	 * 
	 * true为可选择多名目标
	 */
	multitarget?: boolean | number;
	/**
	 * 指向线的颜色枚举：
	 * fire（橙红色FF9244），thunder（浅蓝色8DD8FF），green（青色8DFFD8），
	 */
	line?: string | { color: number[] } | boolean;
	/** 是否显示多条指引线 */
	multiline?: boolean;

	/**
	 * 选中该技能使用时,进行处理
	 * 
	 * 在chooseToUse 的content中调用，
	 * 
	 * 目前参考的例子中，大多数多是用于添加一些牌到待选择到event.set(key，收集的牌)中，
	 * 
	 * 用于使用前先选牌的效果
	 * 
	 * 注：其调用时机应该远早于触发技能的，在选中牌时就开始处理。
	 * @param event 
	 */
	onChooseToUse?(event: GameEvent): void;

	/**
	 * 改变拼点用的牌
	 * 
	 * 在chooseToCompare和chooseToCompareMultiple，step2中使用，返回玩家用于的拼点的牌
	 * @param player 
	 */
	onCompare?(player: Player): Card[];

	/**
	 * 在chooseToRespond时使用，会前置执行当前chooseToRespond事件player所有的技能该接口；
	 * 
	 * 应该时用于chooseToRespond事件时，技能进行一些初始化处理（暂无使用实例）
	 * 【v1.9.106】
	 * @param event 
	 */
	onChooseToRespond?(event: GameEvent): void;

	//核心
	//event.bakcup设置的信息，game.check使用到的一些参数，其实就是把game.check需要的一些参数设置到技能中，作为check时的条件
	// 追加：这个主要用于game.check检测中，取代当前事件的条件；若没有主动申请检测，则其实用不上；
	// 在表现上，主要用于：主动技，视为技
	/* 这些就是作为前提条件的主要属性
	filterButton
	selectButton
	filterTarget
	selectTarget
	filterCard
	selectCard
	position
	forced
	complexSelect?:boolean;
	complexCard?:boolean;
	complexTarget
	ai1
	ai2
	*/
	//目标
	/**
	 * 需要选择多少张牌才能发动
	 * 
	 * 选择的牌数
	 * 
	 * -1时，选择所有牌,否则就是指定数量的牌
	 * 
	 * 数组时，这个数组就是选择牌数的区间,其中任意（至少一张）：[1,Infinity]
	 * 
	 * 为变量时（具体情况具体分析），例：()=>number
	 */
	selectCard?: number | Select | (() => number | Select);
	/**
	 * 需要选择多少个目标才能发动
	 * 
	 * 选择的目标数：
	 * 
	 * 为-1时，选择全部人
	 * 
	 * 为数组时，这个数组就是选择目标数的区间
	 */
	selectTarget?: number | Select | (() => number | Select);
	/**
	 * 选择的牌需要满足的条件
	 * 
	 * 可以使用键值对的简便写法
	 * 
	 * 也可以使用函数返回值（推荐）
	 * 
	 * 都是通过get.filter处理成事件的filterCard的方法；
	 * 
	 * 直接填true，则有些地方，会优先触发过滤可使用的卡牌，例如ui.click.skill,ai.basic.chooseCard
	 * 
	 * 注：game.check时，如果当前时viewAs“视为技”，则其过滤技能时filterCard,作为方法，多入参一个event参数，需要时可以使用；
	 * （一般没有）
	 */
	filterCard?: boolean | CardBaseUIData | ((card: Card, player: Player) => boolean) | boolean;
	/** 
	 * 是否使用mod检测
	 * 
	 * 取值true;
	 * 
	 * 在event.backup使用，
	 * 
	 * 当info.viewAs有值的时候（即该技能为视为技），
	 * 
	 * 若没有设置filterCard，默认设置一个filterCard：
	 *      可以优先使用“cardEnabled2”的mod检测卡牌是否可使用；
	 * 
	 * 
	 * 已找不到，可能就是改成cardEnabled2
	 * 
	 * 则若当前事件为”chooseToUse“（选择卡牌使用）,使用”cardEnabled“卡牌是否能使用mod检测；
	 * 
	 * 则若当前事件为”chooseToRespond“（选择卡牌响应），使用”cardRespondable“卡牌是否能响应mod检测；
	 */
	ignoreMod?: boolean;
	/**
	 * 选择的目标需要满足的条件
	 */
	filterTarget?: ((card: Card, player: Player, target: Player) => boolean) | boolean;
	/** 
	 * 指定位置：
	 * 'h'：手牌区, 'e'：装备区, 'j'：判定区 
	 */
	position?: string;
	/**
	 * 选择时弹出的提示
	 * 
	 * 单参数的方法，主要用再技能点击使用时的提示；
	 * 
	 * 注：即触发技能/主动发动技能的提示描述信息；
	 */
	prompt?: string | ((event: GameEvent, player: Player) => string);
	//| TwoParmFun<Trigger, Player, String> | TwoParmFun<Links, Player, string> //好像没见到用
	/**
	 * 二次提示
	 * 
	 * 主要在createTrigger，step1中，设置event.prompt2
	 * 
	 * 若是boolean类型，则取值false,不显示prompt2，默认使用lib.translate[“技能名_info”]的描述
	 * 
	 * 注：即发动技能时，prompt提示下的提示（默认显示技能描述）；
	 */
	prompt2?: string | ((event: GameEvent, player: Player) => string) | boolean;
	/** 
	 * 在ui.click.skill中使用，若当前event.skillDialog不存在，可以用该方法生成的文本的dialog作为skillDialog；
	 * 
	 * 若没有该方法，可以使用翻译中该技能的info信息代替。
	 */
	promptfunc?: ((event: GameEvent, player: Player) => string);
	/** 表示这次描述非常长(涉及用了h5文本)，设置为true，重新执行ui.update()，设置skillDialog.forcebutton为true */
	longprompt?: boolean;

	//补充game.check相关参数的声明：
	/** 过滤不可选择按钮 */
	filterButton?(button: Button, player: Player): boolean;
	/** 按钮的可选数量，大多数情况下，默认1 */
	selectButton?: number | Select | (() => number | Select);
	complexSelect?: boolean;
	/** 复合选牌：即每选完一次牌后，都会重新下一次对所有牌的过滤 */
	complexCard?: boolean;
	complexTarget?: boolean;
	/**
	 * 是否允许主动技能选牌时可以使用全选/反选按钮
	 * 仅在没有complexCard和complexSelect的情况下生效喵
	 */
	allowChooseAll?: boolean;

	/** 一般作为chooseCard相关ai */
	ai1?: Function;
	/** 一般作为chooseTarget相关ai */
	ai2?: Function;

	/**
	 * 是否检测隐藏的卡牌
	 * 
	 * 使用范围：player.hasUsableCard，player.hasWuxie
	 * 
	 * 常用：让系统知道玩家“有无懈”；
	 * 
	 * 例子：可以参考“muniu”（木牛流马）
	 * @param player 
	 * @param name 
	 */
	hiddenCard?(player: Player, name: string): boolean | void;

	/** 录像相关，game.videoContent.skill中相关 */
	video?(player: Player, data: string | any[]): void;

	process?(player: Player): void;

	//在skillDisabled中，根据以下5个属性，检测技能是否是不能使用（若其中有一个时true都排除掉），在chooseSkill,选择获得技能时筛选列表
	//在getStockSkills中，有前3个标签属性的技能也是无法获取的
	/** 
	 * 唯一
	 * 
	 * 在skillintro中使用（左慈不能化身） 
	 * 
	 * 注：该技能是否为特殊技能，即左慈化身能否获取等等，常与部分锁定技、主公技、觉醒技连用
	 */
	unique?: boolean;
	/** 临时技能，在die死亡时，会被移除 */
	temp?: boolean;
	/** 子技能标签，在subSkill的技能中，会默认标记该属性为true */
	sub?: boolean;
	/** 固有技，不能被removeSkill移除 */
	fixed?: boolean;
	/** 一次性技能，在resetSkills时，直接移除该技能 */
	vanish?: boolean;

	/** 
	 * 武将特有固有技能
	 * 
	 * 从逻辑上来看，比固定技优先级还高，不会受“fengyin”，“baiban”等技能移除；
	 * 
	 * 在clearSkills时，如果不是“删除所有的all为true”的情况下，不会被移除；
	 * 
	 * 不会被，“化身”之类的技能获得，删除；
	 */
	charlotte?: boolean;
	/** 在clearSkills中使用,标记此标记，永远不会被该方法删除，该标记独立使用，一般其他方法没有对其进行处理 */
	superCharlotte?: boolean;
	/** 作用不明，并没有什么用，与ui相关，在skillintro中使用,值为true */
	gainable?: boolean;
	/** 在nodeintro中使用，添加classname:thundertext,值为true */
	thundertext?: boolean;

	//在nodeintro中使用的（这几个配置都没什么意义）
	/** 设置nodeintro的点击事件 */
	clickable?(player: Player): void;
	/** 过滤点击，应该是过滤弹出面板是否能点击，具体作用日后细究 */
	clickableFilter?(player: Player): boolean;
	/** 设置技能重复时此技能的前缀 */
	duplicatePrefix?: string | ((player: Player, skill: string) => string);
	/** 技能名不带【】括号 */
	nobracket?: boolean;

	//日志相关：
	/** 是否在历史日志中显示，取值未false不显示 */
	logv?: boolean;
	/**
	 * 显示场上日志中显示
	 * 
	 * 在useSkill时，若值为“notarget”，则不显示出对所有“对...”目标相关描述的日志;
	 * 
	 * 在useCard时，若该设置未false，则不执行player.logSkill;
	 */
	log?: boolean | string;
	/**
	 * 目标日志
	 * 
	 * 若是字符串，则配置一个当前处理的trigger事件的一个玩家元素，例如"player","source","target"...；
	 * 
	 * 若是方法，则配置一个方法直接返回文本,或者玩家
	 * 
	 * 若没有配置prompt，显示该配置的提示
	 * 
	 * @param target v1.10.11 触发的目标
	 */
	logTarget?: string | ((event?: GameEvent, player?: Player, triggername?: string, target?: Player) => string | Player | Player[] | null | undefined);
	/**
	 * 是否通过logTarget显示触发者的目标日志；
	 * 
	 * 目的：应该是为了细节化显示日志；在createTrigger，step3中使用，取值false，不使用logTarget，显示logSkill;
	 */
	logLine?: boolean;

	//技能的信息显示：
	/**
	 * 内容描述
	 * 
	 * 在addCard时，设置“技能名_info”的翻译；（addCard很少使用）
	 * 
	 * 若时subSkill子技能，则设置“技能名_子技能名_info”的翻译；(主要适用于子技能描述)
	 * 
	 * 该技能的描述（自定义，非子技能时和game逻辑无关,用于自己的解析逻辑）
	 */
	description?: string;
	/** 该技能的描述（自定义，和game逻辑无关,用于自己的解析逻辑） */
	// infoDescription?:string;
	/** 
	 * 来源：
	 * 
	 * 若该来源技能不存在，则当前技能会被移除；
	 */
	derivation?: string[] | string;

	/**
	 * 强制加载该card配置，
	 * 例如，一些原本不用于contect模式得卡，设置该值可强制加载该card
	 */
	forceLoad?: boolean;

	//AI相关
	/** ai的详细配置 */
	ai?: SkillAI;

	/**
	 * ai用于检测的方法：
	 * 
	 * 第一个参数好想有些不一样：event，card,子技能button；
	 * 
	 * 基本ai.basic使用的check方法(既涉及choose系列时用的ai自动选择)：
	 * 
	 * 1）ai如何选牌：
	 * 
	 * 在ai.basic.chooseCard中使用；
	 * 
	 * 2）ai如何选按钮：
	 * 
	 * 在ai.basic.chooseButton中使用；
	 * 
	 * 3）ai如何选玩家：
	 * 
	 * 在ai.basic.chooseTarget中使用；
	 * 
	 * 注：其实这些应该都有两个参数的，既第二个参数其实当前所有选中的的数据；
	 * 
	 * 有时甚至不传参，所以遇到保存，做好健壮性屏蔽；
	 * 
	 * 特殊作用：
	 * 
	 * 在触发createTrigger中使用,参数：trigger事件，player玩家；
	 * 
	 * 1）在技能过滤触发时作为过滤条件（当前技能info.frequent=='check'）：
	 * 
	 * 2）告诉ai是否发动这个技能：返回true则发动此技能，即作为createTrigger过程中，设置ai如何chooseBool这个技能；
	 * 
	 * 例：
	 * 
	 * a.触发技判断敌友，大于0为选择队友发动，若<=0是对敌方发动:return get.attitude(player,event.player)>0; 
	 * 
	 * b.选取价值小于8的牌：return 8-get.value(card); 数字越大，会选用的牌范围越广，8以上甚至会选用桃发动技能，一般为6-get.value(card); 
	 * 
	 * 注：
	 * 
	 * 两个参数，用于事件触发技能：event:GameEvent,player:Player；
	 * 
	 * 一个参数，用于主动使用触发技能：card:Card；
	 * 
	 * 无参，简洁写法；
	 */
	check?: ((card: Card) => number | boolean | void) |
	((event: GameEvent, player: Player, triggername?: string, target?: Player) => number | boolean | void) |
	(() => number | boolean | void);
	// check?(...any:any):number|boolean;
	// /** ai用于检测的方法：用于主动使用触发技能 */
	// check?(card:Card):number|boolean;
	// /** ai用于检测的方法：用于事件触发技能 */
	// check?(event:GameEvent,player:Player):number|boolean;
	// check?():number|boolean;
	// check?:((arg: Card) => number|boolean) | ((arg: Button) => number|boolean) | ((arg: Player) => number|boolean) | ((arg0: GameEvent, arg1: Player) => number | boolean);

	//event.addTrigger,默认对于技能优先度的标记：rule<card<equip（注：silent默认比同级多1优先度）
	/** 装备技能 */
	equipSkill?: boolean;
	/** 卡牌技能 */
	cardSkill?: boolean;
	/** 规则技能 */
	ruleSkill?: boolean;

	zhuanhuanji?: 'number' | boolean | ((player: Player, skill: string) => any);

	/**
	 * 手动设置技能的标签
	 */
	categories?: (skill: string, player: Player) => string[];
	/**
	 * v1.10.11
	 * 
	 * 将技能的cost选择和content执行分离，从而回避原本的含糊不清的情况。
	 * 
	 * 对于原本使用direct:true取消logSkill，然后在技能内部选择消耗，再logSkill的情况而言，虽然有效，但是难以区分“技能选择消耗的过程”和“技能本身的效果”，不是一件好事。
	 * 
	 * 因此，我们决定将技能的cost和content分离（旧的写法仍然有效，不受影响）。使用例见张辽【突袭】
	 */
	cost?: (event: GameEvent, trigger: GameEvent, player: Player) => Promise<any>;
	//2020-2-23版本：
	/** 
	 * 为技能配置一个自定义在事件中处理的回调事件，该事件的使用需要自己使用，实际是一个自定义事件，没什么实际意义；
	 * 
	 * 其设置的位置在技能content期间设置，设置在期间引发的事件中；
	 * 
	 * 用于以下场合：judge，chooseToCompareMultiple，chooseToCompare
	 * 
	 * 新版本的judge事件中 可以通过设置callback事件 在judgeEnd和judgeAfter时机之前对判定牌进行操作
	 * 
	 * 在判断结果出来后，若事件event.callback存在，则发送“judgeCallback”事件
	 * 
	 * 同理拼点,在拼点结果出来后，发送“compareMultiple”事件（“compare”暂时没有）
	 * 
	 * callback就是作为以上事件的content使用
	 */
	callback?: ContentFuncByAll | OldContentFuncByAll;
	/**
	 * v1.10.11
	 * 
	 * “按点卖血”类技能和“同时机多个目标分别结算”的技能。
	 * 
	 * 现在，无名杀的“按点卖血”技能可以和OL线上一样，在同时触发多个技能时，自选技能的顺序了。
	 * 
	 * 用例见郭嘉【遗计】
	 * 
	 * 而对于一些牌移动事件的技能而言，不仅要“多次发动”，每次发动时还都有不同的目标。
	 * 
	 * 比如伊籍的【急援】，可能会出现“同时将一些牌交给了多名角色”的情况
	 */
	getIndex?: (event, player, triggername) => number | Player[];

	/**
	 * 持恒技
	 */
	persevereSkill?: boolean;
	
	/**
	 * 变身技
	 */
	transformSkill?: boolean;

	/**
	 * 设置手动确认
	 * 为true时必须手动确认
	 */
	manualConfirm?: boolean;

	//日后还有很多属性要添加的
	[key: string]: any;
}

/** ai的配置信息 */
declare interface SkillAI {
	//****************************技能标签 start****************************** */
	//技能标签(告诉ai的细致的信息，用来自己处理时使用，甚至可以视为一般标记使用)
	/*
		player.hasSkillTag('xxxx') 检测是否有指定技能标签：

		在流程中，优先检测
		info.ai.skillTagFilter
		若有这个，先用它过滤检测的技能标记，通过后，
		再检测ai[tag],
		若是字符串，则info.ai[tag]==arg；
		非字符串，则，只有true才可以成功（其实按代码，可以判定非0数字）
	*/

	//无视防具系列：
	/**
	 * 【无视防具1】
	 * 
	 * 放在自己身上。表示自己无视别人的防具
	 */
	unequip?: boolean;
	/**
	 * 【无视防具2】
	 * 
	 * 放在自己身上，表示自己的防具失效2
	 */
	unequip2?: boolean;
	/** 无视防具3 */
	unequip_ai?: boolean;

	/**
	 * 【响应闪】
	 * 作用是告诉AI手里没『闪』也可能出『闪』,防止没『闪』直接掉血;
	 * 常用于视为技；
	 */
	respondShan?: boolean;
	/**
	 * 【响应杀】
	 * 作用是告诉AI手里没『杀』也可能出『杀』,防止没『杀』直接掉血;
	 * 常用于视为技；
	 */
	respondSha?: boolean;
	/**
	 * 在createTrigger中使用，可以指示技能不强制发动，暂无用；
	 */
	nofrequent?: boolean;
	/** 
	 * 【卖血】
	 * 用于其他AI检测是否是卖血流(if(target.hasSkillTag('maixie')))。并非加了这个AI就会卖血。
	 */
	maixie?: boolean;
	/**
	 * 【卖血2】
	 * 用于chooseDrawRecover 选择抽牌还是回血，即表示该角色血量重要，告诉AI主动优先选择回血。
	 */
	maixie_hp?: boolean;
	/**
	 * 【卖血3】
	 */
	maixie_defend?: boolean;
	/**
	 * 【负面技】
	 * 仅拥有此技能时整体为强制发动的负面效果技能
	 */
	neg?: boolean;
	/**
	 * 【半负面技】
	 * 仅拥有此技能(combo技则额外考虑有combo技)时发动技能会有较大负面代价、但可能得到正收益的技能
	 */
	halfneg?: boolean;
	/**
	 * 【无护甲】
	 * 视为无护甲，用于damage，作用是告诉AI，即使有护甲，也不不使用护甲抵扣伤害；
	 */
	nohujia?: boolean;
	/**
	 * 【失去装备正收益】
	 * 视为失去装备正收益，即失去装备可以发动某些效果，用于get.buttonValue中,
	 * 影响ui的选择项；
	 */
	noe?: boolean;
	/**
	 * 【无手牌】
	 * 视为无手牌，用于get.buttonValue中，目前只出现在“连营”和“伤逝”中,用于其它AI检测是否含有标签『无牌』,从而告诉其他AI不要拆迁(因为生生不息)。
	 * 应该是影响ui的选择项
	 */
	noh?: boolean;
	/**
	 * 【不能发起拼点】
	 * 用于player.canCompare 检测玩家是否能发起拼点（作为来源），可用于常规判定；
	 */
	noCompareSource?: boolean;
	/**
	 * 【不能成为拼点目标】
	 * 用于player.canCompare 检测目标是否能成为拼点的目标，可用于常规判定；
	 */
	noCompareTarget?: boolean;
	/**
	 * 用于lib.filter.cardRespondable,检测是否可以响应卡牌（这个竟然参加逻辑中）；
	 */
	norespond?: boolean;
	/**
	 * 【不能自动无懈】
	 * 影响lib.filter.wuxieSwap的检测；
	 */
	noautowuxie?: boolean;
	/**
	 * 【可救助】
	 * 在_save全局技能中检测，标记该技能是可用于濒死阶段救助；（即此技能可以用于自救）
	 * 现在参数3为寻求帮助的濒死角色【v1.9.108.2.1】。
	 */
	save?: boolean;
	/** 
	 * 【响应桃】
	 * 此技能可以用于救人，
	 * 一般用于视为技 
	 */
	respondTao?: boolean;
	/**
	 * 【不明置】
	 * 影响game.check的检测；
	 */
	nomingzhi?: boolean;
	/**
	 * 反转装备的优先值，用于设置装备卡牌card.ai.basic.order的默认优先度；
	 * 一般是用来顶装备刷收益的，如〖枭姬〗
	 */
	reverseEquip?: boolean;
	/** 非身份，国战使用，濒死阶段，有该标记，可以强行进行复活求帮助 */
	revertsave?: boolean;
	/** 改变判定 */
	rejudge?: boolean;

	/**
	 * 组合技
	 * 
	 * 拥有此标签技能的角色在有标签对应ID的技能时此技能收益远比没有时高
	 * 
	 * 如武陆逊〖彰才〗，在没有〖雄幕〗时即使能用也大打折扣则需要combo: "dcxiongmu"
	 * 
	 * 不过对于如战役篇钟会这种两个技能互相combo的情况，由于失去〖排异〗后〖权计〗仍然能够发挥一定作用，故〖权计〗改用notemp标签
	 */
	combo?: string | string[];

	/**
	 * 【非临时技】
	 * 暂时无法发挥预期效果，如神关羽〖武魂〗
	 * 有combo标签的无需添加
	 */
	notemp?: boolean;

	//inRange方法相关标记，影响距离计算
	/** 逆时针计算距离 */
	left_hand?: boolean;
	/** 顺时针计算距离 */
	right_hand?: boolean;
	/** 计算距离时，无视本单位 */
	undist?: boolean;

	//其余一些有些少出场的：
	/** 不会受到火焰伤害 */
	nofire?: boolean;
	/** 不会受到雷电伤害 */
	nothunder?: boolean;
	/** 不会受到伤害 */
	nodamage?: boolean;
	/** 使用毒会有收益 */
	usedu?: boolean;
	/** 不受毒影响 */
	nodu?: boolean;
	/** 免疫锦囊伤害（暂定） */
	notrick?: boolean;
	/** 无效化（暂定，参考无言徐庶）自己使用的锦囊 */
	notricksource?: boolean;
	/** 【杀】能用则用，即使数量不够 */
	useSha?: boolean | "use" | "respond";
	/** 不用【杀】，即使挨打要濒死 */
	noSha?: boolean | "use" | "respond";
	/**
	 * 无消耗的【杀】，如通过〖傲才〗等白嫖的【杀】
	 * 
	 * 有此标签时，即使【杀】不足人机也会尝试打出
	 */
	freeSha?: boolean;
	/** 【闪】能用则用，即使数量不够 */
	useShan?: boolean | "use" | "respond";
	/** 不用【闪】，即使挨打要濒死 */
	noShan?: boolean | "use" | "respond";
	/**
	 * 无消耗的【闪】，如通过【八卦阵】、〖傲才〗等白嫖的【闪】
	 * 
	 * 有此标签时，即使【闪】不足人机也会尝试打出
	 */
	freeShan?: boolean;
	/** 此时让技能持有者获得牌没有收益，如〖自书〗 */
	nogain?: boolean;
	/** 此时让技能持有者失去牌没有收益，如〖屯田〗 */
	nolose?: boolean;
	/** 此时让技能持有者弃置牌没有收益，如〖屯田〗 */
	nodiscard?: boolean;

	/**
	 * 是否是观星类技能
	 * 
	 * 目前主要用于延时锦囊的无懈AI
	 * 
	 * 若有此标签且没有"guanxing_fail"技能，人机（队友）将不会对你判定区的延时锦囊使用【无懈可击】
	 */
	guanxing?: boolean;

	/** 玩家不响应无懈 */
	playernowuxie?: boolean;

	/** 【响应酒】当你需要使用“酒”时，标记技能可响应 */
	jiuOther?: boolean;

	/** 【伤害减免】当你收到伤害时，伤害会减免 */
	filterDamage?: boolean;

	/** 此技能能在不使用火属性伤害牌的情况下造成火属性伤害 */
	fireAttack?: boolean;

	//个人额外扩展：
	/** 不能被横置 */
	noLink?: boolean;
	/** 不能被翻面 */
	noTurnover?: boolean;

	//【v1.9.102】
	/** 
	 * 用于观看其他角色的手牌
	 * 
	 * 令其他角色的手牌对自己可见；
	 * 只需令自己拥有viewHandcard的技能标签即可，通过调整skillTagFilter即可实现对特定角色的手牌可见；
	 * 例：
	 * @example
	 * ai:{
			viewHandcard:true,
			skillTagFilter:function(player,tag,arg){ //arg为目标，通过调整skillTagFilter即可实现对特定角色的手牌可见；
				if(player==arg) return false;
			}, //可看见除自己外所有人的手牌；
		}
	 */
	viewHandcard?: boolean;

	/**
	 * 是否忽略技能检测
	 * 
	 * 用于get.effect，处理target时，检测是否处理target的result；
	 */
	ignoreSkill?: boolean;
	//********************************技能标签 end********************************** */


	//ai基础属性值
	/** 
	 * ai发动技能的优先度 【也用于卡牌的优先度】
	 * 要具体比什么先发发动，可以使用函数返回结果
	 */
	order?: number | ((item: string | Card | { name: string }, player: Player) => number | void);
	/** 
	 * 发动技能是身份暴露度（0~1，相当于概率）
	 * 取值范围为0~1,用于帮助AI判断身份,AI中未写expose其他AI将会无法判断其身份
	 */
	expose?: number;
	/** 
	 * 嘲讽值：
	 * 嘲讽值越大的角色越容易遭受到敌方的攻击,默认为1,一般在0~4中取值即可(缔盟threaten值为3)
	 */
	threaten?: number | ((player: Player, target: Player) => number | void);
	/**
	 * 态度：
	 * 态度只由identity决定。不同身份对不同身份的att不同。
	 * 例如：在身份局中,主对忠att值为6,忠对主att值为10;
	 * 注：配置不配该值；
	 */
	// attitude?: number;

	/** 
	 * 效果：
	 * 影响ai出牌（例如什么时候不出杀）等 
	 * 效果值为正代表正效果,反之为负效果,AI会倾向于最大效果的目标/卡牌;
	 * 
	 * 告诉ai有某技能时某牌的使用效果发生改变。
	 * 
	 * ai里面的effect是上帝视角,target不代表目标角色,player也不代表拥有此技能的玩家本身,
		因为effect是写给别的AI看的,所以target代表玩家本身,player代表其他人,可以是正在犹豫是否要杀你的任何一位玩家。

	 * 注：若不是个对象，可以直接是一个target(一种简写形式，不收录了)
	 * 
	 * 应用：
	 * 〖主动技〗
			如果技能发动无须指定目标: effect=result*get.attitude(player,player);
			如果技能发动须指定目标 总效果=对使用者的收益值 * 使用者对自己的att+对目标的收益值 * 使用者对目标的att; 实际还会考虑嘲讽值,这里简化了;
	   〖卖血技〗
			总效果=对使用者的收益值 * 使用者对自己的att+对目标的收益值 * 使用者对目标的att; 实际还会考虑嘲讽值,这里简化了;

		设对目标的原收益为n,对使用者的原收益为n',n>0代表正收益,n<0代表负收益;
		函数传入4个参数,分别为卡牌、使用者、目标以及n;
		返回值可有3种形式
		1. 一个数a,对目标总的收益为a*n;
		2. 一个长度为2的数组[a,b],对目标的总收益为a*n+b;
		3. 一个长度为4的数组[a,b,c,d],对目标的总收益为a*n+b,对使用者的总收益为c*n'+d;
		假设n代表火杀对目标的效果
		1. 技能为防止火焰伤害：return 0;
		2. 技能为防止火焰伤害并令目标摸一张牌：return [0,1];
		3. 技能为防止火焰伤害并令使用者弃置一张牌：return [0,0,1,-1];

		〖倾向技〗
		对确定的意向，反应准确的收益

		【收益论的检验】示例：
		content:function(){
			game.log(player,'对',target,'的att是',get.attitude(player,target));
			game.log(player,'对',player,'的att是',get.attitude(player,player));
			game.log(player,'对',target,'发动【测试】的eff是',get.effect(target,'测试',player,player));
			game.log(player,'对',target,'使用【杀】的eff是',get.effect(target,{name:'sha'},player,player));
		},

		永远的萌新大佬的示例：
		effect的返回值：
			effect有3种可能的返回值,1个数字，长度为2的数组，长度为4的数组。
			1个数字n:收益*n
			长度为2的数组[a,b]:a*收益+b
			长度为4的数组[a,b,c,d]:对目标为a*收益+b，对使用者为c*收益+d
			*注意 zeroplayertarget 实际上是[0,0,0,0]  zerotarget  实际上是[0,0
			"下面以target:function(){},别人对你使用杀为例，括号里为可能的技能描述"
				return -1;//负影响(杀对你造成伤害时改为等量回复)
				return 0;//无影响(杀对你无效)
				return 2;//2倍影响(杀对你的伤害翻倍)
				return 0.5;//一半影响(杀对你的伤害减半)
				return [1,1];//正常影响+1(成为杀的目标摸一张牌)
				return [1,-1];//正常影响-1(成为杀的目标弃一张牌)
				return [0,1];//无影响+1(杀对你造成伤害时改为摸一张牌);
				return [0,-1];//无影响-1(杀对你造成伤害时改为弃一张牌)
				return [1,0,0,-1];//对你正常影响，对使用者无影响-1(刚烈)
				return [1,1,1,1];//对双方正常影响+1(你成为杀的目标时你和使用者各摸一张牌)
	 */
	effect?: {
		/** 
		 * 返回你作为使用者时，对目标（对被使用者的影响）的修正。
		 * 
		 * 返回结果的字符串："zeroplayer","zerotarget","zeroplayertarget",指定最终结果的:对使用者的收益值,对目标的收益值为0
		 * 
		 * 返回数组的情况[a,b,c,d]:对被使用者 a*result+b 对被使用者c*result+d
		 * @param result1 即当前ai.result.player的结果
		 */
		player?(card: Card, player: Player, target: Player, result1: number): "zeroplayer" | "zerotarget" | "zeroplayertarget" | number | number[] | void | boolean;
		/** 
		 * 你作为目标时，即你成为牌的目标时。返回的是对被使用者的影响（对你的影响）
		 * 
		 * 返回结果的字符串："zeroplayer","zerotarget","zeroplayertarget",指定最终结果的:对使用者的收益值,对目标的收益值为0
		 * 
		 * 返回数组的情况[a,b,c,d]:对被使用者a*result+b 对被使用者c*result+d
		 * @param result2 即当前ai.result.target的结果
		 */
		target?(card: Card, player: Player, target: Player, result2: number): "zeroplayer" | "zerotarget" | "zeroplayertarget" | number | number[] | boolean | void;
	};
	/** 
	 * 收益：
	 * 收益值未在AI声明默认为0(对玩家对目标均是如此)。
	 * 一般用于主动技;
	 * 关于收益的算法，待会再详细描述
	 * 
	 * 在get.result中使用；
	 * 
	 */
	result?: {
		/**
		 * ai如何选择目标（对目标的收益）：
		 * 返回负，选敌人，返回正，选队友;
		 * 没有返回值则不选;
		 * 注：写了这个就不用写player(player){}了，因为player可以在这里进行判断......先继续研究好，再下定论；
		 */
		target?: number | ((player: Player, taregt: Player, card: Card) => number | void | boolean);
		/**
		 * 主要用于get.effect_use中，优先于上面的target；
		 */
		target_use?: number | ((player: Player, taregt: Player, card: Card) => number | void) | boolean;
		/**
		 * ai是否发动此技能（对玩家（自身）的收益）：
		 * 返回正，发动，否则不发动;
		 * 注：最终
		 */
		player?: number | ((player: Player, taregt: Player, card: Card) => number | void | boolean);
		/**
		 * 主要用于get.effect_use中，优先于上面的player；
		 */
		player_use?: number | ((player: Player, taregt: Player, card: Card) => number | void | boolean);

		/**
		 * 取值为true时，不默认为“equip（装备）”卡牌，默认设置“card.ai.result.target”方法
		 */
		keepAI?: boolean,
	}
	/**
	 * 技能标签的生效限制条件
	 * 
	 * 例：视为技中使用，ai什么时候可以发动视为技（决定某些技能标签的true/false）
	 * 在player.hasSkillTag,player.hasGlobalTag中使用
	 */
	skillTagFilter?(player: Player, tag: string, arg: any): boolean | void;

	//------------------------------主要给卡牌使用的ai配置（也共享上面一些配置）--------------------------------
	//若武将使用以下配置，一般为该武将的“视为技”时使用，其配置对应“视为”的卡牌

	//这些时在外的简写，一般详细处理，在basic内
	/** 
	 * 回合外留牌的价值【一般用于卡牌的ai】
	 * 
	 * 大致的价值标准：
	 * tao [8,6.5,5,4]>shan [7,2]>wuxie [6,4]>sha,nanman [5,1]>wuzhong 4.5>shunshou,tiesuo 4
	 *      wugu,wanjian,juedou,guohe,jiedao,lebu,huogong,bingliang 1>shandian 0
	 * 注：当value的结果为一个数组时，则标识当前card在手牌中位置，根据该牌所处位置，获得对应下标不同的value；
	 */
	useful?: number;
	/** 
	 * 牌的使用价值【一般用于卡牌的ai】
	 * 
	 * 数字越大，在一些ai会选用的牌范围越广，8以上甚至会选用桃发动技能，一般为6-get.value(card); 
	 * 大致的价值标准：
	 * wuzhong 9.2>shunshou 9>lebu 8>tao [8,6.5,5,4]>shan [7,2]>wuxie [6,4]>juedou 5.5>guohe,nanman,wanjian 5>sha [5,1]
	 *      tiesuo,bingliang 4>huogong [3,1]>jiedao 2>taoyuan,shandian 0
	 * 注：当value的结果为一个数组时，则标识当前card在手牌中位置，根据该牌所处位置，获得对应下标不同的value；
	 */
	value?: number | number[] | ((player: Player, arg1: any) => number);
	/** 该装备的价值 */
	equipValue?: number | ((card: Card, player: Player) => number);
	/** 主要是使用在card的ai属性，武将技能可以无视 */
	basic?: {
		/** 该装备的价值，同equipValue，优先使用equipValue，没有则ai.basic.equipValue */
		equipValue?: number | ((card: Card, player: Player) => number);
		/** 优先度 */
		order?: number | ((card: Card, player: Player) => number);
		/** 回合外留牌的价值(该牌可用价值),number为当前事件玩家的手牌的下标 */
		useful?: SAAType<number> | ((card: Card, cardIndex: number) => SAAType<number>);
		/** 该牌的使用价值 */
		value?: SAAType<number> | ((card: Card, player: Player, num: number, method: any) => SAAType<number>);

		[key: string]: any;
	};

	//ai的tag【可用于标记卡牌的属性】
	//get.tag(卡牌,标签名) 检测是否有指定卡牌标签：
	/** 主要是使用在card中，独立制定的一些标记来描述自身得一些特性,有则标记1，默认是没有（实质上用bool也行），可能有少许标记参与运算 */
	tag?: {
		//比较常用：（以下为自己得理解）
		/** 【响应杀】：即手上没有杀时，也有可能响应杀 */
		respondSha?: CardTagType;
		/** 【响应闪】：即手上没有闪时，也有可能响应闪 */
		respondShan?: CardTagType;
		/** 【不会受到伤害】 */
		damage?: CardTagType;
		/** 【不受元素伤害】 */
		natureDamage?: CardTagType;
		/** 【不受雷属性伤害】 */
		thunderDamage?: CardTagType;
		/** 【不受冰属性伤害】【v1.9.107】 */
		iceDamage?: CardTagType;
		/** 【不受火属性伤害】 */
		fireDamage?: CardTagType;
		/** 【可以指定多个目标】 */
		multitarget?: CardTagType;
		/** 【回复体力】 */
		recover?: CardTagType;
		/** 【失去体力】 */
		loseHp?: CardTagType;
		/** 【可获得牌】 */
		gain?: CardTagType;
		/** 【可自救】 */
		save?: CardTagType;
		/** 【可弃牌】，即弃牌可以有收益 */
		discard?: CardTagType;
		/** 【失去牌】 */
		loseCard?: CardTagType;
		/** 【多个目标结算时（？存疑）】 */
		multineg?: CardTagType;
		/** 【可多次/再次判定/改变判定】 */
		rejudge?: CardTagType;
		draw?: CardTagType;
		norepeat?: CardTagType;
		/** 【装备替换价值】 */
		valueswap?: CardTagType;

		[key: string]: CardTagType | void;
	}

	/**
	 * 是否要对“连锁”状态下的目标处理；
	 * 
	 * 新增，在get.effect中使用；
	 * @param player 使用者
	 * @param target 目标（伤害传导的起点）
	 * @param card 所使用卡牌
	 * @returns 返回是否处理(boolean)，或在确定要处理时返回一个存放所需数据的字典（默认设返回值.source为target）
	 */
	canLink?(player: Player, target: Player, card: Card): boolean | object;

	//日后还有很多属性要添加的
	[key: string]: any;
}

/** 卡牌的tag的类型，注：作为方法的第二参数很少用上（一般用于二级类型判断） */
type CardTagType = number | ((arg0: Card, arg1: string) => boolean | number) | ((card: Card) =>  boolean | number);

/** 
 * 选择按钮配置 
 * 
 * 时机：chooseToUse
 * 
 * 当你在选择使用时，选择的是技能，若技能有chooseButton设置，则执行player.chooseButton方法:
 * 
 * 以下则为调用该chooseButton的相关参数：
 * 
 * 将操作返回的“视为”结果卡牌，通过event.backup通过视为卡牌的操作，重新操作该操作（一个绕的逻辑）；
 * 
 * 其实质：是一种视为技的操作，弥补一些视为使用某些xxx锦囊时的复杂操作；
 * 
 * 在backup执行方法无法触发通信的原因：
	苏婆玛丽奥  11:50:33
	主机不需要执行
	这玩意是直接客机执行的
	执行完了 把总的结果和生成的backup技能发过去；
	即chooseButton的所有方法都是交给客机执行的，主机只负责获取返回的backup信息；

 * 当前使用范围：
 * 
 * chooseToUse
 * 
 * chooseToRespond 【v1.9.106】
 */
interface ChooseButtonConfigData {
	//player.chooseButton的参数：
	/** 
	 * 选择内容的面板
	 * 
	 * 需要操作的内容，在这里创建；
	 * 
	 * 返回传递给player.chooseButton的参数；
	 * 
	 * 其中参数event,为当前chooseToUse事件
	 */
	dialog?(event: GameEvent, player: Player): Dialog;
	/**
	 * 卡牌选择条件
	 * 
	 * 既player.chooseButton的filterButton
	 * @param button 
	 * @param player 
	 */
	filter?(button: Button, player: Player): void;
	/**
	 * ai如何选牌
	 * 
	 * 既player.chooseButton的ai
	 * @param button 
	 */
	check?(button: Button): number | void | string;
	/** 
	 * 选择数目，默认为1
	 * 
	 * 既player.chooseButton的selectButton
	 */
	select?: BroadSelect;

	//成功选择操作后的内容：
	/**
	 * 返回“视为”部分（即当作该选择为视为的操作逻辑）
	 * 
	 * 将该返回内容给event.backup，视为当前返回的信息条件作为使用；
	 * 
	 * @param links result.links（由get.links获得，一般是指当前面板上的所有可选择按钮的link数据,一般为卡牌信息）
	 * @param player 
	 */
	backup?(links: Result['links'], player: Player): Skill;
	/**
	 * 选择时弹出的提示
	 * @param links result.links（由get.links获得，一般是指当前面板上的所有可选择按钮的link数据,一般为卡牌信息）
	 * @param player 
	 */
	prompt?(links: Result['links'], player: Player): string;

	/**
	 * 进行额外的选择时：
	 * 【v1.9.105】
	 * 
	 * 在chooseButton类出牌阶段技能中调用chooseControl函数而不是chooseButton函数进行第一段选择
	 * 
	 * 注1：使用参考  例：神户小鸟【花绽】
	 * ；
	 * 注2：生成中所有选项，记得加上cancel2！
	 * 
	 * 注3：其选择结果在：result.control
	 * 
	 * 注4：返回的结果是提供给player.chooseControl方法的参数列表；
	 * 
	 * 注5：默认是使用配置的dialog方法，返回的dialog，若设有该参数配置，则优先使用它返回的参数列表，从而构建的control；
	 * @param event 
	 * @param player 
	 */
	chooseControl?(event: GameEvent, player: Player): string[];
}



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

