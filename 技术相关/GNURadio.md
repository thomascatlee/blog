---
title: GNURadio
date: 2023-05-24 13:33:11 +0800
author: wildcat
tags: []
---
## 安装使用
安装建议直接用radioconda的安装包，安装完成后，GNURadio的路径在radioconda/Library下，python依赖包在radioconda/Lib/site-packages/

从菜单可以打开GNURadio Companion，图形化的使用GNURadio的各个组件。

要自己开发组件，需要进入Conda环境下，
```
gr_modtool newmod xxxx
cd gr-xxxx
gr_modtool add abcd
gr_modtool makeyaml abcd
mkdir build
cd build
cmake -G "Visual Studio 14 2015 Win64" ../
```
生成组件目录，Python调用，block的代码和yaml配置文件，以及VS2015的工程。

block有参数需要交互的话，要修改`abcd_python.cc`
```
       .def(py::init(&saveaac::make),
			py::arg("filename"),
			py::arg("n_channels"),
			py::arg("sample_rate"),
			D(saveaac,make)
```
以py::arg的形式来定义参数；更详细的用法参考pybind11的文档。
这是土方法，正常的方法是修改了定义头文件后，执行`gr_modtool bind abcd`重新生成`abcd_python.cc`，但是我重新生成的不好使。使用组件的时候，会报错`object has no attribute 'to_basic_block'`，把`gr::sync_block gr::block gr::basic_block`加上就对了。可以先把最开始生成的abcd_python.cc留着，对照着改。


block的具体实现在abcd_impl.cc中，只要处理好构造函数，写好work方法，很容易实现功能。

举个例子：saveaac_impl.h
```
/* -*- c++ -*- */
/*
 * Copyright 2022 lixin.
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

#ifndef INCLUDED_AACSINK_SAVEAAC_IMPL_H
#define INCLUDED_AACSINK_SAVEAAC_IMPL_H

#include <gnuradio/aacsink/saveaac.h>

#include "faac.h"

namespace gr {
namespace aacsink {

class saveaac_impl : public saveaac
{
private:
    // Nothing to declare in this block.

	int sampleRate;
	int channels;
	unsigned long nInputSamples;
	unsigned long nUnusedSamples;
	unsigned long nMaxOutputBytes;

	std::vector<float> pcmBuffer;
	std::vector<float> tmpBuffer;
	std::vector<unsigned char> aacBuffer;

	FILE* aacfp;
	faacEncHandle hEncoder;
	faacEncConfigurationPtr pEncConf;

	gr::thread::mutex aac_mutex;

public:
    saveaac_impl(const char* filename, int n_channels, unsigned int sample_rate);
    ~saveaac_impl();

    // Where all the action really happens
    int work(int noutput_items,
             gr_vector_const_void_star& input_items,
             gr_vector_void_star& output_items);
};

} // namespace aacsink
} // namespace gr

#endif /* INCLUDED_AACSINK_SAVEAAC_IMPL_H */

```
saveaac_impl.cc
```
/* -*- c++ -*- */
/*
 * Copyright 2022 lixin.
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

#include "saveaac_impl.h"
#include <gnuradio/io_signature.h>
#include <gnuradio/logger.h>
#include <gnuradio/prefs.h>
#include <fcntl.h>
#include <stdio.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <cctype>
#include <sstream>
#include <stdexcept>
#include <string>


namespace gr {
namespace aacsink {

saveaac::sptr saveaac::make(const char* filename,
							int n_channels,
							unsigned int sample_rate) { 
	return gnuradio::make_block_sptr<saveaac_impl>(
	filename, n_channels, sample_rate); 
}


/*
 * The private constructor
 */
saveaac_impl::saveaac_impl(const char* filename,
							int n_channels,
							unsigned int sample_rate)
    : gr::sync_block("saveaac",
                     gr::io_signature::make(
                         1 /* min inputs */, n_channels /* max inputs */, sizeof(float)),
                     gr::io_signature::make(0, 0, 0)),
	hEncoder(nullptr),
	pEncConf(nullptr)
{
	sampleRate = sample_rate;
	channels = n_channels;

	aacfp = fopen(filename, "wb");
	if (aacfp == NULL)
	{
		printf("Can't open AAC file %s", filename);
	}

	hEncoder = faacEncOpen(sampleRate, channels, &nInputSamples, &nMaxOutputBytes);

	nUnusedSamples = 0;
	pcmBuffer.resize(nInputSamples);
	tmpBuffer.resize(nInputSamples);
	aacBuffer.resize(nMaxOutputBytes);

	pEncConf = faacEncGetCurrentConfiguration(hEncoder);

	pEncConf->inputFormat = FAAC_INPUT_FLOAT;
	pEncConf->outputFormat = 1;
	pEncConf->useTns = true;
	pEncConf->useLfe = false;
	pEncConf->aacObjectType = LOW;
	pEncConf->shortctl = SHORTCTL_NORMAL;
	pEncConf->quantqual = 100;
	pEncConf->bandWidth = 0;
	pEncConf->bitRate = 0;

	int nRet = faacEncSetConfiguration(hEncoder, pEncConf);
}

/*
 * Our virtual destructor.
 */
saveaac_impl::~saveaac_impl()
{

	int nRet;

	while ((nRet = faacEncEncode(hEncoder, NULL, 0, &aacBuffer[0], nMaxOutputBytes)) > 0)
	{
		fwrite(&aacBuffer[0], 1, nRet, aacfp);
	}

	if (hEncoder != NULL)
		int nRet = faacEncClose(hEncoder);	

	if (aacfp != NULL)
		fclose(aacfp);

}

int saveaac_impl::work(int noutput_items,
                       gr_vector_const_void_star& input_items,
                       gr_vector_void_star& output_items)
{
    auto in = (float**)(&input_items[0]);

	int n_in_chans = input_items.size();
	int nwritten;
	int errnum;
	int needSamples;
	int nRet;

	gr::thread::scoped_lock guard(aac_mutex); // hold mutex for duration of this block

	if ((!aacfp) || (n_in_chans < channels)) {                            // drop output on the floor
		return noutput_items;
	}

	if (nInputSamples > nUnusedSamples + (noutput_items * channels))
	{
		for (nwritten = 0; nwritten < noutput_items; nwritten++) {
			for (int chan = 0; chan < channels; chan++) {
				tmpBuffer[nUnusedSamples + nwritten + chan] = in[chan][nwritten] * 32768;
			}
		}

		nUnusedSamples += (noutput_items * channels);

		return noutput_items;
	}

	for (nwritten = 0; nwritten < nUnusedSamples; nwritten++) {
		pcmBuffer[nwritten] = tmpBuffer[nwritten];
	}

	needSamples = (nInputSamples - nUnusedSamples) / channels;

	for (nwritten = 0; nwritten < needSamples; nwritten++) {
		for (int chan = 0; chan < channels; chan++) {
			pcmBuffer[nUnusedSamples + nwritten + chan] = in[chan][nwritten] * 32768;
		}
	}

	nUnusedSamples = 0;
	for (nwritten = needSamples; nwritten < noutput_items; nwritten++) {
		for (int chan = 0; chan < channels; chan++) {
			tmpBuffer[nUnusedSamples + chan] = in[chan][nwritten] * 32768;
			nUnusedSamples ++;
		}
	}

	nRet = faacEncEncode(hEncoder, (int*)&pcmBuffer[0], nInputSamples, &aacBuffer[0], nMaxOutputBytes);

	if (nRet < 1)
	{
		printf("AAC Encoder error\n");
	}

	fwrite(&aacBuffer[0], 1, nRet, aacfp);





	return noutput_items;
}

} /* namespace aacsink */
} /* namespace gr */

```

编译通过后可以直接用解决方案里带的INSTALL来安装，但是需要手工修改一下安装路径，在`cmake_install.cmake`中，修改
```
if(NOT DEFINED CMAKE_INSTALL_PREFIX)
  set(CMAKE_INSTALL_PREFIX "D:/radioconda/Library")
endif()
```
也可以在INSTALL 工程的预定义时把`CMAKE_INSTALL_PREFIX`传进去。

这里有个小bug，就是最开始提到的Python依赖包位置，手工从Library/lib/site-packages/gnuradio下复制到Lib/site-packages/gnuradio下即可


## 报错处理

```
CMake Error at D:/radioconda/Library/lib/cmake/gnuradio/GrPybind.cmake:250 (message):
  Python bindings for burst_tagger.h are out of sync
Call Stack (most recent call first):
  python/bindings/CMakeLists.txt:46 (GR_PYBIND_MAKE_OOT)
```

进入工程文件夹 ,

输入 `gr_modtool bind burst_tagger`

其实大部分报错都是因为bindtool计算的hash值不一样导致，可以在执行成功后，手工的把hash值记下来，替代原xxx_python.cc中的hash值。因为发现gr_modtool有时会把原来的文件改乱，丢掉某些参数，导致编译时候对不上。然后专门搜了一下这个问题，发现官方提供了-u或`--update-hash-only`的选项来仅更新hash。这真是个悲伤的故事，我手工改了十几次。