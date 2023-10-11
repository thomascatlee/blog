---
title: linux查看缺失的符号
date: 2020-07-01 17:39:04 +0800
author: me
tags:
    - 
---

![ldd参数](_v_images/20200701173728487_7202.png)

ldd 加-r参数，直接看到缺失符号情况。

linux下用组合命令完成运行库复制

`ldd ./bin/minitorClient | awk '{print $3}' | xargs -i cp -L {} ./bin/`