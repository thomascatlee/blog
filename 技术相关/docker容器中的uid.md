---
title: docker容器中的uid
date: 2024-11-12 15:48:50 +0800
author: wildcat
tags:
  - docker
---
docker容器运行时，user的uid有几个地方可以设置
Dockerfile中用USER指令设置
docker run时用-u uid:gid设置
后者会覆盖前者
这个uid、gid就是host所看到的，容器访问host资源时的uid、gid，因此容器如果要写host文件，需要保证容器uid、gid具有相应的权限。

