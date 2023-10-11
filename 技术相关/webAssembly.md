---
title: webAssembly
date: 2021-03-23 14:32:28 +0800
author: me
tags:
    - 
---
## 编译 Emscripten
git clone https://github.com/juj/emsdk.git
cd emsdk
emsdk install latest
emsdk activate latest
目前最新版本是2.0.12，有些时候存在兼容问题，可以用1.38.45这个版本：
emsdk install 1.38.45
emsdk activate 1.38.45

