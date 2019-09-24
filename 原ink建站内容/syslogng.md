title: "syslog-ng的坑"
date: 2018-09-25 17:59:55 +0800
author: me
tags:
    - 技术杂记
    - 随笔
    - 试验田
preview: Ubuntu1604实在是有点old。

---

​	想把netdata的数据导入ELK，试了一下，logstash的CPU占用率莫名的高，于是打算把syslog-ng拿来替换logstash。
    Ubuntu原装的syslog-ng是3.5版本，有点点老，新的版本对Elasticsearch有更好的支持，于是从[git](https://github.com/balabit/syslog-ng)上下载了源代码，make安装之后，syslog-ng -Fed，提示有一堆错误，大致是jvm找不到，jsonc找不到等等。jvm的问题是LD_LIBRARY_PATH里面没有jvm的so，设置一下就好了。（找路径找半天，最后烦了用命令find /usr/lib -name libjvm.so）
    jsonc的问题是编译时没仔细看提示，用的internal的jsonc，但是源代码里没有，导致jsonc模块就没有编译成功。./configure --with-jsonc=system 指定用系统的，就好了。
