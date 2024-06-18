---
title: 视频效果插件Frei0r
date: 2024-05-10 16:38:26 +0800
author: wildcat
tags:
---
frei0r名字怪怪的（没错，中间那个是数字0），是一堆用C++实现的视频效果插件的合集。很多著名的开源视频软件中用到了它，比如ffmpeg，如果编译时打开了enable-frei0r，就会开启frei0r的插件支持；还有gstreamer，另外开源非编软件shortcut、kednlive、openshot等也都用了它。

简单测试了一下：

```
ffmpeg -i input.mp4  -vf "frei0r=filter_name=distort0r:filter_params=0.1|0.01" distort0r_0.1_0.01.mp4
```

![](视频效果插件Frei0r.md_Attachments/Pasted%20image%2020240510170222.png)

