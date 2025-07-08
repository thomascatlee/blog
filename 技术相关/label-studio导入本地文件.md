---
title: label-studio导入本地文件
date: 2025-06-25 14:49:09 +0800
author: wildcat
tags:
  - label-studio
---
还是得补上一篇。
label-studio的数据导入，如果是上传文件形式的，相对比较简单，但是对真正实用化的场景，多是一个巨大的zip压缩包，展开后数以万计的文件；这时候上传文件的形式就不太合适了。label-studio也贴心的提供了直接引用本地文件的方式，就是要转折一下。

待导入的数据集在`/data/Military-Aircraft-Dataset/dataset`
首先label-studio的文档上说的多半是正确的，本地存储的设置在每个project的setting里：
![](label-studio导入本地文件.md_Attachments/Pasted%20image%2020250625150354.png)
但是这个Path怎么设置呢，我还是摸索一番的。

docker的环境变量里要设置上允许本地存储，以及路径：
![](label-studio导入本地文件.md_Attachments/Pasted%20image%2020250625150504.png)
并且docker要将待导入的存储挂载好
![](label-studio导入本地文件.md_Attachments/Pasted%20image%2020250625150801.png)

project里设置上拼接起来的路径：`/label-studio/files/Military-Aircraft-Dataset/dataset/`

这样label-studio就能通过`/data/local-files/?d=Military-Aircraft-Dataset/dataset/xxxxx.jpg`的形式访问到数据了。

然后**千万不要**去点`Sync Storage`

对于yolo形式的数据集，用如下的python脚本转一下，生成json文件，导入这个文件就可以了。

```
import json
import os
import glob
import pandas as pd

label_index = 0
label_dict = {}

model_version = "one"
root_path = "/data/local-files/?d="


result_list = []
images_path = "/data/Military-Aircraft-Dataset/dataset/*.jpg"
labels_path = "/data/Military-Aircraft-Dataset/dataset/*.csv"
id = 1
for file in glob.glob(labels_path):
    print("file:", file)
    img_path = root_path + file[6:].split(".csv")[0] + ".jpg"
    data = pd.read_csv(file)
    
    print(img_path)
    print(data)

    json_result = {"predictions": [{"model_version": "one",
        "score": 0.5, "result": []}], "data": {"image": img_path}}

    for index, row in data.iterrows():
        filename, width, height, label, xmin, ymin, xmax, ymax = row['filename'], row['width'], row['height'], row['class'], row['xmin'], row['ymin'], row['xmax'], row['ymax']

        print(filename, width, height, label, xmin, ymin, xmax, ymax)

        if(label_dict.get(label) == None):
            label_index += 1
            label_dict[label] = label_index



        x1 = int(xmin) * 100 / int(width)
        y1 = int(ymin) * 100 / int(height)
        w1 = (int(xmax) - int(xmin)) * 100 / int(width)
        h1 = (int(ymax) - int(ymin)) * 100 / int(height)
            
        sub_res = {
            "original_width": width,
            "original_height": height,
            "image_rotation": 0,
            "value": {
                "x": x1,
                "y": y1,
                "width": w1,
                "height": h1,
                "rotation": 0,
                "rectanglelabels": [
                label
                ]
            },
            "id": str(id),
            "from_name": "label",
            "to_name": "image",
            "type": "rectanglelabels",
            "origin": "manual"
            }
        json_result["predictions"][0]["result"].append(sub_res)
        id += 1
    
    result_list.append(json_result)
        


label_reverse = {index: name for name, index in label_dict.items()}

with open('./label_studio_import.json', 'w', encoding='utf-8') as f:
    json.dump(result_list, f, ensure_ascii=False, indent=4)

with open('./labels.txt', 'w', encoding='utf-8') as f:
    for label, index in label_dict.items():
        f.write(f"{label}\n")
```

labels.txt里面是label name用来导入到label-studio的Labeling-Interface，因为label-studio会自动A-Z排序label name，所以从label-studio导出classes时，顺序和labels.txt是会不一样的。
![](label-studio导入本地文件.md_Attachments/Pasted%20image%2020250625151200.png)