---
title: esp-fc在pyDrone上的移植和适配
date: 2024-06-21 11:29:43 +0800
author: wildcat
tags:
  - Drone
  - ESP32
  - 飞控
  - betaflight
---
[esp-fc](https://github.com/rtlopez/esp-fc.git)是某个大牛做的基于ESP单片机的飞控程序，支持ESP32, ESP8266, ESP32-S3, ESP32-S2, ESP32-C3等多种芯片，并且支持Betaflight的配置。
移植esp-fc到pyDrone上，工作量不大，只要让esp-fc增加对QMC5883L和SPL06的支持就行。
代码在我的github上，[pyDrone分支](https://github.com/thomascatlee/esp-fc/tree/pyDrone)。
代码编译需要IDF和PlatformIO的支持，用VSCode把PlatformIO的插件装上，编译下载就可以都用VSCode完成。
如何做源代码级的Debug，我还没搞明白，不过esp-fc的代码比较清晰，鼓捣鼓捣就可以连上Betaflight，看到各传感器，并控制Motor了。
几点说一下：分支上的代码是QMC5883L和SPL06都是Slave的，但是esp-fc代码没做相应支持，大牛的代码不能随便动。那就简单bypass一下，让这两颗传感器都还是通过MPU6050的I2C总线访问。如图，GyroMPU6050.h中begin函数，把原来的true改成false就好。
![](esp-fc在pyDrone上的移植和适配.md_Attachments/Pasted%20image%2020240626173642.png)

![](esp-fc在pyDrone上的移植和适配.md_Attachments/Pasted%20image%2020240621112947.png)

![](esp-fc在pyDrone上的移植和适配.md_Attachments/Pasted%20image%2020240621113028.png)