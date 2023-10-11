---
title: Movidius的计算棒
date: 2018-06-12 17:00:00 +0800
author: me
tags:
    - 技术杂记
    - 深度学习
    - 试验田
preview: Intel大举推进人工智能解决方案，CPU、GPU、FPGA、VPU一体搞定。大腿要选粗的。

---

一直对Movidius念念不忘，上次和Intel交流后，得知2018Q3-Q4 MyriadX才能正式出来。在此之前还是先玩玩2代吧。

NCS的SDK装了半天，主要是我机器上环境太杂，为了跑各种框架，装了anaconda，暂时屏蔽后，基本可以一键安装。哦，对了，手工改一下install.sh和install-utils.sh，把python2的部分都注释掉。另外还有pygraphviz的问题，直接pip的wheel包应该是和ubuntu1604的库文件不兼容，用源码安装就ok了。

目前暂时先用NCS的API，OpenVino看着应该也能支持2代，那就方便了。