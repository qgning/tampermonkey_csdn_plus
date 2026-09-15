# 0.0.6 当前版本测试报告

测试日期：2026-09-15 17:57（UTC+08:00）。范围：付费文章入口保留、登录拦截回归、构建与产物验证。本报告替换上一版本测试内容。

## 结果

| 检查 | 结果 |
| --- | --- |
| node src/audit-current.mjs | 通过普通文章展开及 7 种付费入口保留检查；同时仍复现两个无关旧缺陷 |
| 付费入口场景 | 不换行空格价格、字面 HTML 实体、变化价格、充值 VIP、订阅专栏、多个入口及无文字付费结构均通过 |
| 付费场景副作用 | 未删除正文样式、未删除入口、未进入正文克隆路径 |
| node src/login-guard.test.mjs | 通过四种登录 API、自动调用、手动授权、过期、方法及命名空间替换等回归 |
| pnpm dlx pnpm@8.15.9 run build | 通过 TypeScript 和 Vite 构建 |
| node src/verify-release.mjs | 通过 0.0.6 版本及脚本头检查，生成 SHA256SUMS |

## 页面依据

使用无 Cookie 的 HTTP 请求读取 https://blog.csdn.net/m0_61278502/article/details/145624530 的 HTML，确认 hide-article-box / vip-mask / openvippay / getVipUrl 及“最低0.47元/天 解锁文章”文案。仅读取 HTML，没有执行远程脚本。

## 验收边界

测试使用实际源码和模拟 DOM，证明保护分支会在正文克隆与展开前退出；不替代真实浏览器事件验收。未清除用户浏览器 Cookie，也未完成 Tampermonkey 安装、购买按钮点击或动态加载验收。

需在真实普通文章中确认自动展开，在 VIP 文章中确认原始价格按钮、遮罩及点击交互保留。检测依据当前结构和文案，不能证明正文完整性；遇到付费提示保守保留。

既有复制按钮可能复制工具栏文字、CSS !important 写法无效的问题仍存在。
