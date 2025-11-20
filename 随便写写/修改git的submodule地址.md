---
title: 修改git的submodule地址
date: 2025-09-10 10:31:19 +0800
author: wildcat
tags:
  - git
  - submodule
---

1. 修改 `.gitmodules` 文件中对应模块的url属性;
2. 使用 `git submodule sync` 命令，将新的URL更新到文件.git/config；
3. 再使用命令初始化子模块：`git submodule init`
4. 最后使用命令更新子模块：`git submodule update`