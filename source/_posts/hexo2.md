---
title: Hexo部署笔记-主题部署及备份到Github
date: 2018-07-27 10:05:21
tags:
    - 折腾
---

本篇记录了搭建、维护本博客的过程与设置。

Hexo的一大亮点是有丰富的主题，所以本篇我们来换主题！！！

另外一些基础的Hexo教程都没有说到Hexo源文件怎么备份，Hexo的原理是将源文件选染成静态网页，再上传到相应的托管服务，所以源文件是不会在托管目录里面，我通过Github本身来备份源文件，这样写的博文就不会丢失。

<!-- more -->

## Hexo主题配置

Hexo主题可以通过下面的网站获取：

- [Hexo官方主题列表](https://hexo.io/themes/)
- [Zhihu网友推荐](https://www.zhihu.com/question/24422335/answer/46357100)
- [Next](https://github.com/iissnan/hexo-theme-next)
- [Yilia](https://github.com/litten/hexo-theme-yilia)(以该主题为例)

### 获取Themes

通过git可以轻松获取主题文件

```shell
git clone https://github.com/litten/hexo-theme-yilia.git themes/yilia
```

但由于我希望能够备份我的所有源文件（博文和配置），因此我做了调整：

- 先将喜欢的主题Fork下来，这样自己就有一份仓库，可以及时更新和备份；
- 通过Submodle（子模块），将这一个主题仓库，再添加到我的主题文件夹中，操作如下：

```shell
git submodule add git@github.com:<用户名>/<仓库名>.git themes/yilia
```

这样我针对主题中的修改和配置，可以像对自己Github仓库一样，增删改查：

```shel
cd themes/yilia //进入子模块目录
git status  //查看状态
git add .   //增加修改
git commit -m "comments"    //评论
git push    //更新到子模块所对应的仓库
```

注意，以上操作只针对Fork下来的主题仓库，那么用于备份Hexo的主仓库，也应该要add、commit、push的操作一次，以更新主仓库内容。

附：

```shell
git submodule foreach git pull  //在主目录下更新子模块
```

### 配置与使用Yilia

修改hexo根目录下的 `_config.yml` ，1、启用主题；2、启用json生成所有文章索引：

```yaml
theme: yilia

# jsonContent
jsonContent:
  meta: false
  pages: false
  posts:
    title: true
    date: true
    path: true
    text: false
    raw: false
    content: false
    slug: false
    updated: false
    comments: false
    link: false
    permalink: false
    excerpt: false
    categories: false
    tags: true
```

生成所有文章的目录需要安装node组件：

```shell
npm i hexo-generator-json-content --save
```

像一些图片、头像、赞赏码等素材，可以放在`source`文件夹中新建`assets/img`文件夹，通过引用`/assets/img/name.jpg`即可。

根据自己需要修改主题文件夹中的`_config.yml`的其他配置，即可以部署看到效果。

## Github备份Hexo

在第一篇《Hexo部署笔记-安装与部署到Github》中使用了Github仓库做了在线托管，为了实现到哪里都可以继续写博文，继续使用这一个仓库作Hexo的备份。

### 新建分支和初始化

在Github的仓库中，新建一个`hexo`分支，结构如下:

```txt
<Repository>
├─master
└─hexo
```

回到本地的`Hexo`主目录，初始化，让它成为一个可以用Git管理版本历史的文件夹：

```shell
git init
```

由于hexo已经考虑到Git的备份，所以在`.gitignore`文件中已经跳过了一些hexo模块文件和缓存文件，hexo模块文件可以在不同电脑重新通过`hexo init`初始化，没必要进行备份，以下是`.gitignore`的内容：

```txt
.DS_Store
Thumbs.db
db.json
*.log
node_modules/
public/
.deploy*/
```

### 关联远程仓库

关联前确保已经添加了SSH-key到Github，详情可以看《Hexo部署笔记-安装与部署到Github》。

1、关联远程仓库

```shell
git remote add origin git@github.com:<用户名>/<仓库名>.git
```

2、为本地新建分支`hexo`

```shell
git checkout -b hexo
```

3、添加本地与远程分支关联

```shell
git branch --set-upstream-to=origin/hexo hexo
```

4、进行获取或者备份

```shell
git pull
git add .
git status
git commit -m "create backup"
git push
```

## 多说几句

- 主题可以使用子模块的方式参与备份，相当是将主题通过Fork的方式建立多个自己的仓库；
- git要记得，先拉取再推送，分支需要确认无误，不要推到master里面了。