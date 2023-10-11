---
title: nginx的403问题
date: 2020-09-15 11:06:00 +0800
author: me
tags:
    - 
---

centos上安装完nginx后，设置完root，重启服务后，发现访问出现403错误，查看`/var/log/nginx/error.log`，提示
```
"/opt/kylin/archive.kylinos.cn/kylin/KYLIN-ALL/index.html" is forbidden (13: Permission denied)
```
原来是SELinux的问题，简单的办法是关闭SELinux，但是会带来安全方面的问题。
查看一下原来nginx自带的文件：
```
ls -Z /usr/share/nginx/
drwxr-xr-x. root root system_u:object_r:httpd_sys_content_t:s0 html
drwxr-xr-x. root root system_u:object_r:usr_t:s0       modules
```
照着改一下
```
chcon -Rv -u system_u -t httpd_sys_content_t /opt/kylin/archive.kylinos.cn/
```
然后就没有403啦~