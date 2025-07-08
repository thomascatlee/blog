---
title: dpanel的使用
date: 2025-02-27 15:00:30 +0800
author: wildcat
tags:
  - docker
  - UI
---
在只有docker，不用k8s的情况下，想有个图形界面能少敲点命令行，看日志等操作方便，找了几个，发现 [**DPanel** 可视化 Docker 管理面板](https://dpanel.cc/)用起来比较得劲。
部署也很方便：
```
docker run -d --name dpanel --restart=always \
 -p 8807:8080 -e APP_NAME=dpanel \
 -v /var/run/docker.sock:/var/run/docker.sock \
 -v dpanel:/dpanel dpanel/dpanel:lite
```
然后浏览器访问8807端口就能看到界面了。
目前的dpanle对docker命令行的部分参数不支持，比如`-gpu`，因此用dpanel创建带有这类参数选项的容器时，会找不到设置的地方；或者用命令行创建容器后，在更新容器时，会丢失掉之前创建时由命令行输入的这部分参数。
因此对这类应用，更新镜像可以用dpanel，启动新容器还是需要用命令行方式。
同样的，dpanel自身的更新，可以用dpanel更新镜像，启动新容器还是需要用命令行方式。

