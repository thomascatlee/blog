---
title: 继续给codebuddy强插python-env
date: 2026-04-13 16:45:19 +0800
author: wildcat
tags:
  - VSCode
  - Codebuddy
  - python
  - 远程
  - 插件
---
在Linux服务器远程调试python时，发现之前设置的python插件都没了，远程上需要再安装一次；不出所料的，python-env那是安不上的，只能从vscode里面扒。把.vscode-server/extensions/ms-python.vscode-python-envs-1.12.0复制到codebuddy的插件目录（.codebuddy-server-cn/extensions/ms-python.vscode-python-envs-1.12.0），并修改package.json，把vscode的版本依赖改成和codebuddy一致：
```
"vscode": "^1.100.0"
```
这样在codebuddy的终端里就又能在远程服务器上自动把python环境切过来了。
