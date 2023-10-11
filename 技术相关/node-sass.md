---
title: node-sass
date: 2020-08-06 11:27:47 +0800
author: me
tags:
    - 
---

以前的web，更新了node版本后，再次`npm run build`
结果出错了，主要是node-sass的问题：
```
Error: Node Sass does not yet support your current environment: Windows 64-bit with Unsupported runtime (72)

```
网上搜了一下，都是说npm卸载node-sass之后重装一遍的，但是开发环境是不联网的，所以多花一点时间研究一下：

```
node-sass 每次安装时会根据当前操作系统、nodejs 版本（只需要关心主版本号）、当前 node-sass 版本进行编译，生成一个.node结尾的二进制文件，它的位置在当前项目的node_modules/node-sass/vendor/下。
```
[npm网站](https://www.npmjs.com/package/node-sass)上有个node版本对应node-sass的表格：
```
node-sass
Supported Node.js versions vary by release, please consult the releases page. Below is a quick guide for minimum support:
NodeJS	Minimum node-sass version	Node Module
Node 14	4.14+	83
Node 13	4.13+	79
Node 12	4.12+	72
Node 11	4.10+	67
Node 10	4.9+	64
Node 8	4.5.3+	57
```
或者更简单的，看错误提示里的（数字），比如我的是72。

然后去[github](https://github.com/sass/node-sass/releases)上下载对应版本的文件，放到vendor目录下，并改名。比如我下载的是`win32-x64-72_binding.node`，在vendor目录下新建`win32-x64-72`目录，把文件放进去，改名为binding.node。

重新`npm run build`，欧克~


