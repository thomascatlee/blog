---
title: FSRCNN的caffe实现
date: 2018-03-28 17:00:00 +0800
author: me
tags:
    - 技术杂记
    - 深度学习
    - 试验田
preview: FSRCNN是汤晓鸥在CVPR2016上的文章，实时处理超分辨率图像。

---

ubuntu上的显卡太老了，在windows上跑的caffe。从网上下载的bin包，折腾一圈发现要求python35，晕菜。重新建了35的环境，装一堆这个那个，可以跑了。

之前没用过caffe，同事给了prototxt和model，我自己写了点python，感觉还挺好用的呀，和mxnet、pytorch都差不多。就是图片导入有点波折，我是用YUV格式给caffe，又是newaxis，又是reshape的，才搞定。