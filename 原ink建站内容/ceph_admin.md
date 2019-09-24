title: "在x86+arm上部署ceph"
date: 2018-12-07 14:50:26 +0800
author: me
tags:
    - 技术杂记
    - 随笔
    - 试验田
preview: ceph移植完成后，在x86+arm上部署和配置

---
ceph在arm上能成功运行，不报告缺少库文件，说明移植正常了。
接下来需要手工配置ceph。x86上安装ceph-mon，ceph-mgr和ceph-mds，在arm上安装ceph-osd。

## ceph-mon

首先配置ceph-mon。用uuidgen生成fsid，然后编辑/etc/ceph/ceph/conf

```
[global]
fsid = 70b9c6d6-8eb8-4afa-9920-bc488e45ab9f
mon initial members = ubuntulx
mon host = 192.165.53.30
public network = 192.165.53.0/24
auth cluster required = cephx
auth service required = cephx
auth client required = cephx
osd journal size = 5120
osd pool default size = 3  # Write an object n times.
osd pool default min size = 1 # Allow writing n copies in a degraded state.
osd pool default pg num = 8
osd pool default pgp num = 8

osd max object name len = 256        #ext4对length有限制
osd max object namespace len = 64
osd crush chooseleaf type = 1

[osd.0]
host = 192.165.53.32

[osd.1]
host = 192.165.53.33

[osd.2]
host = 192.165.53.34

[mds.ubuntulx]
host = 192.165.53.30
```

ubuntulx是host name，在/etc/hosts中静态定义了：
```
192.165.53.30   ubuntulx
192.165.53.32   hisi1
192.165.53.33   hisi2
192.165.53.34   hisi3
192.165.53.37   tx11
```
默认情况下，/var/lib/ceph/mon/$cluster-$id存储monitor的数据，这里我们cluster为ceph，id为0，路径为/var/lib/ceph/mon/ceph-0。其他osd、mds、mgr等等都是这样的。

配置文件中指定了认证模式是cephx，因此需要配置用户的keyring。

为此集群创建密钥环、并生成监视器密钥。
```
ceph-authtool --create-keyring /tmp/ceph.mon.keyring --gen-key -n mon. --cap mon 'allow *'
```
生成管理员密钥环，生成 client.admin 用户并加入密钥环。
```
sudo ceph-authtool --create-keyring /etc/ceph/ceph.client.admin.keyring --gen-key -n client.admin --set-uid=0 --cap mon 'allow *' --cap osd 'allow *' --cap mds 'allow'
```
把 client.admin 密钥加入 ceph.mon.keyring 。
```
ceph-authtool /tmp/ceph.mon.keyring --import-keyring /etc/ceph/ceph.client.admin.keyring
```
用规划好的主机名、对应 IP 地址、和 FSID 生成一个监视器图，并保存为 /tmp/monmap 。
```
monmaptool --create --add {hostname} {ip-address} --fsid {uuid} /tmp/monmap
```
在监视器主机上分别创建数据目录。
```
sudo mkdir /var/lib/ceph/mon/{cluster-name}-{hostname}
```

用监视器图和密钥环组装守护进程所需的初始数据。
```
sudo -u ceph ceph-mon [--cluster {cluster-name}] --mkfs -i {hostname} --monmap /tmp/monmap --keyring /tmp/ceph.mon.keyring
```

启动监视器，在前台运行一下，看看有没有错误
```
sudo ceph-mon -i 0 -d
```

## ceph-mds
创建 MDS 数据目录：
```
mkdir -p /var/lib/ceph/mds/{cluster-name}-{id}
```
创建密钥环：
```
ceph-authtool --create-keyring /var/lib/ceph/mds/{cluster-name}-{id}/keyring --gen-key -n mds.{id}
```
导入密钥环并设置能力：
```
ceph auth add mds.{id} osd "allow rwx" mds "allow" mon "allow profile mds" -i /var/lib/ceph/mds/{cluster}-{id}/keyring
```
写进 ceph.conf，这里我们已经在之前配置monitor时写了
```
[mds.{id}]
host = {id}
```
手动启动守护进程，同样可以加-d先看一下是否有错误
```
ceph-mds --cluster {cluster-name} -i {id} -m {mon-hostname}:{mon-port} [-f]
```

## ceph-mgr
mgr是高版本ceph（12.x）开始的必须项，用于提供信息给外部的监测和运维系统。你也可以自己开发mgr插件，满足个性化的需求。
还是创建目录，配置认证等
```
ceph-authtool --create-keyring /var/lib/ceph/mgr/ceph-ubuntulx/keyring --gen-key -n mgr.ubuntulx
sudo ceph auth get-or-create mgr.ubuntulx mon 'allow profile mgr' osd 'allow *' mds 'allow *' -i /var/lib/ceph/mgr/ceph-ubuntulx/keyring
```

## ceph-osd
需要在arm上操作，为了方便直接把x86上的ceph.conf拿过来。
uuidgen生成id，对每个osd节点都要生成。
```
ceph osd create c70d4919-b0a1-4c33-bf58-3f74cdb2a29a 2
mkfs -t ext4 /dev/sda1
mkdir -p /var/lib/ceph/osd/ceph-2
mount -o user_xattr /dev/sda1 /var/lib/ceph/osd/ceph-2
ceph-osd -i 2 --mkfs --mkkey --osd-uuid c70d4919-b0a1-4c33-bf58-3f74cdb2a29a
ceph auth add osd.2 osd 'allow *' mon 'allow profile osd' -i /var/lib/ceph/osd/ceph-2/keyring
ceph osd crush add-bucket hisi3 host
ceph osd crush move hisi3 root=default
ceph-osd -i 2 -d
```

osd节点启动后，可以看到cluster的状态

```
ceph -s
  cluster:
    id:     70b9c6d6-8eb8-4afa-9920-bc488e45ab9f
    health: HEALTH_WARN
            no active mgr
            mon ubuntulx is low on available space

  services:
    mon: 1 daemons, quorum ubuntulx
    mgr: no daemons active
    osd: 3 osds: 3 up, 3 in

  data:
    pools:   0 pools, 0 pgs
    objects: 0 objects, 0B
    usage:   0B used, 0B / 0B avail
    pgs:
```

## 创建ceph文件系统
回到x86上，创建ceph文件系统。
一个 Ceph 文件系统需要至少两个 RADOS 存储池，一个用于数据、一个用于元数据。
```
ceph osd pool create cephfs_data <pg_num>
ceph osd pool create cephfs_metadata <pg_num>
```
创建好存储池后
```
ceph fs new <fs_name> <metadata> <data>
```
就可以看到创建好的文件系统
```
ceph fs ls
name: cephfs, metadata pool: cephfs_metadata, data pools: [cephfs_data ]
```

## 挂载ceph文件系统
直接mount总是有connection timeout的问题，用fuse挂载。
```
ceph-fuse -m 192.165.53.30:6789 /mnt/mycephfs
```

```
ceph -w
  cluster:
    id:     70b9c6d6-8eb8-4afa-9920-bc488e45ab9f
    health: HEALTH_WARN
            Degraded data redundancy: 42/63 objects degraded (66.667%), 11 pgs degraded, 200 pgs undersized
            mon ubuntulx is low on available space

  services:
    mon: 1 daemons, quorum ubuntulx
    mgr: ubuntulx(active)
    mds: cephfs-1/1/1 up  {0=ubuntulx=up:active}
    osd: 3 osds: 3 up, 3 in

  data:
    pools:   2 pools, 200 pgs
    objects: 21 objects, 2.57KiB
    usage:   295GiB used, 5.08TiB / 5.37TiB avail
    pgs:     42/63 objects degraded (66.667%)
             189 active+undersized
             11  active+undersized+degraded
```
现在~~~~可以在服务器上使用ceph文件系统了，尝试cp一些文件进去，大概在80MB/s，暂时来看，1G网络条件下，arm做osd节点性能问题不大。