---
title: 【引导部署笔记】第一篇——多重引导启动盘规划
date: 2018-07-28 16:31:37
tags:
    - 折腾
---

## 前言

通常维护重装系统都是一支U盘走天涯，刷了再刷，U盘寿命有限，而且遇上身边没有电脑那就很麻烦。

因此萌生了想要做一个只要硬件不挂，就能顺利启动引导各种系统的U盘/移动硬盘。

<!-- more -->

## 硬件方案选择

- WD绝版移动硬盘(1T):用于制作macOS Windows Linux三个平台的安装引导，以及移动系统（便携linux、PE和VHD）的多功能启动盘
- U盘()：用于制作Arch Linux、Deepin、Linux Mint和Windows的四个系统的安装盘
- 正常运行的电脑

## 引导规划

移动硬盘能够通过EFI引导，适用于目前市面流行的Windows、Linux、MacOS、Android x86等系统的安装与启动；U盘用作旧电脑，通过Legacy引导启动，能够启动并安装Linux Mint、Deepin、Windows7系统

## EFI核心引导

从丰富的引导方案中选择三大核心，分别是适用于macOS的Clover（同时还支持黑苹果的引导），Linux的Grub2，Windows原生引导，并且他们都支持EFI启动。

Clover可以搜索引导项，而且界面美观，相当适合作为主引导；如果不需要macOS，可以以Grub2作为主引导。

|引导方案|Clover|Grub2|Windows(Native)|
|-------|:----:|:---:|:-------------:|
|EFI|√|√|√|
|Legacy|√|√|✕|
|跨平台支持|√|√|✕|
|目标系统|主引导|Linux/Android/PE|Windows/VHD/PE|

### 辅助引导工具

- [grub2-filemanager](https://github.com/a1ive/grub2-filemanager)：基于Grub2的文件管理/镜像启动工具，本身也可以作为Grub2使用，但这里用它来引导镜像更为合适。
- KonBoot:绕过Windows密码工具

### 引导架构

```txt
ESP
    EFI
        BOOT
            BOOTX64.efi //主引导文件通用名，任何命名为BOOTX64.efi都可以被作为主引导
        CLOVER  //Clover引导文件夹
            CLOVERX64.eif   //EFI启动文件
            config.plist    //Clover启动配置文件
            drivers64UEFi   //64位UEFI驱动
            tools   //驱动工具
            themes  //Clover主题文件夹
            kexts/Other   //主要驱动文件夹
        GRUB    //Grub2引导文件夹
            grubx64.efi //EFI启动文件(x64)
            grub.cfg    //Grub2启动配置文件
        Microsoft    //Windows引导文件夹
            Boot
                bootmgfw.efi
                bootmgr.efi
                BCD
                zh-CN
                    bootmgfw.efi.mui
                    bootmgr.efi.mui
```

## Legacy核心引导


### 引导架构
用于写入MBR
      //Legacy