---
title: wx聊天记录备份建立npm私服
date: 2023-09-26 13:19:52 +0800
author: me
tags:
    - 
---
安卓手机中，微信数据库保存在形如/data/data/com.tencent.mm/MicroMsg/8f935025e0da76b17716d57582a6a9ef这样的目录中，其中EnMicroMsg.db是聊天记录。要访问到这些文件，手机需要root后，用RootExplorer这样的软件，或者用adb连接手机后，以su得到root权限后，用push的方法拿到PC上。