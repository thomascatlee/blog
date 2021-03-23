title: "FFMPEG编码H.264"
date: 2018-01-10 19:00:00 +0800
author: me
tags:
    - 视频编码
    - RTP
    - 试验田
preview: 摄像头采集，H.264编码，并RTP发送。因为用了FFMPEG，所以很简单。

---

​	FFMPEG用来做一些简单的验证或者是原型，真是好用。因为用了FFMPEG 3，所以接口上和网上搜到的一些代码有一些出入，FFMPEG也没有太好的文档，Show me the code......

​	直接上代码吧：

```c
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

extern "C"
{
#include "libavutil/opt.h"
#include "libavcodec/avcodec.h"
#include "libavformat/avformat.h"
#include "libavutil/imgutils.h"
#include "libavdevice/avdevice.h"
#include "libswscale/swscale.h"
};


void SaveFrame(AVFrame *pFrame)
{
	FILE *fp;
	fopen_s(&fp, "save.yuv", "ab");

	int frameSize = pFrame->width*pFrame->height * 3 / 2;

    int ret = fwrite(pFrame->data[0], 1, frameSize, fp);

    fclose(fp);
}



int main(int argc, char* argv[])
{
	AVFormatContext* pInputFormatContext = NULL;
	AVCodec* pInputCodec = NULL;
	AVCodecContext* pInputCodecContex = NULL;

	AVFormatContext *pOutputFormatContext = NULL;
	AVCodecContext* pOutCodecContext = NULL;
	AVCodec* pOutCodec = NULL;
	AVStream* pOutStream = NULL;

	av_register_all();

	avformat_network_init();

	avdevice_register_all();

	const char* out_file = "rtp://192.165.53.31:12345";

	int ret, i;
	int videoindex = -1;

	//输入（Input）
	pInputFormatContext = avformat_alloc_context();
	AVDictionary* options = NULL;
	AVInputFormat *ifmt = av_find_input_format("vfwcap");
	av_dict_set(&options, "framerate", "25", 0);
	//av_dict_set(&options,"video_size","1440x900",0);

	if (avformat_open_input(&pInputFormatContext, 0, ifmt, &options) != 0)
	{
		printf("Couldn't open input stream.\n");
		return -1;
	}

	if ((ret = avformat_find_stream_info(pInputFormatContext, 0)) < 0)
	{
		printf("Failed to retrieve input stream information");
		return -1;
	}

	for (i = 0; i < pInputFormatContext->nb_streams; i++)
		if (pInputFormatContext->streams[i]->codecpar->codec_type == AVMEDIA_TYPE_VIDEO)
		{
			videoindex = i;
			break;
		}

	if (videoindex == -1)
	{
		printf("Didn't find a video stream.\n");
		return -1;
	}


    // Get a pointer to the codec context for the video stream
    const AVCodecParameters *codecpar = pInputFormatContext->streams[videoindex]->codecpar;

    // Find the decoder for the video stream
	pInputCodec = avcodec_find_decoder(codecpar->codec_id);
	if (pInputCodec == NULL)
	{
		printf("Codec not found.\n");
		return -1;
	}

    // Copy context
    pInputCodecContex = avcodec_alloc_context3(pInputCodec);

    if (0 != avcodec_parameters_to_context(pInputCodecContex, codecpar)) {
        printf("avcodec_parameters_to_context error");
        return -1;
    }


	//打开解码器
	if (avcodec_open2(pInputCodecContex, pInputCodec, NULL)<0)
	{
		printf("Could not open codec.\n");
		return -1;
	}

	//为一帧图像分配内存
	AVFrame *pFrame;
	AVFrame *pFrameYUV;
	pFrame = av_frame_alloc();
	pFrameYUV = av_frame_alloc();//为转换来申请一帧的内存(把原始帧->YUV)

	pFrameYUV->format = AV_PIX_FMT_YUV420P;
	pFrameYUV->width = pInputCodecContex->width;
	pFrameYUV->height = pInputCodecContex->height;
	unsigned char *out_buffer = (unsigned char *)av_malloc(av_image_get_buffer_size(AV_PIX_FMT_YUV420P, pInputCodecContex->width, pInputCodecContex->height, 1));


	av_image_fill_arrays(pFrameYUV->data, pFrameYUV->linesize, out_buffer, AV_PIX_FMT_YUV420P, pInputCodecContex->width, pInputCodecContex->height, 1);

	struct SwsContext *img_convert_ctx;
	img_convert_ctx = sws_getContext(pInputCodecContex->width, pInputCodecContex->height, pInputCodecContex->pix_fmt, pInputCodecContex->width, pInputCodecContex->height, AV_PIX_FMT_YUV420P, SWS_BICUBIC, NULL, NULL, NULL);
	//=============================================================================================



	avformat_alloc_output_context2(&pOutputFormatContext, NULL, "rtp", out_file); //RTP
	if (!pOutputFormatContext) {
		printf("Could not create output context\n");
		ret = AVERROR_UNKNOWN;
		return -1;
	}
	//Open output URL 打开输入文件 返回AVIOContext(pFormatCtx->pb)
	if (avio_open(&pOutputFormatContext->pb, out_file, AVIO_FLAG_WRITE) < 0) {
		printf("Failed to open output file! \n");
		return -1;
	}

	pOutCodec = avcodec_find_encoder(AV_CODEC_ID_H264);
	if (!pOutCodec) {
		printf("Can not find encoder! \n");
		return -1;
	}

    // Copy context
    pOutCodecContext = avcodec_alloc_context3(pOutCodec);

	//像素格式,
	pOutCodecContext->pix_fmt = AV_PIX_FMT_YUV420P;
	//size
	pOutCodecContext->width = pInputCodecContex->width;
	pOutCodecContext->height = pInputCodecContex->height;
	//目标码率
	pOutCodecContext->bit_rate = 400000;



	//每25帧插入一个I帧,I帧越小视频越小
	pOutCodecContext->gop_size = 25;
	//Optional Param B帧
	pOutCodecContext->max_b_frames = 1;

	/* frames per second */
	pOutCodecContext->time_base.num = 1;
	pOutCodecContext->time_base.den = 25;

	pOutCodecContext->framerate.num = 25;
	pOutCodecContext->framerate.den = 1;

	pOutCodecContext->thread_type = 1;


	av_dump_format(pOutputFormatContext, 0, out_file, 1);

	//    //H.264
	if (pOutCodecContext->codec_id == AV_CODEC_ID_H264) {
		av_opt_set(pOutCodecContext->priv_data, "preset", "slow", 0);
		av_opt_set(pOutCodecContext->priv_data, "tune", "zerolatency", 0);
		av_opt_set(pOutCodecContext->priv_data, "x264opts", "crf=26:vbv-maxrate=728:vbv-bufsize=3640:keyint=25", 0);
	}

	if (avcodec_open2(pOutCodecContext, pOutCodec, NULL) < 0)
	{
		printf("Failed to open encoder! \n");
		return -1;
	}

	//创建输出流,AVStream  与  AVCodecContext一一对应
	pOutStream = avformat_new_stream(pOutputFormatContext, pOutCodec);
	if (pOutStream == NULL)
	{
		printf("Failed create pOutStream!\n");
		return -1;
	}

	avcodec_parameters_from_context(pOutStream->codecpar, pOutCodecContext);

	//
	av_dump_format(pOutputFormatContext, 0, out_file, 1);

	av_opt_set(pOutputFormatContext->priv_data, "payload_type", "98", 0);
	//	av_opt_set(pOutputFormatContext->priv_data, "rtpflags", "h264_mode0", 0);

	//Write File Header
	int r = avformat_write_header(pOutputFormatContext, NULL);
	if (r<0)
	{
		printf("Failed write header!\n");
		return -1;
	}

    //打印SDP信息, 该信息可用于Rtp流接收解码
//    av_sdp_create(pOutputFormatContext, 1, sdp, sizeof(sdp));

	AVPacket *packet = (AVPacket *)av_malloc(sizeof(AVPacket));
	int got_picture;

	AVPacket pkt;
	int picture_size = av_image_get_buffer_size(pOutCodecContext->pix_fmt, pOutCodecContext->width, pOutCodecContext->height, 1);
	av_new_packet(&pkt, picture_size);

	int frame_index = 0;
	while ((av_read_frame(pInputFormatContext, packet)) >= 0)
	{
		if (packet->stream_index == videoindex)
		{
			//真正解码,packet to pFrame
			got_picture = avcodec_send_packet(pInputCodecContex, packet);
            if(got_picture < 0)
                break;

            int ret_frame = avcodec_receive_frame(pInputCodecContex, pFrame);

            if (ret_frame < 0)
                continue;

			sws_scale(img_convert_ctx, (const unsigned char* const*)pFrame->data, pFrame->linesize, 0, pInputCodecContex->height, pFrameYUV->data, pFrameYUV->linesize);
			pFrameYUV->pts = frame_index;
			frame_index++;

			int ret;
			//真正编码

			//SaveFrame(pFrameYUV);
            //continue;

			ret = avcodec_send_frame(pOutCodecContext, pFrameYUV);

			if (ret < 0) {
				printf("Failed to encode! \n");
				return -1;
			}

			while (ret >= 0)
			{
                ret = avcodec_receive_packet(pOutCodecContext, &pkt);

                if (ret == AVERROR(EAGAIN) || ret == AVERROR_EOF)
                    break;

				ret = av_interleaved_write_frame(pOutputFormatContext, &pkt);

				if (ret < 0) {
					printf("Error muxing packet\n");
					break;
				}

				av_packet_unref(&pkt);
			}

		}
		av_packet_unref(packet);
	}

	//Write file trailer
	av_write_trailer(pOutputFormatContext);

	sws_freeContext(img_convert_ctx);

	av_free(out_buffer);
	av_free(pFrameYUV);
	av_free(pFrame);

    avcodec_free_context(&pInputCodecContex);
	avformat_close_input(&pInputFormatContext);

    avcodec_free_context(&pOutCodecContext);
	avformat_free_context(pOutputFormatContext);

	return 0;
}

```

