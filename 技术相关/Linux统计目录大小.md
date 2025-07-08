---
title: Linux统计目录大小
date: 2024-12-17 11:15:20 +0800
author: wildcat
tags:
  - Linux
  - bash
---

`du -ah --max-depth=1`
-a 当前目录下所有文件  
-h 以human可读的方式统计，不用自己去数位数换算KMG
--max-depth=1 当前目录下1级子目录，这样就可以看到各子文件夹的大小了