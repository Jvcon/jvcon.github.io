---
name: Resume Polish
description: 打磨中英双语简历:经历/项目/教育/志愿/认证的措辞、量化、结构与 schema 合规。
---

# Resume Polish

主责:打磨简历内容(措辞、量化、结构、双语一致性),不改页面样式与布局。

## 内容位置

- 简历条目:`src/content/resume/{experience,projects,education,volunteering,certifications}/*.{zh,en}.md`
- 简历头部 / 技能 / 标签:`src/resume-config.json`

## 双语约定

- 每个条目一对文件,同名 `xxx.zh.md` 与 `xxx.en.md`,`lang` 分别填 `zh` / `en`。
- 中英内容语义对齐(不是逐字直译),术语和数字两边一致。
- 修改一处时,两语同步。

## frontmatter schema(按集合,见 `src/content.config.ts`)

- 通用:`lang`(zh|en)、`order`(排序数字)、`draft`(bool)
- experience:`organization / position / employmentType / startDate / endDate / location`
- projects:`name / role / startDate / endDate / url`
- education:`institution / degree / fieldOfStudy / startDate / endDate / grade`
- volunteering:`organization / position / startDate / endDate`
- certifications:`name / issuer / date / url / credentialId`
- 日期格式统一 `yyyy-MM-dd`(如 `2019-08-01`)

## 打磨要点

- **量化优先**:把"优化了菜单管理"改成"维护约 700 份对象数据,集约管理 4000+ 门店菜单,降低换季调整成本"。
- **动词开头**的要点句式,每条只讲一个动作与产出。
- **去除空话**:删掉"负责""参与"这类无信息量表述,换成具体产出。
- 正文用 Markdown:`## 工作内容` / `## 负责内容` 分节 + 列表;结尾可留一行 `**技术栈**`。
- 中文用中文标点,英文用英文标点。

## 护栏

- 不虚构经历与数据,只基于已有事实重组表达。
- 不改 `resume-config.json` 的字段结构(除非用户明确要求),只改内容值。
