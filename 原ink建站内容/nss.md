---
title: "nss的交叉编译"
date: 2018-11-06 15:46:01 +0800
author: me
tags:
    - 技术杂记
    - 随笔
    - 试验田
preview: 折腾了不少时候，交叉编译永远是问题多多

---

​	nss是常用的网络通信加密库，因为其编译脚本用了python-gyp，而且gyp还只支持2.7，所以最后不得不找一个已经生成的Makefile，手工指定一堆参数。
```
BUILD_OPT=1 CROSS_COMPILE=arm-histbv310-linux- CC=arm-histbv310-linux-gcc INCLUDES="-I/home/lx/platform3798C/pub/hi3798cv200/rootbox/usr/include/nspr -I/home/lx/platform3798C/pub/hi3798cv200/rootbox/usr/include/" USE_SYSTEM_ZLIB=1 NSS_USE_SYSTEM_SQLITE=1 NSS_PKIX_NO_LDAP=1 NSPR_LIB_DIR=/home/lx/platform3798C/pub/hi3798cv200/rootbox/usr/lib NSS_BUILD_WITHOUT_SOFTOKEN=1 NSS_DISABLE_GTESTS=1 make
```
    修改coreconf/arch.mk，原来没考虑交叉编译的需求，因此直接用了uname，改为交叉编译时用arm架构。
```
ifdef CROSS_COMPILE
    OS_TEST := arm
else
    OS_TEST := $(shell uname -m)
endif
```
    这样make时，生成的nsinstall是arm架构了，而我们需要在host也就是x86上运行，因此需要用本机环境再编译一个nsinstall，然后copy过来，继续make。


