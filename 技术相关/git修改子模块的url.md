---
title: git修改子模块的url
date: 2020-08-25 19:46:43 +0800
author: me
tags:
    - 
---

TortoiseGit上没有修改子模块url的地方，所以只好命令行。
```
git config --file .gitmodules -l
```
看一下目前的子模块
```
submodule.submodules/googletest.path=submodules/googletest
submodule.submodules/googletest.url=https://github.com/google/googletest
submodule.submodules/openssl.path=submodules/openssl
submodule.submodules/openssl.url=https://github.com/akamai/openssl.git
submodule.submodules/openssl.branch=master-quic-support
submodule.submodules/everest.path=submodules/everest
submodule.submodules/everest.url=https://github.com/nibanks/everest-dist.git
submodule.submodules/everest.branch=pr/msquic
submodule.submodules/wil.path=submodules/wil
submodule.submodules/wil.url=https://github.com/microsoft/wil
```
命令行输入：
```
git config --file .gitmodules submodule.submodules/googletest.url http://gitlab.rd.smsx.tech/quic/googletest.git
git config --file .gitmodules submodule.submodules/openssl.url http://gitlab.rd.smsx.tech/quic/openssl.git
git config --file .gitmodules submodule.submodules/everest.url http://gitlab.rd.smsx.tech/quic/everest.git
git config --file .gitmodules submodule.submodules/wil.url http://gitlab.rd.smsx.tech/quic/wil.git
```
`git config --file .gitmodules -l`看一下目前的设置
```
submodule.submodules/googletest.path=submodules/googletest
submodule.submodules/googletest.url=http://gitlab.rd.smsx.tech/quic/googletest.git
submodule.submodules/openssl.path=submodules/openssl
submodule.submodules/openssl.url=http://gitlab.rd.smsx.tech/quic/openssl.git
submodule.submodules/openssl.branch=master-quic-support
submodule.submodules/everest.path=submodules/everest
submodule.submodules/everest.url=http://gitlab.rd.smsx.tech/quic/everest.git
submodule.submodules/everest.branch=pr/msquic
submodule.submodules/wil.path=submodules/wil
submodule.submodules/wil.url=http://gitlab.rd.smsx.tech/quic/wil.git
```
然后更新本地.git/config，并提交到远端仓库：
```
git submodule sync
git submodule update --init --recursive --remote
```

当然，修改URL的操作，也可以直接用编辑器打开`.gitmodules`，修改url，改完之后同样要sync。