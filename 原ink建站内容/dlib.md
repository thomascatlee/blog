---
title: "记录dlib在windows下编译问题"

date: 2017-11-30 16:30:00 +0800
author: me
tags:

    - 技术杂记
    - python
    - 人脸识别
preview: 奇怪的方法解决奇怪的问题。

---

python真是生产力工具，有各种各样的人为了完成各种各样的工作写了各种各样的组件，还发布出来给其他人用，善用python，解放生产力。

人脸识别的坑，随着iphoneX，又再次热起来；俺也回来踩两脚。用[这个](https://github.com/ageitgey/face_recognition)可以方便的完成做脸的几项基本工作：找脸，勾画特征（眼、嘴、眉毛等，美图秀秀嘛），还有差不多能用的人脸匹配。而这一切，都只需要不超过10行代码。

在python上安装，很简单，pip install face_recognition，会自动帮你把dlib等依赖包装好。python的生态真是越来越好了。

试用一下，还挺像回事，给人脸标个框框，就是有点慢，在识别人脸时感觉明显的卡顿。看了一下，应该是dlib库的问题。自己编译吧。

clone了[dlib的源码](https://github.com/davisking/dlib.git)，cmake走起。

首先是缺cuDNN，咦见鬼了，我记得当时装Tensorflow，折腾CUDA的时候装了呀，不管了，再去NVIDIA搞一遍。

然后是MKL，Intel，我来了。

然后VS2015...看提示是说用了C++11的特性所以需要update3云云，Microsoft走起。这也挺折腾，微软现在都下不到完整安装包，只能400k小水管慢慢安装；好吧，反正晚上的时间老板不掏钱，晚上开着慢慢下。 

一切就绪，cmake，然后vs编译，一遍过~慢着，这是C++库，我们需要给python用，继续吧。好像是在打游戏，一关关过，这个我擅长。

dlib用于python需要Boost，下载Boost的源码，编译python支持：

```shell
b2 -a --with-python address-model=64 toolset=msvc runtime-link=static
```

很顺利的得到了libboost_python3-vc141-mt-s-1_65_1.lib。

然后去dlib目录下，

```shell
python setup.py install --yes USE_AVX_INSTRUCTIONS or python setup.py install --yes USE_AVX_INSTRUCTIONS --yes DLIB_USE_CUDA
```

报错了，哦忘记设置环境变量：

```shell
set BOOST_ROOT=C:\local\boost_1_65_1
set BOOST_LIBRARYDIR=C:\local\boost_1_65_1\stage\lib
```

继续报各种错。

看了看setup.py其实还是调用cmake；cmake不熟，找半天才知道怎么开DEBUG信息。把add_python_module改了，加上

```cmake
set(Boost_DEBUG ON)
```

原来他在找python2.7，我是python3...

继续修改，把开头的开关打开：

```cmake
option(PYTHON3 "Build a Python3 compatible library rather than Python2." ON)
```

现在是报找不到Boost，因为他在找-vc140，而我编出来的是-vc141，坑爹啊。

把名字改成-140，终于搞定了。然而......

python setup报错，unicode什么什么，懒得去找问题了。

cmake打开dlib\tools\python，生成vs2015工程，上vs~

把新鲜出炉的dlib.pyd放到python去，替换原来文件。

果然加速了呀，现在识别画面一点不卡。

