---
title: "补充一些ceph的移植问题"
date: 2018-12-07 10:15:05 +0800
author: me
tags:
    - 技术杂记
    - 随笔
    - 试验田
preview: 打个补丁

---

​	之前讲过ceph往arm上的移植，其实还有一点不完善的地方，最后的make install还是走了一些弯路，最后直接修改原始的CMakeLists.txt，重新编译完事。主要是几点问题：
1. 安装路径的问题，交叉编译时，似乎CMAKE_INSTALL_PREFIX没能从配置文件中有效的传递下去，cmake的文档中用DESTDIR来指定安装路径，但是意外的和pybind中的cython组件安装有了重复，让路径变得很长，修改src/pybind/CMakeLists.txt，在加入子目录依赖之前：
```
  if(CMAKE_STAGING_PREFIX)
    set(CMAKE_INSTALL_PREFIX "${CMAKE_STAGING_PREFIX}")
  endif(CMAKE_STAGING_PREFIX)
```
从交叉编译的配置文件中，获得CMAKE_STAGING_PREFIX，给CMAKE_INSTALL_PREFIX赋值，这样python的几个安装路径问题就解决。
2. cython的交叉编译问题，修改cmake/module/Distutils.cmake，仿照distutils_add_cython_module的写法，在distutils_install_cython_module中增加LDSHARED的环境变量定义。
3. 默认编译出的是RelWithInfo，带着庞大的符号信息；在配置文件中加入```set(CMAKE_BUILD_TYPE Release)```，编译出的就不带符号信息了。
