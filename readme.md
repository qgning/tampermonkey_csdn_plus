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

仓库锁文件使用 pnpm 8 格式。2026-09-15 已在 Node.js 24.19.0、pnpm 8.15.9 下通过构建；较新的 pnpm 可能拒绝此锁文件。

1. 安装依赖：`pnpm dlx pnpm@8.15.9 install --frozen-lockfile`。
2. 构建脚本：`pnpm dlx pnpm@8.15.9 run build`。
3. 将生成的 `dist/tampermonkey_csdn_plus.user.js` 导入浏览器 Tampermonkey 扩展，启用后刷新 CSDN 文章页。
4. 开发调试：`pnpm dlx pnpm@8.15.9 run dev`，按 Vite 输出访问开发入口。

脚本匹配 CSDN 博客文章详情页，不匹配 CSDN 首页。

## 测试与发布

当前版本为 `0.0.6`。仓库目前没有自动发布工作流，使用 GitHub CLI 手动发布。

1. 运行 `node src/login-guard.test.mjs` 验证登录拦截策略。
2. 运行 `pnpm dlx pnpm@8.15.9 run build`，再运行 `node src/verify-release.mjs` 校验版本与油猴元数据，生成 `dist/SHA256SUMS`。
3. 将 `dist/tampermonkey_csdn_plus.user.js` 和 `dist/SHA256SUMS` 复制到 `outputs/`，保持发布附件与已提交文件一致。
4. 提交并推送代码，创建同版本标签 `v0.0.6`，再用 `gh release create` 上传 `outputs/` 中的两个文件。版本标签必须与 package.json 一致，已公开版本不要复用或覆盖。

发布附件固定命名为 `tampermonkey_csdn_plus.user.js`，以兼容现有脚本的 updateURL / downloadURL。用户可从 GitHub 最新 Release 下载，也可直接安装 `outputs/tampermonkey_csdn_plus.user.js`。

本地构建和模拟测试不代表 CSDN 浏览器功能验收通过；`node src/audit-current.mjs` 用于复现既有缺陷，其成功退出不表示功能正常。

## 当前兼容性检查

0.0.6 新增自动登录拦截。更新 Tampermonkey 中的脚本后刷新文章页生效；新增 `unsafeWindow` 权限用于包装页面登录组件，运行时机为 `document-start`。文章增强功能仍等待页面加载后执行。

拦截覆盖当前 CSDN `loginBox.show / key / showTip / showAutoTip`。只有真实点击带“登录／注册”文字或无障碍名称的入口，才会在 1.5 秒内放行一次未标记为自动的调用；键盘激活按钮产生的点击同样适用。直接跳转登录页的链接保持正常。仅有无标签图标、超过 1.5 秒的异步登录、未来新增的独立组件或不允许改写的属性需要进一步适配，不保证覆盖任意站点改版。

验证拦截策略：`node src/login-guard.test.mjs`。这是隔离模拟测试，真实浏览器油猴验收尚未完成。

原有一键复制读取工具栏节点、CSS 优先级写法错误和无条件删除文章展开入口的问题仍待修复。构建成功不代表线上功能全部可用。

检查详情与尚未验证项目见 [当前测试报告](docs/codex/test-report.md)，后续方案见 [检查与修复方案](docs/codex/DESIGN.md)。使用 `node src/audit-current.mjs` 可复现三个源码问题；这是局部模拟检查，不是浏览器验收测试。
