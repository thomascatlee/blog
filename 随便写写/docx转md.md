---
title: docx转md
date: 2025-03-25 15:01:40 +0800
author: wildcat
tags:
  - word
  - markdown
  - html
  - obsidian
---
obsidian不支持直接显示word的docx文件，只能转成md再看。之前一直用pandoc来转换，最近docx文件中有不少表格，用pandoc转换出来就没形状了。因为markdown是不支持合并单元格这种形式的，只能想办法自己转了。markdown里面可以用嵌入html tag的方式来实现表格，用`<td>`的`rowspan，colspan` 属性来实现合并单元格。
CSDN上找了一篇docx转CDSN编辑器的文章[Python实现Word转为Markdown：CSDN新手发文窘境——公式篇_python word转markdown-CSDN博客](https://blog.csdn.net/m0_47197145/article/details/129382660)，其中表格的代码可以抄一下。


