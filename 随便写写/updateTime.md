---
title: updateTime
date: 2023-06-16 16:45:46 +0800
author: me
tags:
    - 
---


用docsify实现blog时，github的pages最后发布时后有个打包上传的动作，而docsify没有在文件名或文件内容中带时间信息，而是依赖文件时间来显示updateTime；而checkout时，会以当前时间作为文件修改时间，所以需要用git log中的时间信息来修正一下文件的时间。
默认的checkout action只取一条log，我们需要所有的log，要改一下action的参数，加上fetch-depth。
```
      - name: Checkout
        uses: actions/checkout@v3
        with:
          fetch-depth: '0'
```
在action中checkout之后加上一段，修正回来正确的文件时间。
```
      - name: Repair updateTime
        run:  |
              git config --global core.quotepath false
              git ls-files | while read file; do touch -d $(git log -1 --format="@%ct" "$file") "$file"; done
```
 顺便把gh-pages的提交做个回滚，把以前的恢复回来，这样时间就能看到了。