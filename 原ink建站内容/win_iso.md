---
title: "记录win server2012 mount iso的问题"
date: 2017-11-22 17:30:00 +0800
author: me
tags:
    - 技术杂记
    - 随笔
    - 试验田
preview: 奇怪的问题，折腾好久。

---

微软在win8之后，就支持了iso文件的加载，没有特别复杂的需求，就可以不用deamon、酒精等软件了。

作为win8的变种，server2012同样也支持右键加载iso。但我突然发现，手上的这个系统右键没有加载选项。

用管理员帐号，可以右键；再换回来，不行。总不能每次都切换帐号吧，好麻烦。

用power cmd，输入Mount-DiskImage -Verbose -StorageType "ISO"  -ImagePath %1，可以加载，但懒人还是觉得不爽。

在网上翻腾好久，看到一个兄弟，[装完Vmware出现了同样的问题](https://social.technet.microsoft.com/Forums/ie/en-US/d4b171ba-f6d6-4199-a93b-3dca4b4d5a14/cannot-mount-iso-file-in-windows-server-2012?forum=winserver8gen)，试一下他的解决方案，把iso关联到explorer，右键又可以加载喽。