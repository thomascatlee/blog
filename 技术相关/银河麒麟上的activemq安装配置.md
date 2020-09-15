# 银河麒麟上的activemq安装配置
银河麒麟4.0.2sp2版本和Ubuntu16.04很接近，所以也继承了1604安装完activemq不能start的问题。研究了一下，是activemq默认检查/run/activemq.pid，但是很不幸的activemq用户没有run的写权限，却有/run/activemq这个目录的权限。显然是系统整劈叉了。
修改`/usr/share/activemq/activemq-options`，增加一句`ACTIVEMQ_PIDFILE=/run/activemq/activemq.pid`。
然后`activemq start`就可以正常跑起来了。