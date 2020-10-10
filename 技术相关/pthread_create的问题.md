# pthread_create的问题
某个Centos的系统，update之后，原来能运行的程序居然出错了。检查出错信息，是在pthread_create的时候，返回了Operation not Permit。原因是升级后systemd和之前有所不同，默认的cgroups不包含cpu:/。
在提示符下输入`cgclassify -g cpu:/ $$`，接着运行程序，就正常了。如果是没有cgclassify的dist，输入`echo $$ > /sys/fs/cgroup/cpu/tasks`也能达成一样的效果。
在rc.local的systemd文件中，增加一句`ControlGroup=cpu:/`，或者把上面说的直接加到自启动脚本里面，都可以实现启动时修改。