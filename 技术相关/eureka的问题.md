---
title: eureka的问题
date: 2020-09-15 11:06:00 +0800
author: me
tags:
    - 
---

eureka启动后，client有一段时间无法连接
尝试修改eureka.server.peerNodeConnectTimeoutMs: 30000 eureka.server.peerNodeReadTimeoutMs: 30000，包括修改client的超时参数，但是都不成功。

分析日志，发现有如下记录：
```
2020-09-01 13:58:00.800 [localhost-startStop-1] WARN  org.apache.catalina.util.SessionIdGeneratorBase - Creation of SecureRandom instance for session ID generation using [SHA1PRNG] took [654,564] milliseconds.
2020-09-01 14:52:39.168 [localhost-startStop-1] WARN  org.apache.catalina.util.SessionIdGeneratorBase - Creation of SecureRandom instance for session ID generation using [SHA1PRNG] took [1,403,673] milliseconds.
2020-09-01 16:00:36.174 [localhost-startStop-1] WARN  org.apache.catalina.util.SessionIdGeneratorBase - Creation of SecureRandom instance for session ID generation using [SHA1PRNG] took [1,189,377] milliseconds.
```

和重启后无法连接的时间能对上，1189377ms换算过来也差不多20分钟，和现象比较一致。

上网搜了一下，这是个tomcat的著名问题，官方给的修改办法是在JVM参数中加一句
```
-Djava.security.egd=file:/dev/./urandom
```
试了一下，果然好了。

详细的问题解释在[这里](https://www.jianshu.com/p/c690e791c408)