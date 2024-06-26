---
title: 移植esp-Drone到pyDrone硬件
date: 2024-06-20 14:05:06 +0800
author: wildcat
tags:
  - Drone
  - ESP32
---
两者的软硬件存在某种程度上的渊源，因此移植难度不大，主要就是管脚的定义以及传感器驱动。另外就是因为两者的motor旋转方向不一样，motor控制部分要相应的修改。
先要对飞行器坐标有个简单的概念：
![](移植esp-Drone到pyDrone硬件.md_Attachments/Pasted%20image%2020240620154139.png)
Roll 横滚角，控制飞行器翻滚运动。负表示左，正表示右。 
Pitch 俯仰角，控制飞行器俯仰运动。负表示俯（向前），正表示仰（向后）。 
Yaw 偏航角，控制飞行器自转运动。负表示逆时针自转（左偏），正表示顺时针自转（右偏）。 

对四轴飞行器，靠控制四个motor的转速，来实现roll、pitch、yaw三种运动状态的变化。
对照espDrone的图，roll和pitch都比较直观，（M1，M2）/（M3、M4）影响roll；（M1，M4）/（M2，M3）影响pitch；yaw则是受螺旋桨旋转的反作用力影响，即与螺旋桨旋转方向相反。
![espDrone的螺旋桨方向](移植esp-Drone到pyDrone硬件.md_Attachments/Pasted%20image%2020240620153606.png)
espDrone的M1、M3逆时针旋转，对机身产生顺时针旋转的影响；M2、M4顺时针旋转，对机身产生逆时针旋转的影响；而pyDrone则正好相反。因此要对espDrone的motor控制代码部分做一些修改。原版的espDrone代码如下：
```
void powerDistribution(const control_t *control)
{
  #ifdef QUAD_FORMATION_X
    int16_t r = control->roll / 2.0f;
    int16_t p = control->pitch / 2.0f;
    motorPower.m1 = limitThrust(control->thrust - r + p + control->yaw);
    motorPower.m2 = limitThrust(control->thrust - r - p - control->yaw);
    motorPower.m3 =  limitThrust(control->thrust + r - p + control->yaw);
    motorPower.m4 =  limitThrust(control->thrust + r + p - control->yaw);
  #else // QUAD_FORMATION_NORMAL
  ...

```
可以看出，原版espDrone要控制机身顺时针旋转，则增大M1、M2的转速；而pyDrone的M1、M2顺时针旋转，对机身产生的是逆时针旋转的影响，要控制机身顺时针旋转，应该是减小M1、M2的转速。修改一下control->yaw的符号就可以了。

```
void powerDistribution(const control_t *control)
{
  #ifdef QUAD_FORMATION_X
    int16_t r = control->roll / 2.0f;
    int16_t p = control->pitch / 2.0f;
    motorPower.m1 = limitThrust(control->thrust - r + p - control->yaw);
    motorPower.m2 = limitThrust(control->thrust - r - p + control->yaw);
    motorPower.m3 =  limitThrust(control->thrust + r - p - control->yaw);
    motorPower.m4 =  limitThrust(control->thrust + r + p + control->yaw);
  #else // QUAD_FORMATION_NORMAL
...
```
