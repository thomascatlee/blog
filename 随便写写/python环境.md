---
title: python环境
date: 2024-10-11 15:50:54 +0800
author: wildcat
tags:
  - python
  - anaconda
---

pip批量导出包含环境中所有组件的requirements.txt文件

```
pip freeze > requirements.txt
```

pip批量安装requirements.txt文件中包含的组件依赖

```
pip install -r requirements.txt
```

conda批量导出包含环境中所有组件的requirements.txt文件

```
conda list -e > requirements.txt
```

conda批量安装requirements.txt文件中包含的组件依赖

```
conda install --yes --file requirements.txt
```