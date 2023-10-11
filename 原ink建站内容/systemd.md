---
title: "记录systemd的使用"
date: 2017-11-24 14:30:00 +0800
author: me
tags:
    - 技术杂记
    - 随笔
    - 试验田
preview: linux下自启动服务，除了init.d，也有采用systemd方式。

---

service的描述脚本在/lib/systemd/system目录下。

启动/停止/重启：systemctl start/stop/restart service_name

随系统启动：systemctl enable service_name，实质上就是在/etc/systemd/system下面建立符号链接。相应的，停止自启动，就是disabled。

详细的systemd说明在[这里。](http://www.jinbuguo.com/systemd/systemd.service.html)