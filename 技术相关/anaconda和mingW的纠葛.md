---
title: anaconda和mingW的纠葛
date: 2024-01-17 17:47:16 +0800
author: wildcat
tags:
---

想在mingW下使用anaconda，改conda的脚本等折腾无效；需要改msys的文件。
/home/user/.bash_profile中加一句

```
eval "$('/d/radioconda/Scripts/conda.exe' 'shell.bash' 'hook')"
```
这里是改的radioconda，和anaconda一样的，conda.exe的路径一定对了。

再开一遍mingW的bash，就能用anaconda了。

另外mingW的term太小了，改一下。

找一个右键菜单管理工具，在`目录`条目下增加一项操作

```
d:\msys64\msys2_shell.cmd -where %1 -defterm -mingw64
```
以后就能指定目录直接打开mingW了。