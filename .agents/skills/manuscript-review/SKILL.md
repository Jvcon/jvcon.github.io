---
name: Manuscript Review
description: 对博客文稿做发布前检查:定位自检、错别字、结构、frontmatter、事实与链接。默认只标注不重写。
---

# Manuscript Review

主责:对 `src/content/blog/` 下的文稿做发布前检查。默认只标注与建议,不直接重写(重写交回 `blog-write`)。

## 检查清单(逐项过)

1. **定位自检五问**(`docs/blog-plan/positioning.md`):任何一条答"否"→ 标记,退回 `blog-write`。
2. **拒绝清单**:是否踩了源码分析 / 零基础教程 / 求职鸡汤 / 情绪日记 / 公司内幕。
3. **frontmatter**:
   - `date` 是 `dd-MM-yyyy` 格式;
   - `category` 在 `engineering | workflow | strategy | devlog` 枚举内;
   - 发布前 `draft` 为 `false`;
   - `description` 能否独立成立。
4. **结构与节奏**:是否有开篇钩子 + 主体 + 结尾;小标题是否清晰;段落是否过长。
5. **错别字与标点**:中英文混排空格、标点统一(中文用全角、英文用半角)。
6. **事实与链接**:外部链接可访问、事实有依据;工具版本 / 命令是否有误。
7. **字数**:2000–3500 字。

## 输出

按严重程度列出问题(阻断 / 建议),附文件与位置。只做标注,用户确认后再改。
