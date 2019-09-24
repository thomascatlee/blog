title: "ceph的arm移植"
date: 2018-11-09 10:57:45 +0800
author: me
tags:
    - 技术杂记
    - 随笔
    - 试验田
preview: 断断续续搞了挺久了，11月终于有几天能连续投入，解决掉~

---

海思的工具链有点旧，不支持C++的一些高级特性，因此，我们只能选择ceph的低版本来做移植；也因为ceph的版本较低，导致了一系列的问题。
首先是CMake，因为要交叉编译，要指定工具链，头文件、库文件等等一系列目录，之前讲boost编译的时候有提到一点，这里直接把最后的文件贴一下：

```
set(CMAKE_SYSTEM_NAME Linux)
set(CMAKE_SYSTEM_PROCESSOR arm)

set(CMAKE_STAGING_PREFIX /home/lx/platform3798C/pub/hi3798cv200/rootbox/usr)
set(CMAKE_SYSROOT /home/lx/platform3798C/tools/linux/toolchains/arm-histbv310-linux/target)
#set(CMAKE_SYSROOT /home/lx/platform3798C/pub/hi3798cv200/rootbox)

#variable_watch(CMAKE_C_FLAGS)

set(CMAKE_PREFIX_PATH /home/lx/platform3798C/pub/hi3798cv200/rootbox)

set(CMAKE_LIBRARY_PATH ${CMAKE_LIBRARY_PATH} /home/lx/platform3798C/pub/hi3798cv200/rootbox/lib)
set(CMAKE_LIBRARY_PATH ${CMAKE_LIBRARY_PATH} /home/lx/platform3798C/pub/hi3798cv200/rootbox/usr/lib)
set(CMAKE_LIBRARY_PATH ${CMAKE_LIBRARY_PATH} /home/lx/platform3798C/pub/hi3798cv200/hi3798cv2dmo/obj/source/rootfs/udev/udev-167/libudev/.libs)
set(CMAKE_LIBRARY_PATH ${CMAKE_LIBRARY_PATH} /home/lx/platform3798C/pub/hi3798cv200/hi3798cv2dmo/obj/source/component/zlib/release/lib)
set(CMAKE_LIBRARY_PATH ${CMAKE_LIBRARY_PATH} /home/lx/platform3798C/pub/hi3798cv200/hi3798cv2dmo/obj/source/component/openssl/release/lib)


set(CMAKE_INCLUDE_PATH ${CMAKE_INCLUDE_PATH} /home/lx/platform3798C/pub/hi3798cv200/rootbox/usr/include)


set(CMAKE_C_FLAGS -I/home/lx/platform3798C/pub/hi3798cv200/rootbox/usr/include)
set(CMAKE_CXX_FLAGS ${CMAKE_C_FLAGS})

set(CMAKE_LINKER_FLAGS -L/home/lx/platform3798C/pub/hi3798cv200/rootbox/usr/lib -L/home/lx/platform3798C/pub/hi3798cv200/rootbox/lib)


set(tools /home/lx/platform3798C/tools/linux/toolchains/arm-histbv310-linux)
set(CMAKE_C_COMPILER ${tools}/bin/arm-histbv310-linux-gcc)
set(CMAKE_CXX_COMPILER ${tools}/bin/arm-histbv310-linux-g++)

set(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM NEVER)
set(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_PACKAGE ONLY)

set(ALLOCATOR libc)

set(ZLIB_LIBRARIES /home/lx/platform3798C/pub/hi3798cv200/rootbox/usr/lib)

set(PYTHON_LIBRARIES /home/lx/platform3798C/pub/hi3798cv200/rootbox/usr/lib)
set(PYTHON_INCLUDE_DIRS /home/lx/platform3798C/pub/hi3798cv200/rootbox/usr/include)

set(NSS_INCLUDE_DIRS /home/lx/platform3798C/pub/hi3798cv200/rootbox/usr/include)

#set(NSS_LIBRARIES /home/lx/platform3798C/pub/hi3798cv200/rootbox/lib)
#set(NSS_INCLUDE_DIRS /home/lx/platform3798C/tools/linux/toolchains/arm-histbv310-linux/target/usr/include)

set(OFED_PREFIX /home/lx/platform3798C/pub/hi3798cv200/rootbox/usr)
```
具体的各行含义就不细说了，CMake的手册上都能查到。

这个文件可以适用于一系列的基于CMake的交叉编译：```cmake -D CMAKE_TOOLCHAIN_FILE=../hisi.cmake```生成Makefile。有一些实在找不到的奇形怪状依赖，就在CMakefile.txt里面把对应的特性关掉，CMake就不会检查了。

包括boost还有rocksdb等都是这样编译出来的。

因为编译器版本的问题，我最后用的的是ceph-12.2.9，其中的ceph-mgr适用于python2，而我用的python3，因此编译过程中还需要解决py2到py3的移植问题。主要是几个API的替换，
PyString_FromString替换成PyUnicode_FromString，PyString_AsString替换成PyUnicode_AsUTF8，PyString_Check替换成PyUnicode_Check，pyInt_FromLong替换成PyLong_FromLong。另外就是几处char换成wchar_t。还有py3的模块初始化写法也不一样，以ceph_logger_module为例，需要增加：
```
static PyModuleDef ceph_logger_module = {
    PyModuleDef_HEAD_INIT,
    "ceph_logger",
    nullptr,
    -1,
    log_methods,
  };
```
然后```auto py_logger = Py_InitModule("ceph_logger", log_methods);``` 改成 ```auto py_logger = PyModule_Create(&ceph_logger_module);```
ceph-mgr就能成功编译。

有一点奇怪的是，不知道是CMake哪里没有设置对，链接时候会没link到zlib的库，折腾了两次没搞定，就直接修改build_dir/src/CMakeFiles/xxx模块/link.txt，在最后手工加上-lz。类似的还有libssl、libudev和libcrypto找不到，都是这样手工直接改了。

还有就是编译python的C扩展时，因为是cross compile，所以ceph-12.2.9中的setup.py需要修改：
```
def get_python_flags():
    cflags = {'I': [], 'extras': []}
    ldflags = {'l': [], 'L': [], 'extras': []}

    cflag_str = "-I/home/lx/ceph-12.2.9/armbuild/include -I/home/lx/platform3798C/pub/hi3798cv200/rootbox/usr/include -I/home/lx/platform3798C/pub/hi3798cv200/rootbox/usr/include/python3.5m"
    ldflag_str =  "-L/home/lx/ceph-12.2.9/armbuild/lib -L/home/lx/platform3798C/pub/hi3798cv200/rootbox/usr/lib -L/home/lx/platform3798C/pub/hi3798cv200/rootbox/lib -lcurl -lexpat -lceph-common -lboost_thread -lboost_chrono -lboost_atomic -lboost_random -lboost_system -lboost_program_options -lboost_date_time -lboost_iostreams -lboost_regex -lblkid -lssl -lsmime3 -lnss3 -lnssutil3 -lplds4 -lplc4 -lnspr4 -lstdc++"

    if os.environ.get('VIRTUAL_ENV', None):
        python = "python"
    else:
        python = 'python' + str(sys.version_info.major) + '.' + str(sys.version_info.minor)

    python_config = python + '-config'

    for cflag in cflag_str.split():
        if cflag.startswith('-I'):
            cflags['I'].append(cflag.replace('-I', ''))
        else:
            cflags['extras'].append(cflag)

    for ldflag in ldflag_str.split():
        if ldflag.startswith('-l'):
            ldflags['l'].append(ldflag.replace('-l', ''))
        if ldflag.startswith('-L'):
            ldflags['L'].append(ldflag.replace('-L', ''))
        else:
            ldflags['extras'].append(ldflag)

    return {
        'cflags': cflags,
        'ldflags': ldflags
    }

```
直接手工指定了CFLAGS和LDFLAGS的内容，就可以编译过了。


