---
title: Hexo部署笔记-安装与部署到Github
date: 2018-07-25 14:08:10
tags: 
    - 折腾
---

本篇记录了搭建、维护本博客的过程与设置。第一篇介绍如何安装Hexo，并把博客部署到Github，借助Github的静态网页托管服务，建立在线博客。

环境：

- Ubuntu/Windows/macOS
- Node
- Git
- Github

<!-- more -->

## 安装Git

### On macOS/Linux

macOS/Linux已经内置了Git，非常方便。只需要生成SHH-key，方便访问Github仓库即可。

### One Windows

这里选择以便携方式安装Git for Windows（手动添加环境变量），并且Git自带的Bash是个不错的工具，能够使用一些基础的bash命令，能够满足轻量需求。

## 生成与添加SSH Key

### On macOS/Linux
通过命令行生成SSH Key

```shell
ssh-keygen -t rsa -C "邮箱地址"
```

### On Windows

使用Git for Windows里面的bash.exe可以像macOS/Linux一样操作生成ssh-key，不过添加时的操作需要注意：

```shell
ssh-agent bash
ssh-add ~/.ssh/id_rsa //用于添加ssh-key文件
```

默认会在相应路径下生成id_rsa和id_rsa.pub两个文件，其中id_rsa是私钥，id_rsa.pub是公钥，私钥不要公开或者上传，公钥可以上传至github进行验证。

Windows：`c/Users/jvcon/.ssh/id_rsa` //在bash里面也同样是`~/.ssh/id_rsa.pub`
macOS：`~/.ssh/id_rsa.pub`
Linux：`~/.ssh/id_rsa.pub`

通过cat命令可以轻松查看id_rsa.pub

```shell
cat ~/.ssh/id_rsa/pub
```

打开公钥文件即可以复制，进入Github，添加SSH Key，`github -> settings -> ssh and gpg keys -> new ssh key`

## 安装Node.js

### On macOS

已经安装好homebrew的基础上，终端中输入命令行安装node。[填坑安装及使用Homebrew]()

```shell
brew install node
```

### On Windows

同样选择以便携方式安装Node.js，给系统手动添加环境变量。

## 安装Hexo

安装node后，使用npm安装hexo以及相应需要的组件

```shell
npm install hexo-cli -g
```

## 使用Hexo

### 初始化Hexo

新建一个目录用于存放你的hexo博客资料，并且进行初始化。

```shell
mkdir hexo //名字可以自定义，作为hexo的主目录
cd hexo //进入到hexo主目录
hexo init //在hexo目录下初始化
```

### 安装npm组件

有一些组件需要安装好，才能保证Hexo正常运行

```shell
npm install hexo-deployer-git --save
```

### 新建博文与查看

由于hexo初始化会建立基础文件，开箱即用。（在忽略主题、配置情况下，可以开始攥写博文）

通过下方命令可以新建博文，在`/source/_data`文件夹下可以看到`title.md`

```shell
hexo new “title” //新建一个标题为title的博文
```

生成与预览

```shell
hexo clean  //清理缓存文件
hexo g  //渲染成静态网页文件
hexo s  //打开本地服务器，通过访问http://localhost：4000可以查看效果
```

## 部署至Github

Github本身有友好的静态网页托管服务`gh-page`，因此利用Github可以方便的搭建在线博客。

### 新建Github仓库

由于我是用于个人博客，因此新建一个仓库名为`<用户名>.github.io`，Github会自动识别该仓库中的`master`分支，为网页托管分支。

**注意**：若非个人仓库，而是普通的仓库，需要使用`gh-pages`分支，才可以进行托管。

在`Clone or Download`按钮，可以获得类似下方的ssh链接，稍后会用于部署。

```shell
git@github.com:<用户名>/<项目名>.git
```

### 配置Github部署路径

修改hexo主目录下的`_config.yml`的`deploy`：

```yml
deploy:
  type: git
  repository: git@github.com:<用户名>/<项目名>.git  //仓库ssh链接
  branch: master    //非个人仓库则填写gh-pages
```

当需要部署到Github线上时，执行下面命令即可。

```shell
hexo g
hexo d -g
```