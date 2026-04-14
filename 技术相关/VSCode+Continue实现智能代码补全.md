---
title: VSCode+Continue实现智能代码补全
date: 2026-03-11 13:20:59 +0800
author: wildcat
tags:
  - VSCode
  - ollama
  - qwen
---
新版的continue在模型配置上大幅简化，对用户更为友好，我们用它来给vscode增加本地的代码补全功能，不用联网消耗token。

本机安装ollama，然后拉取qwen2.5-coder；本机没有显卡的，用1.5b就可以，有显卡的用3b或者7b。

在config.yaml中配置上模型；有其他ollama服务器的也可以配置上，model那里设置成AUTODETECT，就可以把ollama已经pull到本地的模型都列出来。

```
name: Local Config
version: 1.0.0
schema: v1
models:
  - name: local
    provider: ollama
    apiBase: http://localhost:11434
    model: qwen2.5-coder:1.5b
    roles:
      - chat
      - edit
      - autocomplete
  - name: 100server
    provider: ollama
    apiBase: http://10.1.41.100:11434
    model: AUTODETECT
    roles:
      - chat
      - edit        
```
![](VSCode+Continue实现智能代码补全.md_Attachments/Pasted%20image%2020260311132919.png)
config.yaml的改动是实时刷新的，改完配置项里面已经可以选了。
代码补全的触发逻辑是代码换行或者按tab键，第一次需要加载模型，后面用起来反应就快了。
![](VSCode+Continue实现智能代码补全.md_Attachments/Pasted%20image%2020260311133522.png)