---
name: Portfolio Organize
description: 整理作品集 src/portfolio-config.json:项目描述、简介、能力清单、架构说明与标签。
---

# Portfolio Organize

主责:维护 `src/portfolio-config.json` 中的作品集内容,不改页面渲染逻辑。

## 数据结构(单个项目)

- `id`:kebab-case,URL 标识
- `data.date`:格式 `dd-MM-yyyy`(如 `17-02-2025`)
- `data.category`:项目分类(如 ai / gameplay / analytics / hardware / software)
- `data.title` / `data.description` / `data.tags[]` / `data.status`(prototype | playable | production | beta)
- `introduction`:一段完整介绍,说清"动机 → 做法 → 结果"
- `links[]`:`{ label, url }`
- `video`:YouTube embed 链接或 null
- `brief.capabilities[]`:能力要点(每条一个可验证的能力)
- `brief.architecture[]`:架构 / 实现要点(每条讲清关键设计)

## 整理要点

- `description` 一句话能独立成立;`introduction` 讲清"为什么做 → 怎么做 → 结果"。
- `capabilities`(能做什么)与 `architecture`(怎么实现)要区分开,不要混写。
- `tags` 与技术栈保持一致;`links` 的 URL 必须可访问。
- `status` 反映真实阶段,不要虚标 production。

## 护栏

- 只改 JSON 内容值,不改字段结构。
- 编辑后确保 JSON 合法(逗号、引号、数组闭合),避免破坏构建。
- 不虚构能力与数据。
