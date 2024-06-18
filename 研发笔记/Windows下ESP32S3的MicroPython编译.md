---
title: Windows下ESP32S3的MicroPython编译
date: 2024-05-24 16:55:00 +0800
author: wildcat
tags:
  - ESP32
  - 单片机
  - Python
  - 无人机
  - Windows
---
首先安装IDF一套，从espressif的官网上找一下。因为MicroPython用的1.18，新的IDF5.2有一些问题，所以我用的4.4.7版本。

编译时报错，提示gbk什么的，是windows下的专有毛病，修改`D:\Espressif\frameworks\esp-idf-v4.4.7\tools\kconfig_new\confgen.py`，把文件open操作都加上`encoding="utf-8"`

继续编译，到生成QSTR的时候又报错

```
[1175/1403] Generating ../../genhdr/qstr.i.last
FAILED: genhdr/qstr.i.last D:/work/hardware/micropython/ports/esp32/build-GENERIC/genhdr/qstr.i.last
esp-idf\main\CMakeFiles\qstr.i.last-417609e.bat feeaca277381e504
系统无法执行指定的程序。
Batch file failed at line 3 with errorcode 1
```
走不下去了，似乎是超出了windows命令行的长度限制（8192），qstr.i.last-417609e.bat这里面line 3有33k的长度......

换了msys64，还是一样的结果，因为生成QSTR的还是.bat后缀，肯定还是走cmd那套。不知道为啥msys没生效吗？
换一条路，用docker。乐鑫提供了打包好的镜像，直接`docker pull espressif/idf:release-v4.4`拉回来用，省的和本机的python环境再冲突。

```
docker run --rm -v /d/work/drone/micropython:/project -w /project -e HOME=/tmp -it espressif/idf:release-v4.4
```
然后`make`或者`idf.py build`都可以。
编译完成：
```
Successfully created esp32s3 image.
Generated /project/ports/esp32/build-PYDRONE/micropython.bin
[165/165] cd /project/ports/esp32/build-PYDRONE/esp-idf/esptool_py && /opt/esp/...on_table/partition-table.bin /project/ports/esp32/build-PYDRONE/micropython.bin
micropython.bin binary size 0x173000 bytes. Smallest app partition is 0x190000 bytes. 0x1d000 bytes (7%) free.

Project build complete. To flash, run this command:
/opt/esp/python_env/idf4.4_py3.8_env/bin/python ../../../opt/esp/idf/components/esptool_py/esptool/esptool.py -p (PORT) -b 460800 --before default_reset --after n
o_reset --chip esp32s3  write_flash --flash_mode dio --flash_size detect --flash_freq 80m 0x0 build-PYDRONE/bootloader/bootloader.bin 0x8000 build-PYDRONE/partiti
on_table/partition-table.bin 0x10000 build-PYDRONE/micropython.bin
or run 'idf.py -p (PORT) flash'
bootloader  @0x000000    19840  (   12928 remaining)
partitions  @0x008000     3072  (    1024 remaining)
application @0x010000  1519616  (  118784 remaining)
total                  1585152
```

