---
name: Blog Write
description: 撰写博客文章并落到 src/content/blog。含 frontmatter 规范、定位自检、字数与结构要求。选题先走 blog-plan。
---

# Blog Write

主责:按 `blog-plan` 给的选题,写出符合定位的文章,落盘到 `src/content/blog/`。

## 写之前

1. 拿到 `blog-plan` 的选题与自检结论;若没有,先触发 `blog-plan`。
2. 打开 `docs/blog-plan/positioning.md`,重跑一遍"定位自检五问"。

## 落盘位置与命名

- 目录:`src/content/blog/`(若不存在则创建)。
- 文件名 = 文章 id(同时是 URL slug 和 OG 图路径),用 kebab-case 英文短横线,如 `100-cli-tools-1.md`。

## frontmatter 规范(严格)

```yaml
---
draft: true          # 未发布前保持 true;发布时改 false
date: "18-11-2026"   # 必须 dd-MM-yyyy 格式!不是 ISO,否则列表排序失效
title: "标题"
description: "一句话摘要,用于列表与 OG 图"
category: "PM" # 取值见 docs/blog-plan/categories.md
tags: ["tag1", "tag2"]
author: "Jacques Yip" # 可省略,默认站点作者
---
```

- `date` 用 `dd-MM-yyyy`(日-月-年,两位数字),与站点 `parse(date, "dd-MM-yyyy")` 一致。
- `draft: true` 的文章不会出现在列表与静态生成中,可安全作为草稿区。
- `description` 会同时用于列表展示和自动生成的 OG 图,必须能独立成立。
- `tags` 可省略;`author` 可省略(默认站点作者)。

## category 取值

`schema` 对 category 有枚举强校验。具体用哪个值,查 `docs/blog-plan/categories.md`,不要自行定义。

## 写作要求

- 字数 2000–3500 字;双周一篇;控制在 90–150 分钟可完成。
- 遵守 `positioning.md` 的定位与拒绝清单(不写源码分析、零基础教程、求职鸡汤、情绪日记、公司内幕)。
- "产品经理的 100 个命令行工具"系列遵循固定 5 段结构(见 `mvp-90-days.md`):
  ❓一句话 / 🎯何时用 / 📝最小示例 / ⚖️与 GUI 对比 / 🧠为什么该学。
- 把"开发者工具"用于非研发场景时,要显式说明"非研发视角"(见 `positioning.md` 边界灰区)。

## 写之后

- 交给 `manuscript-review` 查稿。
- 发布前把 `draft` 改为 `false`,并让 `blog-plan` 更新排期与缓冲池。
