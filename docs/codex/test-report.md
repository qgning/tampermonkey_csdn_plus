# 0.0.5 当前代码与 CSDN DOM 检查报告

检查日期：2026-09-15。范围：当前 `src/main.ts`、线上匿名 HTTP 响应、线上页面引用的 JavaScript，以及本地构建。业务源码未修改。

## 结论

当前版本不能判定全部有效。正文容器和代码折叠 class 仍在使用，但当前官方复制脚本把按钮放入 `.opt-box` 工具栏，已与本项目“按钮父节点就是代码正文”的假设不符。另有 CSS 优先级声明错误和无条件删除文章展开入口的问题。

本仓库没有旧网页 DOM 快照，因此不能给出 CSDN 改版时间或完整历史差异；本报告描述当前线上结构与现有实现的兼容性。

## 检查方式与限制

- 使用不带 Cookie 的独立 curl 请求读取公开页面；没有读取或清除用户浏览器 Cookie。此方式等价于匿名 HTTP 取样，不等价于 `docs/TEST.md` 要求的清 Cookie 后浏览器交互回归。
- 浏览器导航后能在标签清单看到首篇文章标题，但创建/读取标签均遇到 30 秒超时，未取得浏览器渲染后的 DOM，也未完成实际油猴安装、鼠标选中、Ctrl+C、剪贴板和登录弹窗测试。
- 网页检索工具无法打开两个尝试的文章 URL；HTML 与官方脚本证据来自成功的直接 HTTP 下载。
- HTTP 521 样本返回挑战脚本，未执行挑战或尝试绕过。不能把挑战页面中的选择器缺失当成 DOM 改版。
- `audit-current.mjs` 使用 DOM 桩执行当前源码，仅复现局部逻辑；它不是浏览器端到端测试，不测试克隆、CSS 层叠或站点异步时序。

## 页面覆盖

| URL | HTTP | 结果 |
| --- | --- | --- |
| https://www.csdn.net/ | 200 | 首页可获取；不在 userscript 的 match 范围内，脚本不运行属于当前配置行为 |
| https://blog.csdn.net/tgwj001/article/details/164429495 | 200 | HTML 中存在 blog-content-box、article_content、content_views 和 17 个 pre 代码块 |
| https://blog.csdn.net/johnsong2009/article/details/163989735 | 200 | HTML 中存在 blog-content-box、article_content、content_views；未出现代码块标签 |
| https://blog.csdn.net/2501_93835954/article/details/162914319 | 521 | 普通文章被阻断，未验证 |
| https://blog.csdn.net/weixin_32349093/article/details/163519722 | 521 | VIP 文章被阻断，未验证 |
| https://blog.csdn.net/m0_61278502/article/details/145624530 | 521 | VIP 文章被阻断，未验证 |
| https://blog.csdn.net/lxlyx11/article/details/124961664 | 521 | 源码中代码折叠样本被阻断，未验证 |
| https://blog.csdn.net/uote_e/article/details/131385801 | 521 | 源码中文章展开样本被阻断，未验证 |

## 当前 DOM 和官方脚本证据

下列资源均由成功获取的文章 HTML 引用，检查时返回 HTTP 200。只读取源码，未在本地执行下载的站点脚本。

| 对象 | 当前证据 | 判断 |
| --- | --- | --- |
| `.blog-content-box`、`#article_content`、`#content_views` | 两篇普通文章 HTML 中仍存在，容器位于 main 下 | 核心容器命名仍兼容 |
| `.hljs-button` | 官方 edit_copy_code 脚本仍生成此 class | 按钮名称保留，但父节点假设失效 |
| `pre > .opt-box` | pc_wap_common 对 pre 追加工具栏；edit_copy_code 把按钮插入该工具栏 | `button.parentNode.innerText` 取得工具栏文本，不是 code 正文 |
| `.set-code-hide`、`.set-code-show`、`.hide-preCode-box` | 当前 detail 脚本仍用这些 class 折叠超过 200px 的代码 | 选择器仍被站点使用；实际自动展开待浏览器验证 |
| `.hide-article-box`、`.btn-readmore` | 当前 detail 脚本仍引用 | 不能一律移除；站点逻辑还区分 `.column-mask`、`.vip-mask`、`.vipmaskclassname` |

证据链接：[复制按钮脚本](https://csdnimg.cn/release/blogv2/dist/components/js/edit_copy_code-43c2d050a0.min.js)、[代码工具栏脚本](https://csdnimg.cn/release/blogv2/dist/components/js/pc_wap_common-3c7b273c43.min.js)、[文章详情脚本](https://csdnimg.cn/release/blogv2/dist/pc/js/detail-edf430e287.min.js)。资源可能随部署更新。

## 发现的问题

### P1：一键复制读取了错误节点

位置：`src/main.ts:52`。当前按钮位于 pre 的工具栏 `.opt-box`，code 是工具栏的兄弟节点。源码复制父节点 innerText，可能得到“运行”等工具栏文字或空字符串。官方复制实现则从按钮向上找 pre，再向下找 code。

源码探针构造上述父节点关系，调用实际注册的点击处理器，确认传给 `GM_setClipboard` 的值为“运行”。这是已复现的兼容缺陷，但尚未完成线上浏览器点击复现。

### P1：未获取完整内容也会删除原始展开入口

位置：`src/main.ts:62-63`。没有 VIP 或正文完整性判断，直接删除文章 style 和首个 `.hide-article-box`。这与 REQUIREMENTS 的“VIP 无完整内容时保留原始按钮”要求不符。探针确认两项操作无条件执行。线上 VIP 样本受阻，未确认其当下具体遮罩层级。

### P2：CSS 的 !important 是无效独立声明

位置：`src/main.ts:15-16`。实际生成 `user-select: auto; !important;`，优先级标记没有附在属性值上。其余 `user-select: auto` 声明仍可能生效；不能据此声称所有页面都无法选中。是否被后加载样式覆盖需要真实浏览器计算样式验证。

### 待验证风险：一次性初始化、事件克隆与文本水印

位置：`src/main.ts:30-31,36-40,66`。main 只执行一次，没有处理之后出现的按钮、折叠状态或正文替换。cloneNode 不复制 addEventListener 注册的监听器，但保留内联事件属性，也不清除 document/window 上的监听。故鼠标/键盘复制免登录、无水印不能仅由克隆逻辑保证；此次没有浏览器交互证据判定其实际失效。

## 构建和局部复现

- Node.js：24.19.0。
- 当前全局 pnpm 11.19.0 不兼容仓库 lockfileVersion 6.0；直接安装失败，未重写锁文件。
- `pnpm dlx pnpm@8.15.9 install --frozen-lockfile`：通过。
- `pnpm dlx pnpm@8.15.9 run build`：通过；TypeScript 5.1.6、Vite 4.4.6，生成 `dist/tampermonkey_csdn_plus.user.js`。
- `node docs/codex/audit-current.mjs`：退出码 0，确认上述三个缺陷特征仍存在。退出码 0 表示“复现断言成立”，不代表产品功能通过。
- `.gitignore` 已忽略 node_modules、dist 和日志。下载的 HTML/JS 放在系统临时目录，未加入 Git。未修改业务源码、锁文件或受保护 docs 文件。

## 尚未通过的验收

真实油猴环境中清 Cookie 后验证：鼠标和 Ctrl+C 复制无登录框且无水印；一键复制内容与 code 正文一致；长代码和普通折叠文章自动展开；不完整 VIP 文章保留原始入口；刷新和异步加载后行为稳定。当前检查不足以宣称这些项目全部通过。
