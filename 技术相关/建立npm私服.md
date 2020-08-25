# 建立npm私服
采用[Nexus](https://help.sonatype.com/repomanager3/download/download-archives---repository-manager-3)作为私服搭建工具。

按照操作系统版本，下载对应Nexus。我的是Linux，下载unix版本的gz，解压后，直接运行`bin/nexus run`，Nexus就跑起来了。

admin登陆后，点击齿轮进入管理页面。
![](_v_images/20200813164022904_24129.png =1024x)

新建repository，把三个npm相关的都建立起来。npm-proxy的远程仓库地址写`https://registry.npmjs.org`，把npm-group的仓库地址copy出来。

然后去设置npm：`npm config set registry http://xxxxxxx(npm-group的仓库地址)`

设置完成，试一下：`npm install jquery`，可以正常安装，并且npm私有仓库里也有东西了。
![](_v_images/20200813164553340_4162.png =1024x)