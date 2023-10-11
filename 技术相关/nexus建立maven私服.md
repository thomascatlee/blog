---
title: nexus建立maven私服
date: 2020-08-25 19:46:43 +0800
author: me
tags:
    - 
---

nexus支持很多类的私服，包括go、pip、yum等等。maven也支持的，各种配置都大同小异。
proxy、hosted两类，proxy配置各个镜像，hosted将proxy聚到一个。
这里记录一个maven的plugin问题。

配置完maven私服后，修改了maven的配置文件`settings.xml`。重新import本地仓库，idea提示：`could not be resolved: Plugin xxx`

但是其他库import是正常的呀。

查了maven的手册，发现除了repository之外，还有个pluginRepository的设置项。照搬repository的设置，然后import就正常了。