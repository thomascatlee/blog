---
title: 增大swap空间
date: 2021-03-23 14:28:41 +0800
author: me
tags:
    - 
---

Linux下编译QTwebengine，编译失败，提示`virtual memory exhausted： Cannot allocate memory`，额滴神，这可是32G物理内存的机器。
没办法，增加swap的空间吧。
首先创建swap分区的文件
```
dd if=/dev/zero of=/var/swap/swapfile bs=1M count=102400
```
其中bs是每块的大小，count是块的数量；bs*count，就是swap文件的大小：这里1M*102400=100G。可以根据需要自行调整。

此外，swapfile是swap文件的路径，可以根据需求修改。

格式化交换分区文件
```
mkswap /var/swap/swapfile
```
启用swap分区文件
```
swapon /var/swap/swapfile
```

添加开机启动
修改/etc/fstab这个文件，添加或者修改这一行：
```
/var/swap/swapfile swap swap defaults 0 0
```
如果不修改开机启动配置，重启之后的swap空间会重置，之前配置丢失