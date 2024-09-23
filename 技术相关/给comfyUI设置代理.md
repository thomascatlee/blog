---
title: 给comfyUI设置代理
date: 2024-09-13 11:50:22 +0800
author: wildcat
tags:
---
修改启动的bat，在最前面加上：

```
set http_proxy=http://127.0.0.1:30889
set https_proxy=http://127.0.0.1:30889
```

