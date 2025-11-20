---
title: 麒麟v10的gcc
date: 2025-08-13 14:03:38 +0800
author: wildcat
tags:
  - Linux
  - 国产化
  - GCC
---
麒麟V10SP3的GCC版本也未免太古典了，编个dynolog都费劲；从10.0的源上找到了devtoolset-9，一通安装后，编译倒在了成功的门口：

```
hidden symbol `_ZNSt10filesystem9_Dir_base7advanceEbRSt10error_code' isn't defined
```
搜了一下似乎是devtoolset-9的bug，老外说你切了吧，切到10就好了，然后`I am closing this ticket as "won't fix".`
听人劝吃饱饭，继续寻找怎么在这个麒麟上装GCC10吧。
又有人说，Kylin Linux V10 SP3 支持 CentoOS 8 的 rpm 文件包，因此可以通过引入 CentOS-Base.repo来安装gcc-toolset-10
```
wget -O /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-8.repo
sed -i 's/$releasever/8/g' /etc/yum.repos.d/CentOS-Base.repo
```
看了一下，有11呢，那谁还装10。`yum install gcc-toolset-11-gcc-c++`安装上，`source /opt/rh/gcc-toolset-11/enable`切换到11，然后就可以顺利的编译啦。

