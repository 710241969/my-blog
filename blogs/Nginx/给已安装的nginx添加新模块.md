# 给已安装的nginx添加新模块
2018-07-03 10:27:33

## 问题背景
最近在配置代理服时，想在upstream中通过fair实现负载均衡，
```Nginx
upstream mobile_shop {
    server 192.168.1.100:10000;
    server 192.168.1.101:10000;
    server 192.168.1.102:10000;
    fair;
    keepalive 64;
}
```
在`nginx -t` 的时候却爆出 `nginx: [emerg] unknown directive "fair" ` 的错误，看来是没有安装
那么问题来了，如何给已经安装好的nginx，添加上一个新模块呢？

## 实现步骤
### 1. 下载模块
首先，就是要去获得要安装的模块，我要安装的是fair，在githubs上找到并下载zip下来（没有安装git）
为了方便，我在nginx安装目录建了个modules文件夹，里面存放我要新增的模块
```Bash
root@debian:/usr/local/nginx# mkdir modules
root@debian:/usr/local/nginx# cd modules/
root@debian:/usr/local/nginx/modules# ls
root@debian:/usr/local/nginx/modules# wget https://github.com/gnosek/nginx-upstream-fair/archive/master.zip
root@debian:/usr/local/nginx/modules# ls
master.zip
root@debian:/usr/local/nginx/modules# unzip master.zip
...
root@debian:/usr/local/nginx/modules# ls
master.zip  nginx-upstream-fair-master
```

### 2. 查看当前nginx安装的编译参数
因为我们只是更新当前的nginx配置，而不是重新安装，不希望影响到现有的功能模块，所以要获得当前的nginx安装配置，在这个配置上进行新增
通过 `nginx -V` 命令可以查看，我的结果是
```Bash
root@debian:/usr/local/nginx/modules# cd ../sbin/
root@debian:/usr/local/nginx/sbin# ./nginx -V
...
configure arguments: --with-http_stub_status_module --with-http_ssl_module --with-http_realip_module --with-http_gzip_static_module --with-http_stub_status_module --with-http_stub_status_module --with-http_v2_module --with-openssl=/root/openssl-1.1.0f
```
记住这份配置哦，下面要用到

### 3. 备份当前nginx二进制文件
因为要替换nginx二进制文件，所以在替换之前，我们应该先备份一下当前的nginx二进制文件，这才是正确的做法
```Bash
root@debian:/usr/local/nginx/sbin# cp nginx nginx_bk
```

### 4. 重新编译nginx
这时我们就可以重新编译出一份nginx了，先找到nginx的源码文件安装包路径
在第二步得到的编译参数，后面加上我们要新增的模块，我要加的是
`--add-module=/usr/local/nginx/modules/nginx-upstream-fair-master`
整合起来就是重新编译的命令就是
`./configure --with-http_stub_status_module --with-http_ssl_module --with-http_realip_module --with-http_gzip_static_module --with-http_stub_status_module --with-http_stub_status_module --with-http_v2_module --with-openssl=/root/openssl-1.1.0f --add-module=/usr/local/nginx/modules/nginx-upstream-fair-master`
之后就是直接
`make`
make会花费上一点时间，所以要耐心等待等待

> **TIPS: 这里只需要 `make`,一定不要执行 `make install`，不然会覆盖安装整个nginx，我们只需要覆盖nginx执行的二进制文件而已，一定要注意！！！**

### 5. 替换nginx二进制文件
以上步骤都没有问题啦，第3步我们已经备份了当前在使用的nginx二进制文件了，所以现在我们可以大胆地进行覆盖了，生成的nginx二进制文件会在 `objs` 文件夹下
```Bash
root@debian:~/nginx-1.10.3# ls
auto  CHANGES  CHANGES.ru  conf  configure  contrib  html  LICENSE  Makefile  man  objs  README  src
root@debian:~/nginx-1.10.3# cd objs/
root@debian:~/nginx-1.10.3/objs# ls -al
total 7212
drwxr-xr-x 4 root root    4096 Jul  3 10:55 .
drwxr-xr-x 9 sweb sweb    4096 Nov 24  2017 ..
drwxr-xr-x 3 root root    4096 Jul  3 10:49 addon
-rw-r--r-- 1 root root   13643 Jul  3 10:49 autoconf.err
-rw-r--r-- 1 root root   43477 Jul  3 10:49 Makefile
-rwxr-xr-x 1 root root 7238800 Jul  3 10:55 nginx
-rw-r--r-- 1 root root    5341 Jul  3 10:55 nginx.8
-rw-r--r-- 1 root root    7371 Jul  3 10:49 ngx_auto_config.h
-rw-r--r-- 1 root root     657 Jul  3 10:48 ngx_auto_headers.h
-rw-r--r-- 1 root root    6367 Jul  3 10:49 ngx_modules.c
-rw-r--r-- 1 root root   33200 Jul  3 10:55 ngx_modules.o
drwxr-xr-x 9 root root    4096 Nov 24  2017 src
```
这时执行copy复制
```
root@debian:~/nginx-1.10.3/objs# cp nginx /usr/local/nginx/sbin/
cp: cannot create regular file ‘/usr/local/nginx/sbin/nginx’: Text file busy
```
发现，咦，不行。嗯，因为nginx还在运行，我们得先停掉nginx（在一个正在线上跑的代理服，讲道理这种操作是很危险的，这里求指点）
找到nginx进程，我使用了 `kill -QUIT` 来停掉nginx，这会花费上一段时间
```Bash
root@debian:~/nginx-1.10.3/objs# ps -ef | grep nginx
root       746     1  0  2017 ?        00:00:00 nginx: master process /usr/local/nginx/sbin/nginx
...
root@debian:~/nginx-1.10.3/objs# kill -QUIT 746
```
待nginx完全停掉后，我们马上执行copy并重启nginx（这时复制成功，没有问题）
```Bash
root@debian:~/nginx-1.10.3/objs# cp nginx /usr/local/nginx/sbin/
root@debian:~/nginx-1.10.3/objs# cd /usr/local/nginx/sbin/
root@debian:/usr/local/nginx/sbin# ls -al
total 14100
drwxr-sr-x  2 root staff    4096 Jul  3 10:41 .
drwxr-sr-x 12 root staff    4096 Jul  3 10:24 ..
-rwxr-xr-x  1 root staff 7238800 Jul  3 11:14 nginx
-rwxr-xr-x  1 root staff 7187200 Jul  3 10:41 nginx_bk
root@debian:/usr/local/nginx/sbin# ./nginx -t
nginx: the configuration file /usr/local/nginx/conf/nginx.conf syntax is ok
nginx: configuration file /usr/local/nginx/conf/nginx.conf test is successful
root@debian:/usr/local/nginx/sbin# ./nginx -c /usr/local/nginx/conf/nginx.conf
```

直接访问代理服务ip，成功访问到业务页面，ok，no趴笨，收工

## 坑点
https://github.com/gnosek/nginx-upstream-fair/issues/25
1.12.1以上nginx用不了fair
```Bash
/usr/local/src/nginx-upstream-fair-master/ngx_http_upstream_fair_module.c: In function ‘ngx_http_upstream_init_fair_rr’:
/usr/local/src/nginx-upstream-fair-master/ngx_http_upstream_fair_module.c:543:28: error: ‘ngx_http_upstream_srv_conf_t {aka struct ngx_http_upstream_srv_conf_s}’ has no member named ‘default_port’
     if (us->port == 0 && us->default_port == 0) {
                            ^~
/usr/local/src/nginx-upstream-fair-master/ngx_http_upstream_fair_module.c:553:51: error: ‘ngx_http_upstream_srv_conf_t {aka struct ngx_http_upstream_srv_conf_s}’ has no member named ‘default_port’
     u.port = (in_port_t) (us->port ? us->port : us->default_port);
                                                   ^~
objs/Makefile:1224: recipe for target 'objs/addon/nginx-upstream-fair-master/ngx_http_upstream_fair_module.o' failed
make[1]: *** [objs/addon/nginx-upstream-fair-master/ngx_http_upstream_fair_module.o] Error 1
make[1]: Leaving directory '/usr/local/src/nginx-1.14.0'
Makefile:8: recipe for target 'build' failed
make: *** [build] Error 2
```

## 参考
https://github.com/gnosek/nginx-upstream-fair
https://www.cnblogs.com/654wangzai321/p/8000780.html

