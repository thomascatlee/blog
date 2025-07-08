---
title: G大还是B大
date: 2025-04-03 15:20:23 +0800
author: wildcat
tags:
  - 涨姿势
---


看yolov10的性能，有点迷糊：

| 模型       | 输入尺寸 | APval | FLOP (G) | 延迟（毫秒） |
|----------|------|-------|----------|--------|
| YOLOv10n | 640  | 38.5  | 6.7      | 1.84   |
| YOLOv10s | 640  | 46.3  | 21.6     | 2.49   |
| YOLOv10m | 640  | 51.1  | 59.1     | 4.74   |
| YOLOv10b | 640  | 52.5  | 92.0     | 5.74   |
| YOLOv10l | 640  | 53.2  | 120.3    | 7.28   |
| YOLOv10x | 640  | 54.4  | 160.4    | 10.70  |

对比其他的

| 模型                                                                                          | YAML                                                                                                           | 尺寸  <br>（像素） | mAPval  <br>50-95 | 速度  <br>CPU ONNX  <br>（毫秒） | 速度  <br>A100 TensorRT  <br>（毫秒） | params  <br>(M) | FLOPs  <br>(B) |
| ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------ | ----------------- | -------------------------- | ------------------------------- | --------------- | -------------- |
| [yolov5nu.pt](https://github.com/ultralytics/assets/releases/download/v8.3.0/yolov5nu.pt)   | [yolov5n.yaml](https://github.com/ultralytics/ultralytics/blob/main/ultralytics/cfg/models/v5/yolov5.yaml)     | 640          | 34.3              | 73.6                       | 1.06                            | 2.6             | 7.7            |
| [yolov5su.pt](https://github.com/ultralytics/assets/releases/download/v8.3.0/yolov5su.pt)   | [yolov5s.yaml](https://github.com/ultralytics/ultralytics/blob/main/ultralytics/cfg/models/v5/yolov5.yaml)     | 640          | 43.0              | 120.7                      | 1.27                            | 9.1             | 24.0           |
| [yolov5mu.pt](https://github.com/ultralytics/assets/releases/download/v8.3.0/yolov5mu.pt)   | [yolov5m.yaml](https://github.com/ultralytics/ultralytics/blob/main/ultralytics/cfg/models/v5/yolov5.yaml)     | 640          | 49.0              | 233.9                      | 1.86                            | 25.1            | 64.2           |
| [yolov5lu.pt](https://github.com/ultralytics/assets/releases/download/v8.3.0/yolov5lu.pt)   | [yolov5l.yaml](https://github.com/ultralytics/ultralytics/blob/main/ultralytics/cfg/models/v5/yolov5.yaml)     | 640          | 52.2              | 408.4                      | 2.50                            | 53.2            | 135.0          |
| [yolov5xu.pt](https://github.com/ultralytics/assets/releases/download/v8.3.0/yolov5xu.pt)   | [yolov5x.yaml](https://github.com/ultralytics/ultralytics/blob/main/ultralytics/cfg/models/v5/yolov5.yaml)     | 640          | 53.2              | 763.2                      | 3.81                            | 97.2            | 246.4          |
|                                                                                             |                                                                                                                |              |                   |                            |                                 |                 |                |
| [yolov5n6u.pt](https://github.com/ultralytics/assets/releases/download/v8.3.0/yolov5n6u.pt) | [yolov5n6.yaml](https://github.com/ultralytics/ultralytics/blob/main/ultralytics/cfg/models/v5/yolov5-p6.yaml) | 1280         | 42.1              | 211.0                      | 1.83                            | 4.3             | 7.8            |
| [yolov5s6u.pt](https://github.com/ultralytics/assets/releases/download/v8.3.0/yolov5s6u.pt) | [yolov5s6.yaml](https://github.com/ultralytics/ultralytics/blob/main/ultralytics/cfg/models/v5/yolov5-p6.yaml) | 1280         | 48.6              | 422.6                      | 2.34                            | 15.3            | 24.6           |
| [yolov5m6u.pt](https://github.com/ultralytics/assets/releases/download/v8.3.0/yolov5m6u.pt) | [yolov5m6.yaml](https://github.com/ultralytics/ultralytics/blob/main/ultralytics/cfg/models/v5/yolov5-p6.yaml) | 1280         | 53.6              | 810.9                      | 4.36                            | 41.2            | 65.7           |
| [yolov5l6u.pt](https://github.com/ultralytics/assets/releases/download/v8.3.0/yolov5l6u.pt) | [yolov5l6.yaml](https://github.com/ultralytics/ultralytics/blob/main/ultralytics/cfg/models/v5/yolov5-p6.yaml) | 1280         | 55.7              | 1470.9                     | 5.47                            | 86.1            | 137.4          |
| [yolov5x6u.pt](https://github.com/ultralytics/assets/releases/download/v8.3.0/yolov5x6u.pt) | [yolov5x6.yaml](https://github.com/ultralytics/ultralytics/blob/main/ultralytics/cfg/models/v5/yolov5-p6.yaml) | 1280         | 56.8              | 2436.5                     | 8.98                            | 155.4           | 250.7          |

| 模型                                                           | 参数  <br>(M) | FLOPs  <br>(G) | 尺寸  <br>（像素） | FPS     | APtest/ val  <br>50-95 | APtest  <br>50 | APtest  <br>75 | APtest  <br>S | APtest  <br>M | APtest  <br>L |
| ------------------------------------------------------------ | ----------- | -------------- | ------------ | ------- | ---------------------- | -------------- | -------------- | ------------- | ------------- | ------------- |
| [YOLOX-S](https://github.com/Megvii-BaseDetection/YOLOX)     | **9.0**     | **26.8**       | 640          | **102** | 40.5% / 40.5%          | -              | -              | -             | -             | -             |
| [YOLOX-M](https://github.com/Megvii-BaseDetection/YOLOX)     | 25.3        | 73.8           | 640          | 81      | 47.2% / 46.9%          | -              | -              | -             | -             | -             |
| [YOLOX-L](https://github.com/Megvii-BaseDetection/YOLOX)     | 54.2        | 155.6          | 640          | 69      | 50.1% / 49.7%          | -              | -              | -             | -             | -             |
| [YOLOX-X](https://github.com/Megvii-BaseDetection/YOLOX)     | 99.1        | 281.9          | 640          | 58      | **51.5% / 51.1%**      | -              | -              | -             | -             | -             |
|                                                              |             |                |              |         |                        |                |                |               |               |               |
| [PPYOLOE-S](https://github.com/PaddlePaddle/PaddleDetection) | **7.9**     | **17.4**       | 640          | **208** | 43.1% / 42.7%          | 60.5%          | 46.6%          | 23.2%         | 46.4%         | 56.9%         |
| [PPYOLOE-M](https://github.com/PaddlePaddle/PaddleDetection) | 23.4        | 49.9           | 640          | 123     | 48.9% / 48.6%          | 66.5%          | 53.0%          | 28.6%         | 52.9%         | 63.8%         |
| [PPYOLOE-L](https://github.com/PaddlePaddle/PaddleDetection) | 52.2        | 110.1          | 640          | 78      | 51.4% / 50.9%          | 68.9%          | 55.6%          | 31.4%         | 55.3%         | 66.1%         |
| [PPYOLOE-X](https://github.com/PaddlePaddle/PaddleDetection) | 98.4        | 206.6          | 640          | 45      | **52.2% / 51.9%**      | **69.9%**      | **56.5%**      | **33.3%**     | **56.3%**     | **66.4%**     |
|                                                              |             |                |              |         |                        |                |                |               |               |               |
| [YOLOv5-N（r6.1）](https://github.com/ultralytics/yolov5)      | **1.9**     | **4.5**        | 640          | **159** | - / 28.0%              | -              | -              | -             | -             | -             |
| [YOLOv5-S（r6.1）](https://github.com/ultralytics/yolov5)      | 7.2         | 16.5           | 640          | 156     | - / 37.4%              | -              | -              | -             | -             | -             |
| [YOLOv5-M（r6.1）](https://github.com/ultralytics/yolov5)      | 21.2        | 49.0           | 640          | 122     | - / 45.4%              | -              | -              | -             | -             | -             |
| [YOLOv5-L（r6.1）](https://github.com/ultralytics/yolov5)      | 46.5        | 109.1          | 640          | 99      | - / 49.0%              | -              | -              | -             | -             | -             |
| [YOLOv5-X（r6.1）](https://github.com/ultralytics/yolov5)      | 86.7        | 205.7          | 640          | 83      | - /**50.7%**           | -              | -              | -             | -             | -             |
|                                                              |             |                |              |         |                        |                |                |               |               |               |
| [YOLOR-CSP](https://github.com/WongKinYiu/yolor)             | 52.9        | 120.4          | 640          | 106     | 51.1% / 50.8%          | 69.6%          | 55.7%          | 31.7%         | 55.3%         | 64.7%         |
| [YOLOR-CSP-X](https://github.com/WongKinYiu/yolor)           | 96.9        | 226.8          | 640          | 87      | 53.0% / 52.7%          | 71.4%          | 57.9%          | 33.7%         | 57.1%         | 66.8%         |
| [YOLOv7-tiny-SiLU](https://github.com/WongKinYiu/yolov7)     | **6.2**     | **13.8**       | 640          | **286** | 38.7% / 38.7%          | 56.7%          | 41.7%          | 18.8%         | 42.4%         | 51.9%         |
| [YOLOv7](https://github.com/WongKinYiu/yolov7)               | 36.9        | 104.7          | 640          | 161     | 51.4% / 51.2%          | 69.7%          | 55.9%          | 31.8%         | 55.5%         | 65.0%         |
| [YOLOv7-X](https://github.com/WongKinYiu/yolov7)             | 71.3        | 189.9          | 640          | 114     | **53.1% / 52.9%**      | **71.2%**      | **57.8%**      | **33.8%**     | **57.1%**     | **67.4%**     |
|                                                              |             |                |              |         |                        |                |                |               |               |               |
| [YOLOv5-N6（r6.1）](https://github.com/ultralytics/yolov5)     | **3.2**     | **18.4**       | 1280         | **123** | - / 36.0%              | -              | -              | -             | -             | -             |
| [YOLOv5-S6（R6.1）](https://github.com/ultralytics/yolov5)     | 12.6        | 67.2           | 1280         | 122     | - / 44.8%              | -              | -              | -             | -             | -             |
| [YOLOv5-M6（r6.1）](https://github.com/ultralytics/yolov5)     | 35.7        | 200.0          | 1280         | 90      | - / 51.3%              | -              | -              | -             | -             | -             |
| [YOLOv5-L6（r6.1）](https://github.com/ultralytics/yolov5)     | 76.8        | 445.6          | 1280         | 63      | - / 53.7%              | -              | -              | -             | -             | -             |
| [YOLOv5-X6（r6.1）](https://github.com/ultralytics/yolov5)     | 140.7       | 839.2          | 1280         | 38      | - /**55.0%**           | -              | -              | -             | -             | -             |
|                                                              |             |                |              |         |                        |                |                |               |               |               |
| [YOLOR-P6](https://github.com/WongKinYiu/yolor)              | **37.2**    | **325.6**      | 1280         | **76**  | 53.9% / 53.5%          | 71.4%          | 58.9%          | 36.1%         | 57.7%         | 65.6%         |
| [YOLOR-W6](https://github.com/WongKinYiu/yolor)              | 79.8        | 453.2          | 1280         | 66      | 55.2% / 54.8%          | 72.7%          | 60.5%          | 37.7%         | 59.1%         | 67.1%         |
| [YOLOR-E6](https://github.com/WongKinYiu/yolor)              | 115.8       | 683.2          | 1280         | 45      | 55.8% / 55.7%          | 73.4%          | 61.1%          | 38.4%         | 59.7%         | 67.7%         |
| [YOLOR-D6](https://github.com/WongKinYiu/yolor)              | 151.7       | 935.6          | 1280         | 34      | **56.5% / 56.1%**      | **74.1%**      | **61.9%**      | **38.9%**     | **60.4%**     | **68.7%**     |
|                                                              |             |                |              |         |                        |                |                |               |               |               |
| [YOLOv7-W6](https://github.com/WongKinYiu/yolov7)            | **70.4**    | **360.0**      | 1280         | **84**  | 54.9% / 54.6%          | 72.6%          | 60.1%          | 37.3%         | 58.7%         | 67.1%         |
| [YOLOv7-E6](https://github.com/WongKinYiu/yolov7)            | 97.2        | 515.2          | 1280         | 56      | 56.0% / 55.9%          | 73.5%          | 61.2%          | 38.0%         | 59.9%         | 68.4%         |
| [YOLOv7-D6](https://github.com/WongKinYiu/yolov7)            | 154.7       | 806.8          | 1280         | 44      | 56.6% / 56.3%          | 74.0%          | 61.8%          | 38.8%         | 60.1%         | 69.5%         |
| [YOLOv7-E6E](https://github.com/WongKinYiu/yolov7)           | 151.7       | 843.2          | 1280         | 36      | **56.8% / 56.8%**      | **74.4%**      | **62.1%**      | **39.3%**     |               |               |

|模型|尺寸  <br>（像素）|mAPval  <br>50-95|速度  <br>CPU ONNX  <br>（毫秒）|速度  <br>A100 TensorRT  <br>（毫秒）|params  <br>(M)|FLOPs  <br>(B)|
|---|---|---|---|---|---|---|
|[YOLOv8n](https://github.com/ultralytics/assets/releases/download/v8.3.0/yolov8n.pt)|640|37.3|80.4|0.99|3.2|8.7|
|[YOLOv8s](https://github.com/ultralytics/assets/releases/download/v8.3.0/yolov8s.pt)|640|44.9|128.4|1.20|11.2|28.6|
|[YOLOv8m](https://github.com/ultralytics/assets/releases/download/v8.3.0/yolov8m.pt)|640|50.2|234.7|1.83|25.9|78.9|
|[YOLOv8l](https://github.com/ultralytics/assets/releases/download/v8.3.0/yolov8l.pt)|640|52.9|375.2|2.39|43.7|165.2|
|[YOLOv8x](https://github.com/ultralytics/assets/releases/download/v8.3.0/yolov8x.pt)|640|53.9|479.1|3.53|68.2|257.8|

|模型|尺寸  <br>（像素）|mAPval  <br>50-95|mAPval  <br>50|params  <br>(M)|FLOPs  <br>(B)|
|---|---|---|---|---|---|
|[YOLOv9t](https://github.com/ultralytics/assets/releases/download/v8.3.0/yolov9t.pt)|640|38.3|53.1|2.0|7.7|
|[YOLOv9s](https://github.com/ultralytics/assets/releases/download/v8.3.0/yolov9s.pt)|640|46.8|63.4|7.2|26.7|
|[YOLOv9m](https://github.com/ultralytics/assets/releases/download/v8.3.0/yolov9m.pt)|640|51.4|68.1|20.1|76.8|
|[YOLOv9c](https://github.com/ultralytics/assets/releases/download/v8.3.0/yolov9c.pt)|640|53.0|70.2|25.5|102.8|
|[YOLOv9e](https://github.com/ultralytics/assets/releases/download/v8.3.0/yolov9e.pt)|640|55.6|72.8|58.1|192.5|

|模型|尺寸  <br>（像素）|mAPval  <br>50-95|速度  <br>CPU ONNX  <br>（毫秒）|速度  <br>T4TensorRT10  <br>(ms)|params  <br>(M)|FLOPs  <br>(B)|
|---|---|---|---|---|---|---|
|[YOLO11n](https://github.com/ultralytics/assets/releases/download/v8.3.0/yolo11n.pt)|640|39.5|56.1 ± 0.8|1.5 ± 0.0|2.6|6.5|
|[YOLO11s](https://github.com/ultralytics/assets/releases/download/v8.3.0/yolo11s.pt)|640|47.0|90.0 ± 1.2|2.5 ± 0.0|9.4|21.5|
|[YOLO11m](https://github.com/ultralytics/assets/releases/download/v8.3.0/yolo11m.pt)|640|51.5|183.2 ± 2.0|4.7 ± 0.1|20.1|68.0|
|[YOLO11l](https://github.com/ultralytics/assets/releases/download/v8.3.0/yolo11l.pt)|640|53.4|238.6 ± 1.4|6.2 ± 0.1|25.3|86.9|
|[YOLO11x](https://github.com/ultralytics/assets/releases/download/v8.3.0/yolo11x.pt)|640|54.7|462.8 ± 6.7|11.3 ± 0.2|56.9|194.9|

|模型|尺寸  <br>（像素）|mAPval  <br>50-95|速度  <br>CPU ONNX  <br>（毫秒）|速度  <br>T4 TensorRT  <br>(ms)|params  <br>(M)|FLOPs  <br>(B)|比较  <br>(mAP/Speed)|
|---|---|---|---|---|---|---|---|
|[YOLO12n](https://github.com/ultralytics/assets/releases/download/v8.3.0/yolo12n.pt)|640|40.6|-|1.64|2.6|6.5|+2.1%/-9%（与 YOLOv10n 相比）|
|[YOLO12s](https://github.com/ultralytics/assets/releases/download/v8.3.0/yolo12s.pt)|640|48.0|-|2.61|9.3|21.4|+0.1%/+42%（与 RT-DETRv2 相比）|
|[YOLO12m](https://github.com/ultralytics/assets/releases/download/v8.3.0/yolo12m.pt)|640|52.5|-|4.86|20.2|67.5|+1.0%/-3%（与 YOLO11m 相比）|
|[YOLO12l](https://github.com/ultralytics/assets/releases/download/v8.3.0/yolo12l.pt)|640|53.7|-|6.77|26.4|88.9|+0.4%/-8%（与 YOLO11l 相比）|
|[YOLO12x](https://github.com/ultralytics/assets/releases/download/v8.3.0/yolo12x.pt)|640|55.2|-|11.79|59.1|199.0|+0.6%/-4%（与 YOLO11x 相比）|


有的是FLOPS(G)，有的是FLOPS(B)， 这到底是G大还是B大？

查了一下：
1. **M (Mega)** 相比于 **Million**：
    
    - 1M (Mega) 在计算机科学中等于 ( 2^{20} )（即 1,048,576）字节。
    - 1 Million 等于 ( 10^6 )（即 1,000,000）。
    - 因此，1M (Mega) 在数字上略大于 1 Million。
2. **G (Giga)** 相比于 **Billion**：
    
    - 1G (Giga) 在计算机科学中等于 ( 2^{30} )（即 1,073,741,824）字节。
    - 1 Billion 等于 ( 10^9 )（即 1,000,000,000）。
    - 1G (Giga) 在数字上略大于 1 Billion。
3. **T (Tera)** 相比于 **Trillion**：
    
    - 1T (Tera) 在计算机科学中等于 ( 2^{40} )（即 1,099,511,627,776）字节。
    - 1 Trillion 等于 ( 10^{12} )（即 1,000,000,000,000）。
    - 1T (Tera) 在数字上略大于 1 Trillion。
4. **P (Peta)** 相比于 **Quadrillion**（没有常用的 “Pillion” 词汇）：
    
    - 1P (Peta) 在计算机科学中等于 ( 2^{50} )（即 1,125,899,906,842,624）字节。
    - 1 Quadrillion（在美国和现代英语中的千万亿）等于 ( 10^{15} )（即 1,000,000,000,000,000）。
    - 1P (Peta) 在数字上略大于 1 Quadrillion。

好吧，算一边儿大，白费了我几个脑细胞。