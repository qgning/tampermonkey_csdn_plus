# tampermonkey_csdn_copy_without_login

## 功能
1. 复制网页文本时不再触发登录框
2. 代码区域可以选中并复制
3. 复制这段代码按钮不再触发登录框
4. 拦截滚动、定时、阅读次数、复制等触发的自动登录弹窗；保留主动点击“登录／注册”的功能。


## 关于
1. 本人前端还不熟练，多多见谅
2. 欢迎大家提交bug，欢迎大佬修改优化

## 构建与使用

当前版本：`0.0.7`。使用 Node.js 24.19.0、pnpm 8.15.9 验证；仓库锁文件为 pnpm 8 格式。

1. 安装依赖：`pnpm dlx pnpm@8.15.9 install --frozen-lockfile`。
2. 构建：`pnpm dlx pnpm@8.15.9 run build`。
3. 校验：`node src/verify-release.mjs`。
4. 将 `dist/tampermonkey_csdn_plus.user.js` 导入 Tampermonkey 并刷新文章页，或从 [最新 Release](https://github.com/qgning/tampermonkey_csdn_plus/releases/latest) 安装附件。
5. 开发：`pnpm dlx pnpm@8.15.9 run dev`。

Vite 生成临时产物到 `dist/`，发布附件复制到 `outputs/`；两个目录均不提交 Git。脚本匹配 CSDN 文章详情页，不匹配首页；运行于 `document-start`，使用 `GM_addStyle`、`GM_setClipboard` 和 `unsafeWindow` 权限。

## 0.0.7 更新

- 复制按钮读取所属代码块，保留渲染换行，避免复制“AI写代码／运行”工具栏文案；文档捕获监听兼容动态替换按钮。
- 修复文本选择 CSS 的 `!important` 写法。
- 保留付费文章原始阅读入口、正文样式和事件，不强制展开付费内容。
- 保留自动登录拦截，真实点击“登录／注册”可在 1.5 秒内放行一次非自动调用。

## 测试与发布

运行 `node src/login-guard.test.mjs` 和 `node src/audit-current.mjs`，再构建并运行 `node src/verify-release.mjs`。

可选浏览器回归使用 Playwright 和本机 Edge。在独立目录安装测试依赖（不修改项目锁文件）：

```powershell
New-Item -ItemType Directory -Force outputs/browser-runtime
pnpm dlx pnpm@8.15.9 add playwright@1.63.0 --dir outputs/browser-runtime
$env:PLAYWRIGHT_PATH=(Resolve-Path outputs/browser-runtime/node_modules/playwright).Path
node src/browser-regression.mjs
```

浏览器检查使用新的无 Cookie 上下文，结果写入 `outputs/browser-results.json`。构建脚本注入浏览器并模拟油猴样式／剪贴板 API，不能替代 Tampermonkey 扩展安装及系统剪贴板验收；目标文章不可访问时退出非零。

发布时将 `dist/tampermonkey_csdn_plus.user.js`、`dist/SHA256SUMS` 复制至 `outputs/`，提交并推送源码，创建与 package.json 一致的 `v0.0.7` 标签，使用 `gh release create` 上传这两个附件。固定附件名兼容油猴更新地址；不要复用已发布版本。

2026-09-17 自动回归与构建通过；无 Cookie Edge 访问首页成功，6 个目标文章页均返回 HTTP 403，线上完整验收未完成。详见 [当前测试报告](docs/codex/test-report.md) 与 [设计方案](docs/codex/DESIGN.md)。
