---
title: boost在arm上的编译
date: 2018-07-24 17:00:00 +0800
author: me
tags:
    - 技术杂记
    - 交叉编译
    - 备忘
preview: boost python有一点点波折

---

为了CEPH折腾半天，需要用到boost，正好海思上还没有，编译了一下。

运行bootstarp之后，修改project-config.jam里面有关gcc的部分：

``` 
using gcc : arm : arm-histbv310-linux-gcc ;
```

然后就可以编译。

为了方便最后整理，设置了安装路径：

```
option.set prefix : /home/lx/platform3798C/pub/hi3798cv200/rootbox/usr ;
option.set exec-prefix : /home/lx/platform3798C/pub/hi3798cv200/rootbox/usr ;
option.set libdir : /home/lx/platform3798C/pub/hi3798cv200/rootbox/usr/lib ;
option.set includedir : /home/lx/platform3798C/pub/hi3798cv200/rootbox/usr/include ;
```

然后执行：


```
./b2 --without-context --without-coroutine --without-thread --without-log --without-test --without-atomic --without-chrono --without-filesystem --without-graph --without-graph_parallel --without-math --without-python --without-random --without-signals --without-wave --without-timer --without-mpi --without-program_options --without-container --without-iostreams --without-locale include=/home/lx/platform3798C/pub/hi3798cv200/rootbox/usr/include toolset=gcc-arm link=shared 
```

生成boost库。

之后ceph编译时，提示还需要一些boost库，修改为：

```
./b2 --without-context --without-coroutine --without-thread --without-log --without-test --without-atomic --without-chrono --without-graph --without-graph_parallel --without-math --without-signals --without-wave --without-timer --without-mpi --without-container --without-locale include=/home/lx/platform3798C/pub/hi3798cv200/rootbox/usr/include toolset=gcc-arm install --debug-configuration
```

但是这样python模块始终编译不成功。折腾了两天，最后突然想到，之前交叉编译python时候的问题：编译arm-python时，需要用到本机的python。而现在提示一直是在用本机的python头文件所以有问题，那是不是boost编译时侯可以指定用哪个python？查了一下果然，修改project-config.jam：

```
using python : 3.5 : /usr/bin/python : /home/lx/platform3798C/pub/hi3798cv200/rootbox/usr/include/python3.5m : /home/lx/platform3798C/pub/hi3798cv200/rootbox/usr/lib/python3.5 ;
```

这里三个:分别区分开本机的python，头文件以及库文件。

这样boost库就编译好了。







