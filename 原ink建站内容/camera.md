title: 在Ubuntu上使用摄像头
date: 2018-06-13 17:00:00 +0800
author: me
tags:
    - 技术杂记
    - 深度学习
    - 备忘
preview: OpenCV+Movidius的计算棒，可以快速的拿出demo

---

Ubuntu1604对摄像头的支持比较好了，基本上即插即用。lsusb看一下信息，没什么问题，/dev/video0也有了，可是用cheese就是提示打不开设备。用v4l2-ctl --all来看了一下摄像头的信息，被```Driver Info (not using libv4l2```这句给误导了，以为是v4l2驱动有什么问题，后来想了一下，可能是权限问题，给/dev/video0加上用户的读写权限，OK了。起一个xserver，windows下写代码，Ubuntu跑NCSDK，结果显示在windows的xserver，美滋滋~