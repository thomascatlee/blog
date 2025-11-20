---
title: Edge的麦克风访问
date: 2025-09-10 13:50:37 +0800
author: wildcat
tags:
  - Edge
  - 权限
  - http
---
自己部署的一个web，用Edge访问始终显示没有麦克风权限，原因是Edge要求非 https 安全网址无法直接通过浏览器获取电脑硬件的访问权限，如麦克风、摄像头等；需要手动将对应网址设置为安全的域名网址：
1. 在浏览器地址栏输入：edge://flags/#unsafely-treat-insecure-origin-as-secure
2. 将右侧 已禁用 状态改成 已启用。
3. 在 Insecure origins treated as secure 输入栏中输入需要获取麦克风权限的白名单网址，点击按钮重启浏览器。