# 无名杀扩展助手

VS Code 插件，用于在编辑器中管理无名杀 ES Module 扩展的武将、技能和卡牌。

## 功能

- **扩展浏览器**：在资源管理器侧边栏显示所有扩展，区分旧版单文件与 ES Module。
- **武将/技能/卡牌树**：展开扩展后查看武将、技能和卡牌列表，显示势力、勾玉、技能绑定等信息。
- **快速跳转**：点击武将或技能节点，自动打开对应文件并定位到定义位置。
- **新建模板**：右键扩展可新建武将或技能，自动更新 `character.js`、`skill.js`、`translate.js` 和 `index.js`。
- **表单编辑**：通过可视化表单新建或编辑武将，支持图片和阵亡音频上传。
- **代码片段**：输入 `noname-char`、`noname-skill` 等前缀可快速插入模板。
- **技能 IntelliSense**：编辑技能对象时提供属性、触发时机、常用 API 的类型提示。
- **导出扩展**：将扩展打包为 zip，方便分享或通过游戏内导入功能安装。

## 安装

本插件未上架 VS Code 插件市场，请通过以下方式安装：

### 方式一：从 GitHub Release 安装

1. 访问 [Releases](https://github.com/002369DXChen/noname-extension-helper/releases) 页面。
2. 下载最新版本的 `noname-extension-helper.vsix` 文件。
3. 在 VS Code 中打开「扩展」视图，点击右上角 `...` → **Install from VSIX...**，选择下载的文件。

或在命令行执行：

```bash
code --install-extension noname-extension-helper.vsix
```

### 方式二：从源码运行

```bash
git clone https://github.com/002369DXChen/noname-extension-helper.git
cd noname-extension-helper
npm install
npx @vscode/vsce package
```

## 使用方法

1. 在 VS Code 中打开无名杀项目根目录（包含 `extension/` 文件夹）。
2. 左侧资源管理器底部会出现「无名杀扩展」视图。
3. 点击刷新按钮或展开扩展节点开始使用。

## 本地调试

```bash
cd noname-extension-helper
code --extensionDevelopmentPath=. ..
```

## 已知限制

- 仅支持 ES Module 扩展的 `character/{character,skill,translate}.js` 结构。
- 武将子目录（如 `character/gujian/`）暂不支持编辑。
- 卡牌编辑暂未实现。
- 技能 IntelliSense 基于简化类型定义，未覆盖全部 API。

## 更新日志

### v0.1.2

- 修复：为所有命令补充 `onCommand` 激活事件，解决从 VSIX 安装后命令未找到的问题。
- 调整：README 与 `package.json` 版本号统一为 `0.1.2`。

### v0.1.0

- 初始版本：扩展浏览器、武将/技能树、快速跳转、新建模板、表单编辑、代码片段、技能 IntelliSense、导出扩展。

## 协议

本插件采用 [GPL-3.0-only](LICENSE) 协议开源。

插件使用了以下第三方开源库：

- [@babel/parser](https://babeljs.io/) — MIT
