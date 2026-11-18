---
name: Blog Plan
description: 维护 docs/blog-plan 内容策略(选题、排期、分类体系、月度/季度复盘、定位收敛)。写文章前用它取题;复盘时用它更新规划。
---

# Blog Plan

主责:维护 `docs/blog-plan/` 下的内容策略文件,它是博客的"语义权威"。只产出规划,不写文章正文。

## 前置阅读(按需)

- `docs/blog-plan/README.md` —— 执行版索引
- `docs/blog-plan/positioning.md` —— 定位声明 + 拒绝清单 + 定位自检五问
- `docs/blog-plan/categories.md` —— 分类体系(支柱 → category 映射,语义权威)
- `docs/blog-plan/mvp-90-days.md` —— 内容矩阵(50/30/20)+ 90 天排期 + 缓冲池
- `docs/blog-plan/worksheet.md` —— 一页纸工作表 + 月度/季度复盘模板
- `docs/blog-planning-research.md` —— 原始调研(冲突时以 `docs/blog-plan/` 执行版为准)

## 工作流

### 1. 选题(交给 blog-write 之前)

1. 从 `mvp-90-days.md` 的 90 天排期取下一个双周块选题。
2. 用 `positioning.md` 的"定位自检五问"逐条过;任何一条答"否"→ 改选题或不立项。
3. 在 `worksheet.md` 的"竞争空白环"里填验证日期、验证结果、是否立项。
4. 从 `categories.md` 确认该选题的 `category`,连同"选题 + 自检结论 + category"一起交给 `blog-write`。

### 2. 月度复盘(每月末)

- 打开 `worksheet.md` 的"月度复盘模板",按模板填写数据与调整。
- 同步更新 `mvp-90-days.md` 的缓冲池(选题池 ≥ 10、草稿区 ≥ 1、成品区 ≥ 1)。

### 3. 季度回顾(每 90 天)

- 按 `worksheet.md` 的"季度深度复盘"五点检查:支柱比例 / 心智占位词 / 节奏 / 定位声明 / 可持续性瓶颈。
- 需要调整时改 `mvp-90-days.md` 与 `positioning.md`。

### 4. 定位收敛

- 发布 5–10 篇后,根据读者反馈 + 自身体感,从两个候选("产品经理看世界" / "Vibe My Life")收敛心智占位词,更新 `positioning.md`。

### 5. 分类体系维护

- 分类语义以 `docs/blog-plan/categories.md` 为准。
- 需要新增/调整分类时,先改 `categories.md`,再同步 `src/lib/categories.ts` 的数组一处即可(其余自动派生)。

### 6. 同步索引

- 任何规划变更后,更新 `docs/blog-plan/README.md` 的"文件清单"表格与变更说明。

## 护栏

- 只改 `docs/blog-plan/**`,不写文章正文(正文交给 `blog-write`)。
- 执行版优先于调研版;冲突时以 `docs/blog-plan/` 为准。
- 分类取值不在 skill 里写死,一律查 `categories.md`。
- 每次变更落盘,并在 README 留下变更记录。
