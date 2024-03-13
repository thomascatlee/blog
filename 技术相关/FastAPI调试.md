---
title: FastAPI调试
date: 2024-03-13 13:42:17 +0800
author: wildcat
tags:
---
命令行运行uvicorn时，没法debug；修改main.py，增加一段

```
if __name__ == "__main__":  
    import uvicorn  
    uvicorn.run(app, host="0.0.0.0", port=8080)
```
这样就能直接运行main.py进行调试了。
