---
title: ffmpeg的一些杂记
date: 2023-06-09 18:09:03 +0800
author: me
tags:
    - 
---

## 格式转换
### 转为MP4
ffmpeg -i input.ts -codec copy -f mp4 output.mp4
### 转为fMP4
ffmpeg -i input.mp4 -movflags frag_keyframe+empty_moov output.mp4
### 转为HLS（fMP4格式）
ffmpeg -i input.mp4 -codec copy -map 0 -f hls -hls_time 10 -hls_flags delete_segments+append_list+split_by_time -hls_segment_type fmp4 -hls_list_size 10 -hls_playlist_type vod stream.m3u8
