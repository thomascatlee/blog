title: "caddy+ink搭了个试验品"
date: 2017-08-25 19:00:00 +0800
author: me
tags:
    - 技术杂记
    - 随笔
    - 试验田
preview: caddy是个go语言写的http(s)server，ink是个go语言写的静态blog生成器，从md文件生成静态html。

---

## caddy+ink搭了个试验品

​	之前用的apache，偶然看到caddy这个轻量级的应用，打算拿来干点啥。

​	ink是[猫叔](http://www.chole.io/blog/)的作品，我之前没接触过静态博客这类东西，一看还挺对胃口，简单，干净，于是caddy和ink就在我的试验田里成为第一个试验品。

​	ink的使用很简单，preview、build、publish，我也没有原来的帖子需要导入，就写写md就能用上。不过theme还是折腾了一点时间，github上的两个theme都没用起来，后来[ink-simple](https://github.com/myiq/ink-simple)这个能用，我又稍微[改了改](https://github.com/thomascatlee/ink-simple)。

​	caddy支持git，然而github免费版不支持私有库，所以又找了个[免费私有库](https://coding.net)，虽然免费版只支持2个，然而填个电话号码就可以5个，256M，做试验一般用用足够了。

​	markdown的编辑对我也是新东西，找了一圈，atom+插件或者是Typora就可以。然后突然发现atom躺在download目录下已经2年了，好吧，小账本又记上一笔。Typora不是像其他md编辑器那样，左右分，一边代码一边预览，而是直接在编辑时候就能预览，我喜欢。应该是用了浏览器的渲染，具体技术还没研究。另外，在安装文件里找到一个ffmpeg，干嘛用的呢，有空看看（好吧，又是一笔~）


