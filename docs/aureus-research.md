# aureus 包调研报告：commit message 验证规则

> 调研日期：2026-10-03
> 研究对象：npm 包 `aureus`（项目通过 `.husky/commit-msg` 中的 `npx aureus verify -- $1` 调用）
> 结论依据：npm registry API 元数据 + GitHub 公开源码 + 本地 npx 缓存中的 `dist/index.js`（实际运行的代码，v1.7.0）+ 真实二进制端到端实测

---

## 1. 执行摘要（关键结论）

1. **你的 commit 被拒的真正原因不是 type 用错，而是消息必须是「单行」**。aureus 的 `verify` 对整个 commit message 文件做一次全量正则匹配——正则中 `.` 不匹配换行符，而你的消息带有 body（多行），所以必然失败。`feat` 在类型白名单里，单行形式 `feat(blog): ...` 实测可通过。
2. **`verify` 不接受任何 body、footer、`Signed-off-by:`、blank line 分隔等 Conventional Commits 规范元素**——它们都会引入换行，导致整条消息被拒绝。这是与 commitlint 等工具最大的差异。
3. **类型白名单仅 8 个（全小写）**：`feat, fix, refactor, build, chore, test, ops, revert`。注意**没有 `docs`、`style`、`perf`、`ci`**。文档类变更请用 `chore`（aureus 自己的说明里 `chore` 就包含 docs）。
4. **规则完全硬编码，不支持自定义**：`verify` 不读取任何项目级配置文件（没有 `.aureusrc.json`）；`~/.aureus/config.json` 只是 `init`/`commit` 交互命令的用户偏好，与 `verify` 无关。
5. **包是公开的、MIT 协议的小型 CLI**：npm 最新版 1.7.0（2026-04-01 发布），GitHub 仓库为 `github.com/hansdash/Aureus`（原 `8366888C/aureus` 重定向而来），作者公开身份为 **Rahul**（`deploy.rahul@gmail.com`）；「Subhashis Hansda / goldie-eluoguogu」的猜测与公开元数据不符（详见 §2.5）。

---

## 2. aureus 包信息

### 2.1 基本信息（来源：npm registry API `registry.npmjs.org/aureus`）

| 字段 | 值 |
|---|---|
| 名称 / dist-tag | `aureus` / `latest = 1.7.0` |
| 版本 | 1.7.0（2026-04-01T13:51:04Z 发布，与 1.6.0 同日发布） |
| 协议 | MIT |
| Node 要求 | `>=18.0.0` |
| 依赖 | `commander ^14.0.3`、`enquirer ^2.4.1`（仅此两个运行时依赖） |
| 描述 | "CLI tool to bootstrap, standardize and automate repository workflows" |
| 作者（author 字段） | Rahul `<deploy.rahul@gmail.com>` |
| npm maintainers | `8366888c`（历史）/ `a58361`（当前，同名邮箱） |
| 仓库 | `git+https://github.com/8366888C/aureus.git`（实际重定向到 `hansdash/Aureus`） |
| homepage | `https://github.com/8366888C/aureus#readme` |

> 注：npmjs.com 的网页端有 Cloudflare 人机验证，直接 fetch 返回 403；上述数据来自 npm registry JSON API（正常返回 200），数据可信。

### 2.2 版本历史

首次发布 2026-02-07（0.0.0），到 1.7.0 共 15 个版本。1.7.0 就是当前最新版，**项目里 npx 缓存的正是 1.7.0**（`/home/.npm/_npx/.../node_modules/aureus/package.json` 中 `version: "1.7.0"`）。

⚠️ 一个坑：`aureus --version` 实际打印 **1.6.0**——原因是 CLI 的版本字符串在打包时内联了构建环境的 `VERSION` 变量，1.7.0 发布时没更新它（源码 `index.ts` 里是 `.version(process.env.VERSION as string, "-v, --version")`，dist 中被实例化为 `"1.6.0"`）。不是装了旧版。

### 2.3 GitHub 仓库（来源：GitHub API）

- 仓库：`https://github.com/hansdash/Aureus`（旧地址 `8366888C/aureus` 301 重定向到它）
- 语言：TypeScript（tsup 打包）；公开；**0 stars / 0 forks**；创建于 2026-02-04，最后 push 2026-04-01（与 1.7.0 发布吻合）
- 源码结构：`src/index.ts`（CLI 命令注册）+ `src/utils.ts`（含 `VERIFY`/`BUMP` 等实现）+ `src/types.ts`（`commit_types` 定义）+ `templates/*.json`
- 自带 `.husky/commit-msg` 内容与项目完全一致（`# aureus-setup-anchor` + `npx aureus verify -- $1`），说明项目里的 hook 就是 `aureus create husky-hooks` 生成的
- 无独立官网/文档站；文档即 npm README

### 2.4 功能概览（README）

`init`（脚手架）、`create/ view <component>`、`commit`（交互式生成合规消息）、`verify`（校验 commit message）、`bump`（semver + changelog，接 `pre-push` hook）。它本质是一个「项目脚手架 + husky hook 生成器」，`verify` 只是其中很小的一部分。

### 2.5 关于作者身份

- npm `author`: **Rahul <deploy.rahul@gmail.com>**
- GitHub 用户 `hansdash` 的 profile `name` 字段也是 **"Rahul"**，且 13 个公开仓库、创建于 2025-06-18
- 你之前的信息「Subhashis Hansda / goldie-eluoguogu」**没有公开证据支持**——唯一沾边的是 GitHub 用户名 `hansdash` 形似 "Hansda" 的变体，但公开字段写的是 Rahul。不排除同一人用多个账号，但基于公开信息只能确认 **Rahul (hansdash)**，请勿把未证实身份写进正式文档。

---

## 3. `verify` 子命令的规则细节（核心）

### 3.1 实现代码（源码 `src/utils.ts` 中的 `VERIFY`，与 dist 产物逐字一致）

```ts
export function VERIFY(file: any) {
  const commitMsgFile = file || process.argv[process.argv.length - 1];
  if (!commitMsgFile || !fs.existsSync(commitMsgFile)) {
    ERROR("Commit message file not found");
    process.exit(1);
  }

  const msg = fs.readFileSync(commitMsgFile, "utf-8").trim();
  const types = commit_types;                    // 见 3.2
  const regex = new RegExp(`^(${types.join("|")})(\\(.+\\))?!?: .+$`);

  if (!regex.test(msg)) {
    ERROR(`Invalid commit message format: "${msg}"`);
    WARN(`Format must follow Conventional Commits: one of [${types.join(", ")}]`);
    process.exit(1);
  }
  SUCCESS("Commit message verified");
}
```

要点：**读文件 → `.trim()` → 构造正则 → `test()` 整个字符串 → 成功打印 "Commit message verified" 退出 0，失败打印 ERROR+WARN 退出 1**。没有 JSON schema、没有外部 API、没有任何远程调用，纯本地确定性校验。

### 3.2 type 白名单

`commit_types = Object.keys(COMMIT_TEMPLATES)`（`src/types.ts`），即 `templates/commit.json` 的键，共 **8 个，全小写**：

```
feat  fix  refactor  build  chore  test  ops  revert
```

- 大小写敏感：`Feat:`、`FEAT:` 都不通过
- **没有 `docs`**（→ 用 `chore`）、**没有 `style`/`perf`/`ci`**、没有 `wip`
- 错误提示里的白名单与你看到的一致

### 3.3 完整正则

```
^(feat|fix|refactor|build|chore|test|ops|revert)(\(.+\))?!?: .+$
```

逐段拆解：

| 段落 | 规则 |
|---|---|
| `^` 与 `$` | 锚定**整条消息**（trim 后）必须整体匹配 → 见 3.4 单行约束 |
| `(type\|...)` | type 严格等于 8 个白名单之一 |
| `(\(.+\))?` | **可选 scope**：`(` + 至少 1 个任意非换行字符 + `)`；无字符限制（可含空格、可嵌套括号，如 `feat(scope with spaces): x` 也通过）；位置必须在 type 之后 |
| `!?` | 可选 breaking 标记；**必须在 scope 之后、冒号之前**（`fix(core)!: x` ✓；`fix!(core): x` ✗——`!` 在 scope 前不合法） |
| `: ` | **冒号后必须正好一个空格**（`feat:subject` ✗；`feat:  subject` ✓，因为 `.+` 吞掉多余空格） |
| `.+` | **subject ≥ 1 个字符**，任意字符但**不含换行**；无长度上限 |

### 3.4 关键结论：整个消息必须只有一行

这是本次调研最重要的发现。`t` 是 `readFileSync(...).trim()` 后的**完整字符串**，正则 `^...$` 要求整条消息从头到尾匹配；而 JS 正则的 `.` 不匹配 `\n`/`\r`，所以**任何换行都会让 `.+` 与 `$` 失配**。因此：

- ✗ **任何 body 都会失败**（包括 `\n\n` 分隔、bullet 列表、自定义段落如 "Positioning:"）
- ✗ 任何 footer（`BREAKING CHANGE:`、`Signed-off-by:`、`Reviewed-by:`）都会失败
- ✗ 不要求、也不允许 blank line 分隔——因为 body 存在本身即非法
- ✓ 唯一的合法形态：**单行 `type(scope)?!?: subject`**
- 尾部换行没关系（文件 `git` 写入时通常带 `\n`，`trim()` 会去掉）

### 3.5 你此前被拒消息的复盘

```
feat(blog): add grill-based planning docs and remove template samples
- Add docs/blog-planning-research.md (methodology + 11 case studies + ...)
```
→ 被拒**不是因为** `feat`、`blog` scope、`-` bullet 或 "Positioning:" 之类关键词，而是因为**第 2 行起的 body 引入了换行**。规则层面不存在关键词黑名单、bullet 符号要求（`-`/`*` 都不看，因为多行根本到不了这一步）、footer 要求或 body 行数限制——这些在 aureus 里全部退化为「不许有多行」。

### 3.6 其他行为细节

- 文件不存在 → `ERROR("Commit message file not found")` + exit 1
- 未传文件参数时退化为 `process.argv` 最后一项（husky hook 总是传 `$1`，无影响）
- `npx aureus verify -- $1` 中的 `--` 是 commander 的「选项结束」分隔符，`$1` 作为 position argument 传入
- **没有任何配置文件**：README 中提到的 `~/.aureus/config.json` 只存 `author_name`、`package_manager`、`license` 等 init 偏好；`verify` 不读取它，项目内也不存在 `.aureusrc`/`aureus.config.*`

---

## 4. 已知能通过的 commit message 示例

以下全部经真实二进制 `npx aureus verify -- <file>` 实测（exit 0 = 通过）：

```text
# 1. 无 scope，最简单
feat: add grill-based planning research docs
```
```text
# 2. 与你原本意图等价，但必须单行（实测通过）
feat(blog): add grill-based planning docs and remove template samples
```
```text
# 3. 文档类变更用 chore（aureus 没有 docs 类型）
chore(docs): update readme with new links
```
```text
# 4. breaking change：! 在 scope 之后（实测通过）
fix(core)!: stop using deprecated API
```
```text
# 5. breaking change 无 scope（实测通过）
feat!: add new dashboard without scope
```
```text
# 6. revert（实测通过）
revert: undo previous commit
```
```text
# 7. build + scope（实测通过）
build(deps): bump astro to 5.x
```
```text
# 8. test / refactor / ops（正则必然通过，未单独实测但同一条正则）
test(blog): add snapshot tests for planning pages
refactor: simplify commit message parser
ops: rotate database backup credentials
```

> 验证用 shell 一句话：`printf 'feat(blog): xxx' > /tmp/msg && npx aureus verify -- /tmp/msg && echo OK`

---

## 5. 下一步建议

### 5.1 让 commit 立刻通过（零配置）

**把 message 写成单行即可**，不需要任何配置文件（`verify` 也不支持配置）：

```bash
git commit -m "feat(blog): add grill-based planning research docs and remove template samples"
```

需要记录更多细节（方法论文档名、案例数）时，建议把「盘点信息」压进 subject 或拆成多个单行 commit；也可以先 `npx aureus commit`（交互式引导生成合规消息）。

### 5.2 如果确实需要 body（推荐方案：换校验器）

aureus 的设计决定了它**无法放行带 body 的 commit**。若项目希望用 Conventional Commits 完整的 header/body/footer 格式，推荐：

1. 默认方案：改用 `@commitlint/cli` + `@commitlint/config-conventional`，hook 里：
   ```sh
   #!/bin/sh
   npx --no-install commitlint --edit "$1"
   ```
   它支持 `.commitlintrc` 自定义 type/长度，且允许多行消息。注意 commitlint 默认 type 列表是 `build chore ci docs feat fix perf refactor revert style test`（含 `docs`），与 aureus 的 8 个不同。
2. 或者 `git-conventional-commits`（npm 上同类工具，同样支持自定义类型）。

### 5.3 临时禁用但不丢配置

`.husky/commit-msg` 是 husky 生成的文件，保留「锚点注释」就不会在下次 `aureus create husky-hooks` 时被重复追加（源码里按 `# aureus-setup-anchor` 签名判断是否已存在）。两种禁用方式：

```sh
# 方式 A：仅注释掉校验行（推荐，保留钩子文件与锚点）
#!/bin/sh

# aureus-setup-anchor
# npx aureus verify -- $1
```
```sh
# 方式 B：显式放行（语义更清楚）
#!/bin/sh

# aureus-setup-anchor
npx aureus verify -- $1 || true
```

hook 脚本退出码为 0 时 git 放行；husky 只对非零退出码报 `commit-msg script failed`。

### 5.4 需要留意的两个坑

- **`aureus --version` 显示 1.6.0**：包确实是 1.7.0，这是上游打包时版本号没同步，别误判为装错版本。
- **不要在 message 里押注多行**：想用 `-m` 拼多段（`git commit -m "header" -m "body"`）目前必被拒，除非换 5.2 的校验器。

---

## 附录：证据来源

| 证据 | 来源 |
|---|---|
| package.json / README / dist/index.js（v1.7.0） | 本地 npx 缓存 `/home/.npm/_npx/898163656abcfdfb/node_modules/aureus/`（与 registry tarball 同源） |
| 版本列表、maintainers、发布时间 | `https://registry.npmjs.org/aureus`（npm registry API） |
| VERIFY 源码 / commit_types 定义 | `https://github.com/hansdash/Aureus`（`src/utils.ts`、`src/types.ts`、`templates/commit.json`） |
| 作者身份 | `https://api.github.com/users/hansdash`、registry `author` 字段 |
| 通过/失败用例 | 直接执行 `npx aureus verify -- <file>` 实测（8 组用例全通过 / 3 组失败用例复现了你的报错） |
| 项目侧 hook | `/home/jvcon.github.io/.husky/commit-msg`（`# aureus-setup-anchor` + `npx aureus verify -- $1`） |

**限制说明**：npmjs.com 网页端有 Cloudflare 防护无法直接抓取（已用 registry API 替代）；aureus 无闭源或付费部分，全部逻辑在 MIT 公开源码中；本文未臆测任何未见于公开元数据的作者信息。