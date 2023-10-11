---
title: nginx端口
date: 2021-03-23 14:28:41 +0800
author: me
tags:
    - 
---

centos安装nginx之后，需要用semanage允许端口：
```
semanage port -a -t http_port_t  -p tcp 端口
```
