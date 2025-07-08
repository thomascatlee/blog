---
title: Nuttx在ESP32S3的启动流程
date: 2024-12-12 16:05:37 +0800
author: wildcat
tags:
  - Nuttx
  - 嵌入式
  - esp32S3
---
```mermaid
flowchart LR
A("__start")-->B("__esp32s3_start")-->C("nx_start")
```

```mermaid

flowchart TB
C("nx_start")-->D("tasklist_initialize")-->E("idle_task_initialize")-->F("drivers_early_initialize")-->G("nxsem_initialize")

```

