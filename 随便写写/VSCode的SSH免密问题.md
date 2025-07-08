---
title: VSCode的SSH免密问题
date: 2025-03-06 15:33:34 +0800
author: wildcat
tags:
  - SSH
  - 免密登录
---


用公私钥体系实现SSH远程登陆很简单，在ssh命令行也试了，证书没问题；但是在VSCode下，却总是提示我输入密码，一直也没深究。
今天排查了一下，在VSCode的日志中发现了线索：

```
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

> @         WARNING: UNPROTECTED PRIVATE KEY FILE!          @

> @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

> Permissions for 'd:\\lixin\\.ssh\\id_rsa@10.10.10.161' are too open.

> It is required that your private key files are NOT accessible by others.

> This private key will be ignored.
```

看来是VSCode的SSH客户端对私钥文件做了更严格的权限检测，解决也很简单，不想给私钥文件单独设权限了，把私钥文件放回原来的C:\User\用户\.ssh目录，并修改config文件，把IdentityFile的位置指对了，就可以免密啦。
