---
title: label-studio 的本地文件问题
date: 2025-05-29 17:33:54 +0800
author: wildcat
tags:
  - label-studio
---
使用本地文件时，文件URL是形如`http://10.10.10.161:8080/data/local-files/?d=Military-Aircraft-Dataset/dataset/0000e97ea2d086d6759b19b288a8a72c.jpg`这样的，但是label-studio中认为ML后端和标注服务在一起，即“local storage”， 因此不需要再打包传输。而实际上只是数据资源和标注服务在一起，ML并不一定能直接访问到数据资源。这就需要手工打一个patch。

修改docker中的文件：`/label-studio/.venv/lib/python3.12/site-packages/label_studio_sdk/_extensions/label_studio_tools/core/utils/io.py`
改为：
```
    # Local storage file: try to load locally otherwise download below
    # this code allow to read Local Storage files directly from a directory
    # instead of downloading them from LS instance
    if is_local_storage_file:
        filepath = url.split("?d=")[1]
        filepath = safe_build_path(LOCAL_FILES_DOCUMENT_ROOT, filepath)
        if os.path.exists(filepath):
            if cache_dir and download_resources:
                shutil.copy(filepath, cache_dir)
                logger.debug(
                f"Local Storage file path exists locally, use it as a local file: {filepath}"
            )
            return filepath
```

增加的            `if cache_dir and download_resources:`
                `shutil.copy(filepath, cache_dir)` 这两句，将本地文件也复制到临时目录中，准备打包。

这样，ML后端通过http得到的zip文件，就包含图像文件了。