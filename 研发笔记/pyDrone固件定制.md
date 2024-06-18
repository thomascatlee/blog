---
title: pyDrone固件定制
date: 2024-06-18 10:35:25 +0800
author: wildcat
tags:
  - Drone
  - feikong
---
pyDrone是01Studio开源的四轴飞行器，基于esp-drone修改得来，增加了MicroPython的支持，在Python层面实现了pyDrone的飞行控制，包括wifi和蓝牙通信等。但是要进一步修改如PID等飞控的细节，就还需要在C语言层面进行，修改在MicroPython之下的部分。
从01studio的github下载到对应的[Micropython](https://github.com/01studio-lab/micropython.git)，修改ports/esp32/py-drone目录下的文件，主要是utils目录，飞控的核心功能在这里；如果要新增或修改硬件，则修改drivers目录下；如果要新增对Micropython的支持，则是在mpmodules目录下新增mod，然后重新编译。
按照[Windows下ESP32S3的MicroPython编译](Windows下ESP32S3的MicroPython编译.md)中的说明，可以编译出bin文件，可以用Espressif提供的flash_download_tool来烧写，或者用idf烧写。
要注意的是，编译生成的firmware.bin是包括了bootloader、分区表和app的完整固件，烧写时从0地址开始。如果是分开烧写，则要从bootloader目录和partition_table目录里找到bootloader.bin和partition_table.bin，app则用Mircopython.bin。


