---
title: 设置CGO以脱离系统glibc限制
date: 2024-12-13 11:33:43 +0800
author: wildcat
tags:
  - Go
  - glibc
---
Go的卖点就是不依赖系统库，但我们会发现，自己用Go编译出来的程序仍然对glibc有依赖。
但是docker这类程序就可以做到呢，how to？

```bash
CGO_ENABLED=0 go build main.go
```
这样就可以不用glibc了。相应的，对C库的调用也就废了。
如果是编译时指定某个版本的glibc呢？也可以在Go编译时指定
```bash
Dynamic:

CGO_LDFLAGS="-Xlinker -rpath=/path/to/another_glibc/lib" go build main.go

Static:

CGO_LDFLAGS="-Xlinker -rpath=/path/to/another_glibc/lib -static" go build main.go
```


