---
title: 
date: 2024-03-12 15:35:02 +0800
author: wildcat
tags:
---
想在windows下部署Ollama+open-webui。open-webui提供了docker镜像部署，linux下用的也正常，但是windows下部署不顺；docker的windows版本真难用，老是崩溃。
按照[文档](https://docs.openwebui.com/getting-started/)说明，本地安装node并编译了web前端，anaconda安装了FastAPI的python环境支持，启动open-webui时总是报错。提示

```
No sentence-transformers model found with name sentence-transformers/all-MiniLM-L6-v2. Creating a new one with MEAN pooling.
```
然后去连huggingface下载，显然不能如愿。但是docker镜像可以用啊，又从镜像中剥出来model文件，放到backend/data底下，但是仍然不能正常启动。只好下载了open-webui的源代码，调试了一下，发现是环境变量的锅。检查了一下docker容器中的环境变量，果然有蹊跷。照着设置一下windows下的：
```
SET HF_DATASETS_OFFLINE=1
SET TRANSFORMERS_OFFLINE=1
SET RAG_EMBEDDING_MODEL_DIR=d:\Ollama\open_webui\backend\data\cache\embedding\models
SET WHISPER_MODEL=base
SET SENTENCE_TRANSFORMERS_HOME=d:\Ollama\open_webui\backend\data\cache\embedding\models\
SET SCARF_NO_ANALYTICS=true
SET DO_NOT_TRACK=true
SET WHISPER_MODEL_DIR=d:\Ollama\open_webui\backend\data\cache\whisper\models
SET RAG_EMBEDDING_MODEL=all-MiniLM-L6-v2
SET RAG_EMBEDDING_MODEL_DEVICE_TYPE=cpu
SET PORT=8080
SET OLLAMA_BASE_URL=http://127.0.0.1:11434
SET OPENAI_API_KEY= 
SET ENV=prod
SET OPENAI_API_BASE_URL= 
```

哎，可算是正常启动了。