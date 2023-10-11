---
title: docker简单操作
date: 2020-09-15 11:06:00 +0800
author: me
tags:
    - 
---

1. 安装
从[FTP](ftp://ftpuser:suma123456@172.16.60.12/docker)下载离线安装包：`docker-19.03.12_x64.tgz、docker.service、install.sh`，运行`./install.sh docker-19.03.12_x64.tgz`安装。
2. docker 命令
查看docker 命令的帮助信息

```
docker --help  #docker 全部命令帮助信息
docker COMMAND --help #docker 具体命令COMMAND的帮助信息
```
查看docker 信息

```
docker info
```
可以看到容器的池、已用数据大小、总数据大小，基本容器大小、当前运行容器数量等。

搜索镜像，从网络中搜索别人做好的容器镜像。

```
docker search ubuntu
docker search centos
```
从网络中下载别人做好的容器镜像。

```
docker pull centos
docker pull ubuntu
```

查看镜像
```
docker images
docker images -a
```

检查镜像
```
docker inspect ubuntu
```
可以看到容器镜像的基本信息。

删除镜像，通过镜像的 id 来指定删除
```
docker rmi ubuntu
```

删除全部镜像
```
docker rmi $(docker images -q)
```
显示镜像历史
```
docker history ubuntu
```

运行容器
```
docker run -itd --network host --privileged=true --name="centos7" --hostname="centos7" -v /home/lixin:/share -v /sys/fs/cgroup:/sys/fs/cgroup smsx_centos7:v1.0 /usr/sbin/init
```
参数解释：
```
-v hostdir:dstdir    将主机的hostdir目录映射到容器的dstdir目录
--network host       设置网络为直通模式，容器直接用主机的IP地址
```

输入exit退出交互，但是容器仍然在后台运行

容器运行后，进入容器内部

```
docker exec -it centos7 /bin/sh
```
把下面这段加入`.bash_profile`，以后就可以直接`entercontainer centos7`进入容器。
```
entercontainer() {
    if [ "X$1" == "X" ]; then
       echo "Usage: entercontainer <container> <user>"
       return
    elif [ "X$2" != "X" ]; then
        docker exec -u $2 -it $1 bash -c "stty cols $COLUMNS rows $LINES && bash"
    else
        docker exec -it $1 bash -c "stty cols $COLUMNS rows $LINES && bash"
    fi
}
export -f entercontainer
```


停止容器

```
docker stop centos7
```

启动容器（在第一次运行容器并停止后）

```
docker start centos7
```

删除容器

```
docker rm centos7
```
删除容器之前要先停止该容器的运行。 删除容器后，之前在容器上的改动都会失去。


查看容器运行过程中的日志
```
docker logs centos7
```

列出一个容器里面被改变的文件或者目录，列表会显示出三种事件，`A 增加的；D 删除的；C 被改变的`
```
docker diff centos7
```
和初始容器镜像项目对比，用户或系统增加/删除/修改了那些目录文件，都可以查看到。

查看容器里正在运行的进程
```
docker top centos7
```

拷贝容器里的文件/目录到本地服务器
```
docker cp centos7:/etc/passwd /tmp/
```

保存容器修改，提交一个新的容器镜像
```
docker commit centos7 smsx_centos7:v1.0
```

导出镜像到文件
```
docker save smsx_centos7:v1.0 > smsx_centos7_1.0.tar
```

导入容器镜像文件
```
docker load < smsx_centos7_1.0.tar
```