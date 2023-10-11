---
title: win10的端口占用问题
date: 2021-11-14 17:53:03 +0800
author: me
tags:
    - 
---

有一个应用程序启动时，绑定TCP端口失败，用netstat -ano查看，没有发现有进程占用端口，百思不得其解。

在powershell下输入`netsh int ipv4 show dynamicport tcp`查看动态端口，是从1024-65535，没问题。
查看tcp ipv4端口排除范围（被系统或者我们自己保留的端口）`netsh int ipv4 show excludedport tcp`，原来问题在这里，端口被保留了。
用管理员powershell输入`netsh int ipv4 set dynamicportrange tcp 10000 55535`，把动态端口从10000开始，10000以下就不会被保留了。
重启一下，应用程序可以正常绑定端口了。