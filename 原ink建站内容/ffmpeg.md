---
title: "FFMPEG的一个实用命令"
date: 2017-12-14 19:30:00 +0800
author: me
tags:
    - 技术杂记
    - 随笔
    - 试验田
preview: FFMPEG用的比较少，都是自己写代码实现功能；现在看FFMPEG也不错，做验证之类的很方便。

---

## FFMPEG发送媒体流

FFMPEG可以读取H.264码流文件，并用RTP报文的形式发送出来。

ffmpeg -re -i test.264 -vcodec cpoy -f rtp rtp://192.168.1.111>test.sdp

-re表示按帧率发送，不加的话ff会能发多快发多快。

-vcodec是指明编码codec，这里用copy表示不编码。

接收端用test.sdp，就可以接收码流。

ffplay -protocol_whitelist "file,rtp,udp" test.sdp

这里要用-protocol_whitelist "file,rtp,udp" 来指明rtp由udp承载；否则新版的FFMPEG会报错。