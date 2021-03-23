# Java程序的自启动问题
遇到一个诡异的问题，一个Java实现的业务系统，在命令行下运行一切正常，但是在rc.local里自启动，就总会出现
```
Caused by: org.springframework.beans.BeanInstantiationException: Failed to instantiate [com.netflix.discovery.EurekaClient]: Factory method 'eurekaClient' threw exception; nested exception is java.lang.OutOfMemoryError: unable to create new native thread
        at org.springframework.beans.factory.support.SimpleInstantiationStrategy.instantiate(SimpleInstantiationStrategy.java:189)
        at org.springframework.beans.factory.support.ConstructorResolver.instantiateUsingFactoryMethod(ConstructorResolver.java:588)
        ... 43 common frames omitted
Caused by: java.lang.OutOfMemoryError: unable to create new native thread
        at java.lang.Thread.start0(Native Method)
        at java.lang.Thread.start(Thread.java:717)
        at java.util.concurrent.ThreadPoolExecutor.addWorker(ThreadPoolExecutor.java:957)
        at java.util.concurrent.ThreadPoolExecutor.ensurePrestart(ThreadPoolExecutor.java:1603)
        at java.util.concurrent.ScheduledThreadPoolExecutor.delayedExecute(ScheduledThreadPoolExecutor.java:334)
        ...
```
明明内存足够，ulimit的设置也是足足的：
```
root@liucan-Default-string:/usr/sbin/sumavision# ulimit -a
core file size          (blocks, -c) unlimited
data seg size           (kbytes, -d) unlimited
scheduling priority             (-e) 0
file size               (blocks, -f) unlimited
pending signals                 (-i) 63707
max locked memory       (kbytes, -l) 64
max memory size         (kbytes, -m) unlimited
open files                      (-n) 102400
pipe size            (512 bytes, -p) 8
POSIX message queues     (bytes, -q) 819200
real-time priority              (-r) 0
stack size              (kbytes, -s) 8192
cpu time               (seconds, -t) unlimited
max user processes              (-u) 102400
virtual memory          (kbytes, -v) unlimited
file locks                      (-x) unlimited
```
真是见了鬼哦。改半天JVM参数也不管用。
分析问题，既然手工启动正常，那系统本身的问题可能性就很小了，还是要查找rc.local和手工之间的差异。
研究了一下系统启动，银河麒麟和Ubuntu一脉相承，而Ubuntu的rc.local已经归systemed控制了。
查看一下状态：
```
root@liucan-Default-string:/usr/sbin/sumavision# systemctl status rc.local
● rc-local.service - /etc/rc.local Compatibility
   Loaded: loaded (/lib/systemd/system/rc-local.service; static; vendor preset: enabled)
  Drop-In: /lib/systemd/system/rc-local.service.d
           └─debian.conf
   Active: active (running) since 二 2020-09-22 14:32:20 CST; 13min ago
  Process: 1026 ExecStart=/etc/rc.local start (code=exited, status=0/SUCCESS)
    Tasks: 482 (limit: 512)
   CGroup: /system.slice/rc-local.service
           ├─1192 /usr/bin/java -Djava.util.logging.config.file=/usr/sbin/sumavision/tetris/tetris-spri
           ├─6226 /usr/bin/java -Djava.util.logging.config.file=/usr/sbin/sumavision/tetris/tetris-spri
           ├─6328 /usr/bin/java -Djava.util.logging.config.file=/usr/sbin/sumavision/tetris/tetris-proj
           ├─7036 /usr/bin/java -Djava.util.logging.config.file=/usr/sbin/sumavision/tetris/tetris-proj
           ├─7198 /usr/bin/java -Djava.util.logging.config.file=/usr/sbin/sumavision/tomcat_venus_alarm
           └─7319 /usr/bin/java -Djava.util.logging.config.file=/usr/sbin/sumavision/tomcat_venus_resou
```
`Tasks: 482 (limit: 512)`这句就说明了问题，系统对rc.local的任务数做了限制，意思也是不提倡在rc.local中跑很多东西。
处理办法有两个，一是把系统启动从rc.loca里面移出来，改成systemd任务的形式；二是直接修改rc.local的任务数。
简单处理一下：修改`/lib/systemd/system/rc-local.service.d/debian.conf`，增加一行`TasksMax=infinity`，不做限制了。
然后重启，现在Java系统就能正常跑起来啦。