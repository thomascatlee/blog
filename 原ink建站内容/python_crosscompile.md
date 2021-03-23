title: "Python的交叉编译"
date: 2018-10-19 16:48:41 +0800
author: me
tags:
    - 技术杂记
    - 随笔
    - 试验田
preview: 踩了个坑，记录下来

---

​	之前做boost移植的时候，已经编译了python的arm版本。简单用了一下，也是正常的，netdata使用也正常。现在用ansible的时候，终于踩坑了。
    `ansible -m ping all` 简单的命令，结果报错。`ANSIBLE_DEBUG=1`看了一下：
```
import base64
File "/usr/lib/python3.5/base64.py", line 10, in <module>
import struct
File "/usr/lib/python3.5/struct.py", line 13, in <module>
from _struct import * 
ImportError: No module named '_struct'
```
    这是海思上的python出错了，找不到扩展模块。base64是自带的，照理说不应该呀。以为是路径问题，查看了sys.path，/usr/lib/python3.5/lib-dynload已经包含在里面了。外事不决就google，在python的论坛上找到了这个：[Missing extensions modules when cross compiling python 3.5.2 for arm on Linux](https://bugs.python.org/issue28444)，还是交叉编译的锅。编译时候setup.py没有编译扩展模块。好在已经有人做了补丁，patch一下，重新make install，OK。
    然后ansible也OK了。
