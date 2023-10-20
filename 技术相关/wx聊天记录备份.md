---
title: wx聊天记录备份建立npm私服
date: 2023-09-26 13:19:52 +0800
author: me
tags:
    - 
---
安卓手机中，微信数据库保存在形如`/data/data/com.tencent.mm/MicroMsg/8f935025e0da76b17716d57582a6a9fe`这样的目录中，其中EnMicroMsg.db是聊天记录。要访问到这些文件，手机需要root后，用RootExplorer这样的软件，或者用adb连接手机后，以su得到root权限后，用push的方法拿到PC上。
除了聊天记录数据库，还有图片，语音等，也都在不同的目录：

image2 文件夹里面存放着所有的微信聊天图片，位置在：
```
/data/data/com.tencent.mm/MicroMsg/8f935025e0da76b17716d57582a6a9fe/image2
```


avatar 文件夹里面存放着所有的微信头像，位置在：
```
/data/data/com.tencent.mm/MicroMsg/8f935025e0da76b17716d57582a6a9fe/avatar
```


WxFileIndex.db是微信的聊天发送的文件索引数据库文件，位置在：
```
/data/data/com.tencent.mm/MicroMsg/8f935025e0da76b17716d57582a6a9fe/WxFileIndex.db
```


voice2 文件夹里面存放着所有的微信语音，位置在：
```
/sdcard/Android/data/com.tencent.mm/MicroMsg/8f935025e0da76b17716d57582a6a9fe/voice2
```


video 文件夹里面存放着所有的微信视频，位置在：
```
/sdcard/Android/data/com.tencent.mm/MicroMsg/8f935025e0da76b17716d57582a6a9fe/video

```

Download 文件夹里面存放微信的聊天发送的文件，位置在：
```
/sdcard/Android/data/com.tencent.mm/MicroMsg/Download
```


