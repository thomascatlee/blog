# nginx端口
centos安装nginx之后，需要用semanage允许端口：
```
semanage port -a -t http_port_t  -p tcp 端口
```
