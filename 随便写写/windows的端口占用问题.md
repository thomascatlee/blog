---
title: windows的端口占用问题
date: 2023-12-08 16:51:46 +0800
author: wildcat
tags: []
---

开了Hyper-V之后，每次重启都会随机改变，有时和其他应用程序冲突，就搞得应用程序起不来。

要想一劳永逸的解决，就需要设置一下动态端口范围
`netsh int ipv4 set dynamic tcp start=55000 num=5000`命令行执行完，重启之后看下占用情况
```
netsh interface ipv4 show excludedportrange protocol=tcp

协议 tcp 端口排除范围

开始端口    结束端口
----------    --------
     50000       50059     *
     55339       55438
     55439       55538
     55539       55638
     55639       55738
     55748       55847
     55862       55961

* - 管理的端口排除。

```
完美解决。