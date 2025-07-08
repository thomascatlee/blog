---
title: SSH断开后继续执行任务
date: 2025-04-23 13:59:06 +0800
author: wildcat
tags:
  - Linux
  - SSH
---
有时候要下载一段时间，但是SSH断开后任务就停了，又不想中止之后用nohup重开。
这时可以通过按下 `Ctrl+Z` 来暂停它。然后，输入 `bg` 命令将暂停的任务放入后台继续运行。然后，通过 `jobs` 命令查看后台任务的编号，然后使用 `disown` 命令将其从当前会话中移除。

```
Ctrl + Z 
bg
jobs 
disown -h %jobid # 例如 disown -h %1
```

