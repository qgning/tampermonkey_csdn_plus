// 导入文件读写接口。
import { readFileSync, writeFileSync } from 'node:fs';
// 导入 SHA-256 校验和接口。
import { createHash } from 'node:crypto';
// 导入断言接口以在验证失败时退出。
import assert from 'node:assert/strict';
// 读取项目版本，路径相对于当前脚本。
const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
// 要求版本为正式版或合法的语义化预发布版本。
assert.match(version, /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(?:(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?$/, 'package.json 版本必须是语义化版本（不含构建元数据）');
// 标签触发时校验标签与项目版本一致，分支触发时跳过标签检查。
if (process.env.GITHUB_REF?.startsWith('refs/tags/')) {
  // 防止发布标签与油猴更新版本不一致。
  assert.equal(process.env.GITHUB_REF, `refs/tags/v${version}`, '发布标签必须等于 v + package.json 版本');
// 结束标签校验。
}
// 固定附件名称以兼容现有油猴更新地址。
const filename = 'tampermonkey_csdn_plus.user.js';
// 读取实际构建文件，文件缺失时直接失败。
const asset = readFileSync(new URL(`../dist/${filename}`, import.meta.url));
// 提取文件开头的油猴元数据块。
const metadata = asset.toString('utf8').match(/^\/\/ ==UserScript==\r?\n([\s\S]*?)\/\/ ==\/UserScript==/);
// 确认产物具有有效的油猴脚本头。
assert.ok(metadata, '构建产物缺少油猴元数据块');
// 确认发布文件的真实版本与 package.json 一致。
assert.equal(metadata[1].match(/^\/\/\s+@version\s+(\S+)\s*$/m)?.[1], version, '构建产物版本不一致');
// 为发布附件生成标准 SHA-256 校验和文件。
writeFileSync(new URL('../dist/SHA256SUMS', import.meta.url), `${createHash('sha256').update(asset).digest('hex')}  ${filename}\n`);
// 输出验证结果供 CI 日志审阅。
console.log(`Release asset verified: ${filename} (${version})`);
