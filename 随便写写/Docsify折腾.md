---
title: Docsify折腾
date: 2023-10-11 18:39:07 +0800
author: wildcat
tags:
  - 技术杂记
  - 备忘
  - 随笔
  - 试验田
---

之前用ink时的blog丢在那没管，前段时间突发奇想，能不能用docsify来支持显示ink格式的md呢，再加上vnote换成obsidian，就开始折腾呗。
ink格式要求md正文之前有个添头：

```
title: Article Title
date: Year-Month-Day Hour:Minute:Second #Created Time. Support timezone, such as " +0800"
update: Year-Month-Day Hour:Minute:Second #Updated Time, optional. Support timezone, such as " +0800"
author: AuthorID
cover: Article Cover Path # Optional
draft: false # Is draft or not, optional
top: false # Place article to top or not, optional
preview: Article Preview, Also use <!--more--> to split in body # Optional
tags: # Optional
    - Tag1
    - Tag2
type: post # Specify type is post or page, optional
hide: false # Hide article or not. Hidden atricles still can be accessed via URL, optional
toc: false # Show table of contents or not, optional
---

Markdown Format's Body
```

不按他要求来，ink build的时候就会报错。而obsidian中也有类似的东西叫front matter，形式上可能也更标准，文件开头，三个“-”号之间区隔，yaml形式。docsify也是一样形式的front matter。

那就简单了，ink不标准就把原来ink的改了呗，直接修改md文件，title之前加上三个“-”号。
至于和ink兼容，小改一下ink的parse.go，解析`CONFIG_SPLIT`的时候多解析一遍，适配obsidian格式的同时保持原ink格式的兼容就可以了。另外[github上的ink](https://github.com/InkProject/ink)也很久没有更新了。
