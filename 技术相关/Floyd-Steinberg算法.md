---
title: Floyd-Steinberg算法
date: 2024-02-29 16:22:18 +0800
author: wildcat
tags:
---
需要把RGB888的图像转为RGB444的，直接对每个像素的RGB值做&F0操作就可以，但是视觉效果会比较差，一般我们采用颜色dithering来实现更好的视觉效果；Floyd-Steinberg算法是其中比较常用的一种，属于误差扩散法。此方法将当前像素的误差以一定权重分配到邻近像素。比如经典的权重设计如下：
![](Floyd-Steinberg算法.md_Attachments/Pasted%20image%2020240313134842.png)
对应到numpy就很简单

```
distribution = np.array([7, 3, 5, 1], dtype=float) / 16  
u = np.array([0, 1, 1, 1])  
v = np.array([1, -1, 0, 1])  
  
paletten = np.array([0,16,16,32,32,48,48,64,64,80,80,96,96,112,112,128,128,144,144,160,160,176,176,192,192,208,208,224,224,240,240,255])  
  
for y in range(image.shape[0] - 1):  
    for x in range(image.shape[1] - 1):  
        for i in range(3):  
            value = paletten[image[y, x, i] >> 3]  
            error = image[y, x, i] - value  
            image[y, x, i] = value  
            cache = image[y + u, x + v, i].astype(np.float32) +  np.round(error * distribution)  
            cache[cache > 255] = 255  
            cache[cache < 0] = 0  
            image[y + u, x + v, i] = cache.astype(np.uint8)
```

这里paletten设计成等间隔的色阶变化，也可以根据实际需要修改，但是要保证查表得到的点与实际点的汉明距离最小，这样误差才会最小。这里RGB是分开考虑的，应该有将RGB统一考虑以在颜色空间上取得最接近原色效果的方法。我不懂彩色啦，优化就不做了。

