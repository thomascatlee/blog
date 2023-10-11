---
title: "ceph的恢复"
date: 2018-12-14 16:58:28 +0800
author: me
tags:
    - 技术杂记
    - 随笔
    - 试验田
preview: ceph的状态一直不对，最后找到了问题......

---

之前ceph配置完后，可以正常mount和读写，就以为一切OK了，后来在检查状态时，发现pg一直处于奇怪的状态：
```
pg 1.2f is stuck undersized for 246646.646202, current state active+undersized+degraded, last acting [0]
```
undersize意味备份数量不足，因为我们配置的default是3个，现在只有一个，所以发生degraded，很好理解。往ceph放pg的时候，只会先写最小要求份数，我们配置的是1。等ceph空闲时候，才会复制到其他osd上。但是我们的系统，放置了几天，状态仍然不对，从来没进入recovery。
检查了好久，不知道为什么。今天看到[这篇](https://blog.csdn.net/chenwei8280/article/details/80785595)帖子，受到了启发。
```
root@lx-ubuntu:/home/lx/dropbear-2018.76# ceph osd tree
ID CLASS WEIGHT  TYPE NAME               STATUS REWEIGHT PRI-AFF
-1       5.37209 root default
-5       5.37209     host HI3798C_SDK_HW
 0   hdd 1.79070         osd.0               up  1.00000 1.00000
 1   hdd 1.79070         osd.1               up  1.00000 1.00000
 2   hdd 1.79070         osd.2               up  1.00000 1.00000
-7             0     host hisi2
-9             0     host hisi3
-2             0     host ubuntulx
```
host HI3798C_SDK_HW是什么鬼，三个osd都跑到同一个host下面去了。原来是三台设备的hostname都是HI3798C_SDK_HW，没改。分别改成hisi1、hisi2、hisi3，看一下map没有刷新，那就手动改吧。
```
osd crush add-bucket hisi1 host
ceph osd crush move hisi1 root=default
ceph osd crush set osd.1 1.79070 root=default host=hisi2
ceph osd crush set osd.2 1.79070 root=default host=hisi3
ceph osd crush set osd.0 1.79070 root=default host=hisi1
```
删除多余的
```
ceph osd crush remove ubuntulx
ceph osd crush remove HI3798C_SDK_HW
```
看一下现在的tree：
```
root@lx-ubuntu:/home/lx# ceph osd tree
ID CLASS WEIGHT  TYPE NAME      STATUS REWEIGHT PRI-AFF
-1       5.37209 root default
-2       1.79070     host hisi1
 0   hdd 1.79070         osd.0      up  1.00000 1.00000
-3       1.79070     host hisi2
 1   hdd 1.79070         osd.1      up  1.00000 1.00000
-7       1.79070     host hisi3
 2   hdd 1.79070         osd.2      up  1.00000 1.00000
```
看一下状态：
```
root@lx-ubuntu:/home/lx# ceph -s
  cluster:
    id:     70b9c6d6-8eb8-4afa-9920-bc488e45ab9f
    health: HEALTH_WARN
            Degraded data redundancy: 525701/801621 objects degraded (65.580%), 122 pgs degraded
            mon ubuntulx is low on available space

  services:
    mon: 1 daemons, quorum ubuntulx
    mgr: ubuntulx(active)
    mds: cephfs-1/1/1 up  {0=ubuntulx=up:active}
    osd: 3 osds: 3 up, 3 in

  data:
    pools:   2 pools, 200 pgs
    objects: 267.21k objects, 1.02TiB
    usage:   1.43TiB used, 3.94TiB / 5.37TiB avail
    pgs:     525701/801621 objects degraded (65.580%)
             121 active+recovery_wait+degraded
             78  active+clean
             1   active+recovering+degraded

  io:
    recovery: 4.66MiB/s, 1objects/s
```
开始同步了，跑一段时间看看。