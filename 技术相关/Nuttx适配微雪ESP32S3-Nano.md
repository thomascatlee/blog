---
title: Nuttx适配微雪ESP32S3-Nano
date: 2024-11-28 16:39:45 +0800
author: wildcat
tags:
  - Nuttx
  - 操作系统
  - 嵌入式
  - ESP32
---
Nuttx是一个嵌入式实时操作系统，号称是比RT Thread对POSIX的兼容性更好，移植一些Linux的程序更容易；看了一下Nuttx已经自带了不少ARCH的支持，包括ESP32，那么就来玩一下试试。
直接用的ESP32S3-devkit的配置，编译nsh，成功烧写到Nano，然后重启，串口没显示呢？哦，Nano是用的ESP32S3自带的CDC-ACM 的虚拟串口，通过USB Type-C连出来，直接上电脑免驱，而devkit是有专门的串口（走的usb micro连接器，如图）
![ESP32S3-devkit](Nuttx适配微雪ESP32S3-Nano.md_Attachments/Pasted%20image%2020241205181023.png)

![ESP32S3-Nano](Nuttx适配微雪ESP32S3-Nano.md_Attachments/Pasted%20image%2020241205181114.png)
如果要用Nano的串口，还得自己找个串口转USB的芯片，再接到电脑上；曾经我也是有PL2303这种东西的，然而现在一时半会找不到；只能让Nuttx用CDC-ACM做console。

![](Nuttx适配微雪ESP32S3-Nano.md_Attachments/Pasted%20image%2020241210173746.png)
![](Nuttx适配微雪ESP32S3-Nano.md_Attachments/Pasted%20image%2020241211150152.png)
menuconfig里开启USB otg支持，然后USB device control会关联打开，去USB Device里面把CDC相关的一堆都打开，

![](Nuttx适配微雪ESP32S3-Nano.md_Attachments/Pasted%20image%2020241205181951.png)
![](Nuttx适配微雪ESP32S3-Nano.md_Attachments/Pasted%20image%2020241206121050.png)然后把Serial Console关掉，编译烧写就好了。
因为在代码里，打开CDC之后，就会注册console，这样nsh就能从console输出了。
![](Nuttx适配微雪ESP32S3-Nano.md_Attachments/Pasted%20image%2020241206101848.png)

USB连到电脑，打开串口，敲三下回车，就能看到nsh的输出了。
![](Nuttx适配微雪ESP32S3-Nano.md_Attachments/Pasted%20image%2020241206112245.png)

其实nuttx直接有usbnsh的支持，configure的时候，直接用`esp32s3-devkit:usbnsh`这个配置项就行。
另外，`CONFIG_ESP32S3_USBSERIAL`，即USB-Serial Driver这项不能配置，如果配置了，编译出来的nuttx在Nano上，会没有USB，即插在电脑上都不识别USB设备。
具体原因我没看出来，但猜是USB-OTG和USB-JTAG共用ESP32S3的内部USB收发器时的问题。或者nuttx就应该在menuconfig时做成互斥项？