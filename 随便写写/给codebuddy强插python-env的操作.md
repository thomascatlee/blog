---
title: 给codebuddy强插python-env的操作
date: 2025-11-20 14:58:40 +0800
author: wildcat
tags:
  - VSCode
  - Codebuddy
  - python
  - powershell
---
Codebuddy国内版目前还是有点免费的token可以薅的，不用白不用哈。
先说一下背景，我一直用的anaconda维护python环境，机上还有一套mingw的python，当初干啥的忘记了，默认在那就一直在吧。
正常使用conda activate是没问题的；但是在craft自行执行某些操作时，会直接新起powershell终端，然后检测python环境，并安装缺少的依赖。
说实话这套操作对小白用户是相当的友好，但是遇到我这样的强迫症，乱动我环境不能忍。
曾经我是Jetbrain的付费用户呢，很少操心这些环境配置的事情；vscode一直没用起来，就跑跑platformIO，多半也有环境配置麻烦的因素。
现在遇到codebuddy，又不想用Jetbrain，那还是得解决环境配置的问题。
查了一下vscode，现在有个python-env插件，号称能解决终端和python环境初始化之间的问题。但是codebuddy居然装不上，那就用强的了。直接把extensions目录下对应插件的文件夹复制给codebuddy，重启，哎你别说就能用了。
按照插件说明把设置都改上了，但是没实现宣传中的自动化啊，仔细查一下，VSCODE_PYTHON_PWSH_ACTIVATE这些环境变量都正常注入了，再改改启动的ps1脚本吧。
vscode的PSH脚本里有这么一段

```
# Register Python shell activate hooks
# Prevent multiple activation with guard
if (-not $env:VSCODE_PYTHON_AUTOACTIVATE_GUARD) {
	$env:VSCODE_PYTHON_AUTOACTIVATE_GUARD = '1'
	if ($env:VSCODE_PYTHON_PWSH_ACTIVATE -and $env:TERM_PROGRAM -eq 'vscode') {
		$activateScript = $env:VSCODE_PYTHON_PWSH_ACTIVATE
		Remove-Item Env:VSCODE_PYTHON_PWSH_ACTIVATE

		try {
			Invoke-Expression $activateScript
			$Global:__VSCodeState.OriginalPrompt = $function:Prompt
		}
		catch {
			$activationError = $_
			Write-Host "`e[0m`e[7m * `e[0;103m VS Code Python powershell activation failed with exit code $($activationError.Exception.Message) `e[0m"
		}
	}
}
```

照猫画虎给codebuddy也强插一段

```
# Register Python shell activate hooks
# Prevent multiple activation with guard
if (-not $env:VSCODE_PYTHON_AUTOACTIVATE_GUARD) {
	$env:VSCODE_PYTHON_AUTOACTIVATE_GUARD = '1'
	if ($env:VSCODE_PYTHON_PWSH_ACTIVATE -and $env:TERM_PROGRAM -eq 'codebuddy') {
		$activateScript = $env:VSCODE_PYTHON_PWSH_ACTIVATE
		Remove-Item Env:VSCODE_PYTHON_PWSH_ACTIVATE

		try {
			Invoke-Expression $activateScript
			$Global:__VSCodeOriginalPrompt = $function:Prompt
		}
		catch {
			$activationError = $_
			Write-Host "`e[0m`e[7m * `e[0;103m VS Code Python powershell activation failed with exit code $($activationError.Exception.Message) `e[0m"
		}
	}
}
```

哎，它自己就动起来了~