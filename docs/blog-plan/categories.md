# 分类体系(category)

> 本文件是博客分类的**语义权威**:定义为什么这么分、支柱与取值如何一一对应。
> 代码侧的机械单一来源是 `src/lib/categories.ts`(as const 数组),两者必须一致:
> 改分类时,先改这里,再同步 `src/lib/categories.ts` 一处即可。

## 分类取值(与三大支柱一一对应)

| category(枚举值) | 内容支柱 | 说明 |
|---|---|---|
| `PM` | A · PM 视角拆解技术 / AI(50%) | 视角型、行业判断 |
| `diy` | B · 个人部署与自托管(30%) | 工具教程、动手实践 |
| `growth` | C · Vibe My Life / 个人成长(20%) | 方法论、个人探索 |

## 代码侧同步点

分类取值在代码里只有一处定义,其余全部派生:

- `src/lib/categories.ts` —— `BLOG_CATEGORIES`(as const,唯一技术来源)
- `src/content.config.ts` —— `z.enum(BLOG_CATEGORIES)`(schema 校验)
- `src/lib/types.ts` —— `blogCategoryType`(派生字面量类型)
- `src/hooks/useFilter.tsx` —— 筛选按钮(import `BLOG_CATEGORIES`)

## 使用规则

- 按文章的**主导支柱**取 `category`。
- 系列文(如"命令行工具 100")若跨支柱,以单篇主题为主,不强行套。
- 新增/调整分类:先改本文件,再改 `src/lib/categories.ts` 的数组一处即可,其余自动同步。
