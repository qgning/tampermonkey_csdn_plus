# 0.0.7 当前版本测试报告

测试日期：2026-09-17（Asia/Shanghai）。本报告替换旧版本内容。

## 测试结果

| 检查 | 结果 |
| --- | --- |
| node src/login-guard.test.mjs | 通过：4 个登录 API、自动及合成调用、主动登录、一次性授权、超时、调用上下文与命名空间替换 |
| node src/audit-current.mjs | 通过：复制只读取代码并保留换行、有效 CSS 优先级、普通文章展开、7 种付费入口保留及跳过克隆 |
| Edge + Playwright 1.63.0 DOM 回归 | 通过：构建脚本复制、换行、动态按钮、正文和代码展开、CSS 优先级、付费节点身份及点击事件保留 |
| pnpm dlx pnpm@8.15.9 run build | 通过：TypeScript 检查与 Vite 构建 |
| GITHUB_REF=refs/tags/v0.0.7 + node src/verify-release.mjs | 通过：项目版本、标签、油猴元数据及 SHA256SUMS |
| git diff --check | 通过 |
| 无 Cookie 线上浏览器检查 | 首页 HTTP 200；6 个文章页 HTTP 403，阻塞 |

## 线上页面结果

- https://www.csdn.net/：HTTP 200，homepage excluded by metadata。
- https://blog.csdn.net/tgwj001/article/details/164429495：HTTP 403，BLOCKED: no article DOM。
- https://blog.csdn.net/johnsong2009/article/details/163989735：HTTP 403，BLOCKED: no article DOM。
- https://blog.csdn.net/2501_93835954/article/details/162914319：HTTP 403，BLOCKED: no article DOM。
- https://blog.csdn.net/weixin_42499004/article/details/144423689：HTTP 403，BLOCKED: no article DOM。
- https://blog.csdn.net/weixin_32349093/article/details/163519722：HTTP 403，BLOCKED: no article DOM。
- https://blog.csdn.net/m0_61278502/article/details/145624530：HTTP 403，BLOCKED: no article DOM。

## 验证边界

每个线上 URL 使用新的隔离浏览器上下文，初始没有 Cookie，不删除用户浏览器数据。文章页未取得正文，因此不能认定线上功能全部验证无误。浏览器回归在本地构造的真实 DOM 上运行构建脚本，模拟 GM_addStyle、GM_setClipboard 与 unsafeWindow；未验证实际 Tampermonkey 扩展安装、系统剪贴板和线上购买跳转。登录策略使用隔离模拟测试。

浏览器命令因线上 403 以状态 1 退出，这是明确记录的外部验收阻塞，不能将整套浏览器测试标记为成功。详细 JSON 保存在忽略的 outputs/browser-results.json，可按 readme 步骤复现。

最初默认 pnpm 11 不兼容锁文件，已使用指定 pnpm 8.15.9 完成构建。未修改依赖锁文件。构建产物与测试临时依赖在 dist/、outputs/，不加入 Git。已有 reference/ 目录不纳入本次提交。
