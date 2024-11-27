乐鑫的ESP可玩性还是比较高的，除了一般单片机的功能，WiFi，BLE这些直接都带了，能玩出不少花样，还有人用ESP8266来做桌面小显示屏，闲鱼上一堆堆的。
![](微雪ESP32S3-Nano的烧写.md_Attachments/Pasted%20image%2020241121111342.png)

淘宝上买了一块微雪的ESP32S3-Nano，拿来捣鼓些小玩意；这块板子在Arduino下直接装上驱动就能烧写，没仔细研究，估计是DFU方式；要用来跑MicroPython，就得自己拿烧写软件烧写了。然而，正常情况下板子是SPI启动模式，不管是ESP提供的IDF还是flash_download_tool这时候都是没法烧写的。查一下微雪的管脚，以及ESP32S3的芯片手册，确定需要短接GPIO0到地，再上电进入下载模式，即板子插在电脑上，按住RST，B1短接到GND再松开RST。两个脚倒是挨着，要是仍然保留个按键就更方便了。
然后就随便拿什么esptool或者别的烧写bin文件吧。

```
esptool.py -p rfc2217://10.10.10.105:4000?ign_set_control -b 460800 --before default_reset --after no_reset --chip esp32s3  write_flash --flash_mode dio --flash_size detect --flash_freq 80m 0x0 nuttx.bin
```

![](微雪ESP32S3-Nano的烧写.md_Attachments/Pasted%20image%2020241121105827.png)