---
title: ollama模型的下载等
date: 2026-02-28 16:34:18 +0800
author: wildcat
tags:
  - ollama
  - huggerface
  - deepseek
  - qwen
---
ollama吃启动时环境中的HTTPS_PROXY设置，所以对windows下，命令行窗口手工设置代理再启动是比较合适的，ollama的自动更新也能正常运作。对Linux，如果是service形式的，那还要修改服务的设置，在`Environment=`中设置代理；docker的话则是设置docker环境变量，重新生成容器。（如果有dpanel之类的可视的docker工具，那就太方便啦）。
国内的环境现在可以直接下ollama本身的模型，hf的模型能下载大文件，却总是卡在最后的小文件；所以强烈建议直接下载GGUF之后，写modelfile导入；这样做本地部署也更方便。有人做了ollama的[本地模型缓存](https://wiki.wbuntu.com/explore/6-ollama-model-cache/)，也是一种方式。
hf-mirror.com不知道啥情况，最后的小文件下载时卡在tls上。
