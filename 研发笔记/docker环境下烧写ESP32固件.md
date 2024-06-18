---
title: docker环境下烧写ESP32固件
date: 2024-06-18 10:53:53 +0800
author: wildcat
tags:
  - ESP32
  - 嵌入式
---

Linux下可以通过--device的选项将设备透给docker，只是有点麻烦；Windows下就没有办法了。好在ESP工具都提供了使用RFC2217协议的选项，这就能将串口转为网口供docker使用。
一般的操作形如：
```
esptool.py --port rfc2217://192.168.1.77:4000 flash_id
```

这里192.168.1.77是连接待烧写的ESP32硬件的PC机。在该PC机上需要运行`esp_rfc2217_server`这个软件，可以从idf里面找到这个py，或者Windows也可以从[ESP工具版本](https://github.com/espressif/esptool/releases)找到pyInstaller生成的exe。在命令行里运行起来，确保防火墙端口开放。
```
d:\work\drone\esp-drone\build>d:\espressif\tools\esptool-win64\esp_rfc2217_server.exe -v -p 4000 COM8
INFO:root:RFC 2217 TCP/IP to Serial redirector - type Ctrl-C / BREAK to quit
INFO:root:Serving serial port: COM8
INFO:root:TCP/IP port: 4000
INFO:root:Connected by 127.0.0.1:57505
INFO:rfc2217.server:client accepts RFC 2217
INFO:rfc2217.server:NOTIFY_MODEMSTATE: False
INFO:rfc2217.server:client accepts RFC 2217
INFO:rfc2217.server:NOTIFY_MODEMSTATE: False
INFO:rfc2217.server:set baud rate: 9600
INFO:rfc2217.server:set data size: 8
INFO:rfc2217.server:set parity: N
INFO:rfc2217.server:set stop bits: 1
INFO:rfc2217.server:changed flow control to None
INFO:rfc2217.server:Activating reset in thread
INFO:rfc2217.server:purge in
INFO:rfc2217.server:purge out
```

运行起来之后，在docker里就可以烧写。
```
root@09603032ec7b:/project/ports/esp32# /opt/esp/python_env/idf4.4_py3.8_env/bin/python ../../../opt/esp/idf/components/esptool_py/esptool/esptool.py -p 'rfc2217://host.docker.internal:4000?ign_set_control' -b 460800 --before default_reset --after no_reset --chip esp32s3  write_flash --flash_mode dio --flash_size detect --flash_freq 80m 0x0 build-PYDRONE/bootloader/bootloader.bin 0x8000 build-PYDRONE/partition_table/partition-table.bin 0x10000 build-PYDRONE/micropython.bin
esptool.py v3.3.4-dev
Serial port rfc2217://host.docker.internal:4000?ign_set_control
Connecting...
Device PID identification is only supported on COM and /dev/ serial ports.

Chip is ESP32-S3 (revision v0.1)
Features: WiFi, BLE
Crystal is 40MHz
MAC: f4:12:fa:e2:e9:b8
Uploading stub...
Running stub...
Stub running...
Changing baud rate to 460800
Changed.
Configuring flash size...
Auto-detected Flash size: 8MB
Flash will be erased from 0x00000000 to 0x00004fff...
Flash will be erased from 0x00008000 to 0x00008fff...
Flash will be erased from 0x00010000 to 0x00174fff...
Compressed 19840 bytes to 12591...
Wrote 19840 bytes (12591 compressed) at 0x00000000 in 0.7 seconds (effective 229.9 kbit/s)...
Hash of data verified.
Compressed 3072 bytes to 115...
Wrote 3072 bytes (115 compressed) at 0x00008000 in 0.6 seconds (effective 39.8 kbit/s)...
Hash of data verified.
Compressed 1459808 bytes to 993164...
Wrote 1459808 bytes (993164 compressed) at 0x00010000 in 25.2 seconds (effective 464.1 kbit/s)...
Hash of data verified.

Leaving...
Staying in bootloader.
```

除了docker之外，远程烧写也是可以的。

