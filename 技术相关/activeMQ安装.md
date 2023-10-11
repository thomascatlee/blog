---
title: activeMQ安装
date: 2020-06-29 18:08:05 +0800
author: me
tags:
    - 
---

activeMQ安装后，启动显示start，但是进程消失。看log目录下，还没有生成日志。
用activemq console，打印显示：
```
INFO: Loading '/usr/share/activemq/activemq-options'
INFO: Using java '/usr/bin/java'
INFO: Starting in foreground, this is just for debugging purposes (stop process by pressing CTRL+C)
INFO: Creating pidfile /run/activemq.pid
INFO: changing to user 'activemq' to invoke java
Java Runtime: Private Build 1.8.0_222 /usr/lib/jvm/java-8-openjdk-arm64/jre
  Heap sizes: current=502784k  free=500152k  max=502784k
    JVM args: -Xms512M -Xmx512M -Dorg.apache.activemq.UseDedicatedTaskRunner=true -Djava.awt.headless=true -Djava.io.tmpdir=/var/lib/activemq/tmp -Dactivemq.classpath=/var/lib/activemq/conf:/var/lib/activemq/../lib/: -Dactivemq.home=/usr/share/activemq -Dactivemq.base=/var/lib/activemq/ -Dactivemq.conf=/var/lib/activemq/conf -Dactivemq.data=/var/lib/activemq/data
Extensions classpath:
  [/var/lib/activemq/lib,/usr/share/activemq/lib,/var/lib/activemq/lib/camel,/var/lib/activemq/lib/optional,/var/lib/activemq/lib/web,/var/lib/activemq/lib/extra,/usr/share/activemq/lib/camel,/usr/share/activemq/lib/optional,/usr/share/activemq/lib/web,/usr/share/activemq/lib/extra]
ACTIVEMQ_HOME: /usr/share/activemq
ACTIVEMQ_BASE: /var/lib/activemq
ACTIVEMQ_CONF: /var/lib/activemq/conf
ACTIVEMQ_DATA: /var/lib/activemq/data
Failed to instantiate SLF4J LoggerFactory
Reported exception:
java.lang.NoClassDefFoundError: org/apache/log4j/Level
        at org.slf4j.LoggerFactory.bind(LoggerFactory.java:142)
        at org.slf4j.LoggerFactory.performInitialization(LoggerFactory.java:121)
        at org.slf4j.LoggerFactory.getILoggerFactory(LoggerFactory.java:344)
        at org.slf4j.LoggerFactory.getLogger(LoggerFactory.java:294)
        at org.slf4j.LoggerFactory.getLogger(LoggerFactory.java:315)
        at org.apache.activemq.console.command.ProducerCommand.<clinit>(ProducerCommand.java:31)
        at sun.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)
        at sun.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:62)
        at sun.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45)
        at java.lang.reflect.Constructor.newInstance(Constructor.java:423)
        at java.lang.Class.newInstance(Class.java:442)
        at java.util.ServiceLoader$LazyIterator.nextService(ServiceLoader.java:380)
        at java.util.ServiceLoader$LazyIterator.next(ServiceLoader.java:404)
        at java.util.ServiceLoader$1.next(ServiceLoader.java:480)
        at org.apache.activemq.console.command.ShellCommand.getCommands(ShellCommand.java:170)
        at org.apache.activemq.console.command.ShellCommand.<init>(ShellCommand.java:43)
        at org.apache.activemq.console.command.ShellCommand.<init>(ShellCommand.java:32)
        at sun.reflect.NativeConstructorAccessorImpl.newInstance0(Native Method)
        at sun.reflect.NativeConstructorAccessorImpl.newInstance(NativeConstructorAccessorImpl.java:62)
        at sun.reflect.DelegatingConstructorAccessorImpl.newInstance(DelegatingConstructorAccessorImpl.java:45)
        at java.lang.reflect.Constructor.newInstance(Constructor.java:423)
        at java.lang.Class.newInstance(Class.java:442)
        at org.apache.activemq.console.Main.runTaskClass(Main.java:262)
        at org.apache.activemq.console.Main.main(Main.java:115)
Caused by: java.lang.ClassNotFoundException: org.apache.log4j.Level
        at java.net.URLClassLoader.findClass(URLClassLoader.java:382)
        at java.lang.ClassLoader.loadClass(ClassLoader.java:424)
        at java.lang.ClassLoader.loadClass(ClassLoader.java:357)
        ... 24 more
```
似乎是log4j的问题，看/usr/share/activemq/lib/optional，缺少log4j1.2.jar；apt install log4j1.2解决问题。
继续activemq console
```
INFO: Loading '/usr/share/activemq/activemq-options'
INFO: Using java '/usr/bin/java'
INFO: Starting in foreground, this is just for debugging purposes (stop process by pressing CTRL+C)
INFO: Creating pidfile /run/activemq.pid
INFO: changing to user 'activemq' to invoke java
Java Runtime: Private Build 1.8.0_222 /usr/lib/jvm/java-8-openjdk-arm64/jre
  Heap sizes: current=502784k  free=500152k  max=502784k
    JVM args: -Xms512M -Xmx512M -Dorg.apache.activemq.UseDedicatedTaskRunner=true -Djava.awt.headless=true -Djava.io.tmpdir=/var/lib/activemq/tmp -Dactivemq.classpath=/var/lib/activemq/conf:/var/lib/activemq/../lib/: -Dactivemq.home=/usr/share/activemq -Dactivemq.base=/var/lib/activemq/ -Dactivemq.conf=/var/lib/activemq/conf -Dactivemq.data=/var/lib/activemq/data
Extensions classpath:
  [/var/lib/activemq/lib,/usr/share/activemq/lib,/var/lib/activemq/lib/camel,/var/lib/activemq/lib/optional,/var/lib/activemq/lib/web,/var/lib/activemq/lib/extra,/usr/share/activemq/lib/camel,/usr/share/activemq/lib/optional,/usr/share/activemq/lib/web,/usr/share/activemq/lib/extra]
ACTIVEMQ_HOME: /usr/share/activemq
ACTIVEMQ_BASE: /var/lib/activemq
ACTIVEMQ_CONF: /var/lib/activemq/conf
ACTIVEMQ_DATA: /var/lib/activemq/data
Loading message broker from: xbean:activemq.xml
log4j:WARN No appenders could be found for logger (org.apache.activemq.xbean.XBeanBrokerFactory).
log4j:WARN Please initialize the log4j system properly.
log4j:WARN See http://logging.apache.org/log4j/1.2/faq.html#noconfig for more info.
ERROR: java.lang.RuntimeException: Failed to execute start task. Reason: org.springframework.beans.factory.BeanDefinitionStoreException: IOException parsing XML document from class path resource [activemq.xml]; nested exception is java.io.FileNotFoundException: class path resource [activemq.xml] cannot be opened because it does not exist
java.lang.RuntimeException: Failed to execute start task. Reason: org.springframework.beans.factory.BeanDefinitionStoreException: IOException parsing XML document from class path resource [activemq.xml]; nested exception is java.io.FileNotFoundException: class path resource [activemq.xml] cannot be opened because it does not exist
        at org.apache.activemq.console.command.StartCommand.runTask(StartCommand.java:91)
        at org.apache.activemq.console.command.AbstractCommand.execute(AbstractCommand.java:63)
        at org.apache.activemq.console.command.ShellCommand.runTask(ShellCommand.java:154)
        at org.apache.activemq.console.command.AbstractCommand.execute(AbstractCommand.java:63)
        at org.apache.activemq.console.command.ShellCommand.main(ShellCommand.java:104)
        at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
        at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
        at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
        at java.lang.reflect.Method.invoke(Method.java:498)
        at org.apache.activemq.console.Main.runTaskClass(Main.java:262)
        at org.apache.activemq.console.Main.main(Main.java:115)
Caused by: org.springframework.beans.factory.BeanDefinitionStoreException: IOException parsing XML document from class path resource [activemq.xml]; nested exception is java.io.FileNotFoundException: class path resource [activemq.xml] cannot be opened because it does not exist
        at org.springframework.beans.factory.xml.XmlBeanDefinitionReader.loadBeanDefinitions(XmlBeanDefinitionReader.java:343)
        at org.springframework.beans.factory.xml.XmlBeanDefinitionReader.loadBeanDefinitions(XmlBeanDefinitionReader.java:303)
```
提示缺少配置文件呢，
```
sudo su -
su activemq
mkdir /var/lib/activemq/conf
ln -s /etc/activemq/instances-available/main/activemq.xml /var/lib/activemq/conf/
```
OK，可以跑起来了。