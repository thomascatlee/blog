---
title: label-studio的ML后端
date: 2025-05-29 15:03:43 +0800
author: wildcat
tags:
  - 标注
  - 训练
  - label-studio
---
Label-studio安装没啥说的，docker起来最简单，注意如果要使用本地文件，要在启动变量里设置：
```
LABEL_STUDIO_LOCAL_FILES_SERVING_ENABLED = true
LABEL_STUDIO_LOCAL_FILES_DOCUMENT_ROOT = /label-studio/files
```
要使用label-studio的ML后端，首先安装SDK：
```
git clone https://github.com/HumanSignal/label-studio-ml-backend.git
cd label-studio-ml-backend/
pip install -e .
```
然后直接套模板，创建自己的ML后端：

```
label-studio-ml create my_ml_backend
```

修改model.py，实现predict()和fit()方法：

```
def predict(self, tasks, context, **kwargs):
    """Make predictions for the tasks."""
    return predictions
```


```
def fit(self, event, data, **kwargs):
    """Train the model on the labeled data."""
    old_model = self.get('old_model')
    # write your logic to update the model
    self.set('new_model', new_model)
```



运行起来：

```
label-studio-ml start my_ml_backend
```

在label-studio的工程中添加model：
![](label-studio的ML后端.md_Attachments/Pasted%20image%2020250529173017.png)就可以使用了。

目前label-studio还没实现训练的可视化，训练进度等信息只能从ML端看到。