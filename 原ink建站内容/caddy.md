---
title: "Caddy的配置"
date: 2017-08-30 19:00:00 +0800
author: me
tags:
    - 技术杂记
    - 随笔
    - 试验田
preview: Caddy的自启动配置

---

## Caddy的自启动配置

​	因为host是centos6的，似乎不支持systemd，折腾upstart半天也不对，服务都配上了，caddy启动不了。

​	偶然看到ss的启动，用的是supervisord，研究了一下，用来启动caddy也可以。

​	修改配置文件，加入以下部分：

```shell
[program:caddy]
command=/usr/local/bin/caddy -agree=true -email=thomascatlee@gmail.com -conf=/etc/caddy/Caddyfile
directory=/var/www        ; directory to cwd to before exec (def no cwd)
autostart=true                ; start at supervisord start (default: true)
autorestart=unexpected        ; whether/when to restart (default: unexpected)
startsecs=1                   ; number of secs prog must stay running (def. 1)
startretries=3                ; max # of serial start failures (default 3)
exitcodes=0,2                 ; 'expected' exit codes for process (default 0,2)
stopsignal=QUIT               ; signal used to kill process (default TERM)
stopwaitsecs=10               ; max num secs to wait b4 SIGKILL (default 10)
stopasgroup=false             ; send stop signal to the UNIX process group (default false)
user=www-data             ; setuid to this UNIX account to run the program
redirect_stderr=true          ; redirect proc stderr to stdout (default false)
stdout_logfile=/var/log/caddy.log        ; stdout log path, NONE for none; default AUTO
stderr_logfile=/var/log/caddyerr.log        ; stderr log path, NONE for none; default AUTO
```

​	然后supervisorctl reread & supervisorctl update更新配置

​	用supervisorctl start/stop/restart 启停服务，status看状态。