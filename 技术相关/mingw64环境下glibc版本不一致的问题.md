---
title: mingw64环境下glibc版本不一致的问题
date: 2022-06-27 16:33:42 +0800
author: me
tags:
    - 
---

折腾cmake，用windows版本的一直不对，想着用mingw的试试，pacman安装完之后，命令行执行cmake没反应。msys下安装的也是一样，真是见鬼哦。然后发现在windows下直接双击运行报错，_ZNSs7reserveEv找不到云云。搜一下_ZNSs7reserveEv，应该是glibc里面的，莫非是glibc的版本对不上了？pacman装一下glibc，妥了。真是奇怪，安装cmake的时候怎么没根据依赖更新呢。