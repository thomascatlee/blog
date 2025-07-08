---
title: 不显示cmd窗口执行命令
date: 2025-07-08 14:57:31 +0800
author: wildcat
tags:
  - Windows
  - cmd
---
之前用DropIt实现的右键将ncm文件转成flac，但是处理每个文件时都会弹出cmd窗口，这时候焦点不断被抢走，啥事情也干不了。之前都是凑合用了，今天想解决一下。问了一圈deepseek。试了bat、vbs、powershell等方式，vbs的比较满足要求。
给DropIt的协议配置上，`wscript D:\soft\plugins\um.vbs -i "%File%" -o "%ParentDir%\temp"`
um.vbs如下：
```
' 获取所有参数并处理双引号
args = ""
If WScript.Arguments.Count > 0 Then
    For i = 0 To WScript.Arguments.Count - 1
        ' 将参数中的双引号替换为 \"（转义）
        arg = Replace(WScript.Arguments(i), """", "\""")
        ' 再整体包裹双引号
        args = args & " """ & arg & """"
    Next
End If

Set WshShell = CreateObject("WScript.Shell")
' WSH.Echo "D:\soft\plugins\um.exe" & args
WshShell.Run "D:\soft\plugins\um.exe " & args, 0, False
Set WshShell = Nothing
```
OK，处理几百个文件时候不用干等着了。
