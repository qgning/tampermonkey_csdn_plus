# tampermonkey_csdn_copy_without_login

## 功能
1. 复制网页文本时不再触发登录框
2. 代码区域可以选中并复制
3. 复制这段代码按钮不再触发登录框


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

## 当前兼容性检查

0.0.5 存在一键复制读取工具栏节点、CSS 优先级写法错误和无条件删除文章展开入口的问题。构建成功不代表线上功能全部可用。

检查详情与尚未验证项目见 [当前测试报告](docs/codex/test-report.md)，后续方案见 [检查与修复方案](docs/codex/DESIGN.md)。使用 `node docs/codex/audit-current.mjs` 可复现三个源码问题；这是局部模拟检查，不是浏览器验收测试。
