---
title: 查看windows凭据的密码
date: 2025-09-29 13:45:42 +0800
author: wildcat
tags:
  - Windows
  - 凭据
  - 密码
---
windows的凭据密码不像Edge钱包这种，会让你查看；所以一旦自己忘记了，就有点麻烦。
[GitHub - gentilkiwi/mimikatz: A little tool to play with Windows security](https://github.com/gentilkiwi/mimikatz)
这个工具可以帮助你。

下载完成后，以管理员方式运行`mimikatz.exe`，忽略杀毒软件的一系列告警。
```
mimikatz# privilege::debug
mimikatz# sekurlsa::logonpasswordsvault::cred
mimikatz# vault::cred
```
然后在输出里找一下你要的网站对应的密码明文

