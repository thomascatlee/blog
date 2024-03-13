---
title: 基于webrtc的远程控制
date: 2023-09-19 16:48:52 +0800
author: me
tags:
  - go2rtc
---

# 起念
之前基于 #go2rtc 改了一个接收RTP视频流并转到webrtc/MSE的demo，还有人告诉我，用安卓盒子来做基于webrtc的远程桌面；我们自己的IP KVM硬件也弄得差不多了，硬编硬解的，能不能多做一种特性，在硬件上实现webrtc，然后用浏览器来远程控制呢？有go2rtc打底，我认为是可以的，视频走webrtc没问题，无非就是多一个datachannel返送键鼠数据。
顺带手实现一个PC上的软KVM，也是比较简单的事情了，翻了一下找到[go-vgo/robotgo: RobotGo, Go Native cross-platform GUI automation @vcaesar (github.com)](https://github.com/go-vgo/robotgo)这个，我目前只要用windows部分，其实际上是调用的WIN API SendInput（通过[lxn/win: A Windows API wrapper package for the Go Programming Language (github.com)](https://github.com/lxn/win)这个Windows api的wrapper包），web端我再客串一下JS编程，差不多齐活。

# 组合
既然PC上就是个demo性质的，那最好是有现成的改改；想什么来什么，找到[rviscarra/webrtc-remote-screen: Stream a remote desktop screen directly to your browser (github.com)](https://github.com/rviscarra/webrtc-remote-screen)这个，和go2rtc一样，webrtc部分用的也是[pion/webrtc: Pure Go implementation of the WebRTC API (github.com)](https://github.com/pion/webrtc)，还附带告诉我一个X264的go封装[gen2brain/x264-go: Go bindings for x264 (github.com)](https://github.com/gen2brain/x264-go)，收获满满。之前仅仅为了在go上跑H.264编码，我可是折腾FFMPEG去了。
网上找了[webrtc实现远程控制-前端部分 - 掘金 (juejin.cn)](https://juejin.cn/post/7208837219212296252#heading-3)这篇文章，参考实现JS部分和键鼠部分信令，鼠标部分PC 上demo和硬件上有所区别，考虑windows API的效率，我不打算把所有事件都传给PC demo了；先就传鼠标点击。
![](attachments/Pasted%20image%2020230914104707.png)
上图是参考文章中的定义，我增加了对键盘修饰键（modifier）的传递：
`msg.modifier = (e.altKey ? 8:0) + (e.metaKey ? 4:0) + (e.ctrlKey ? 2:0) + (e.shiftKey ? 1:0)`以4个比特位表示alt、cmd、ctrl和shift的状态。

# 摸索
不是专业JS工程师，很多东西都是网上边查边试，走了一些弯路。比如建立datachannel，最后发现是要在createOffer之前，否则就不成功。再比如JS对鼠标双击的处理，等等；很多东西都是探索可行性，达到demo的程度。后续还是换专业大部队来推进。

