---
title: SELinux导致的ssh免密登陆失败
date: 2021-11-14 17:53:03 +0800
author: me
tags:
    - 
---

新装的一台Centos7.4，配置ssh免密登陆不成功，已经确认了文件读写权限等问题，修改了sshd_config，并且同样的配置在ubuntu上一切正常。
打开sshd的调试信息：
```
SyslogFacility AUTH
Loglevel DEBUG
```
再试一下，然后`tail -l /var/log/message`
打印了一堆`SELinux is preventing /usr/sbin/sshd from read access on the file authorized_keys`等等，显然是权限问题了。
`ls -laZ .ssh `看一下，果然，没有`ssh_home_`t权限。
`restorecon -r -vv .ssh`重置一下权限。
现在ssh免密就正常了。

Centos的安全比较强，除了读写执行外，还有另外的安全权限；记得原来在Centos上折腾apache，也是有类似的权限问题。