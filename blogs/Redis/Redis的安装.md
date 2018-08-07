# Redis的安装
2018-08-07 14:09:21

## 详细步骤
安装之前，首先就是下载redis了啦
```Bash
root@debian:/usr/local/src# wget http://download.redis.io/releases/redis-4.0.11.tar.gz
...
root@debian:/usr/local/src# tar -zxvf redis-4.0.11.tar.gz 
...
root@debian:/usr/local/src# cd redis-4.0.11
root@debian:/usr/local/src/redis-4.0.11# make
...
```
如果make出现 `bash: make: command not found` 的报错，要先安装编译工具包
apt-get install build-essential libtool
然后再执行make
安装成功后，进入编译得到的src文件夹，启动redis服务
```Bash
root@debian:/usr/local/src/redis-4.0.11# cd src/
root@debian:/usr/local/src/redis-4.0.11/src# ./redis-server 
32471:C 07 Aug 04:16:16.957 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
32471:C 07 Aug 04:16:16.957 # Redis version=4.0.11, bits=64, commit=00000000, modified=0, pid=32471, just started
32471:C 07 Aug 04:16:16.958 # Warning: no config file specified, using the default config. In order to specify a config file use ./redis-server /path/to/redis.conf
32471:M 07 Aug 04:16:16.958 * Increased maximum number of open files to 10032 (it was originally set to 1024).
                _._                                                  
           _.-``__ ''-._                                             
      _.-``    `.  `_.  ''-._           Redis 4.0.11 (00000000/0) 64 bit
  .-`` .-```.  ```\/    _.,_ ''-._                                   
 (    '      ,       .-`  | `,    )     Running in standalone mode
 |`-._`-...-` __...-.``-._|'` _.-'|     Port: 6379
 |    `-._   `._    /     _.-'    |     PID: 32471
  `-._    `-._  `-./  _.-'    _.-'                                   
 |`-._`-._    `-.__.-'    _.-'_.-'|                                  
 |    `-._`-._        _.-'_.-'    |           http://redis.io        
  `-._    `-._`-.__.-'_.-'    _.-'                                   
 |`-._`-._    `-.__.-'    _.-'_.-'|                                  
 |    `-._`-._        _.-'_.-'    |                                  
  `-._    `-._`-.__.-'_.-'    _.-'                                   
      `-._    `-.__.-'    _.-'                                       
          `-._        _.-'                                           
              `-.__.-'                                               

32471:M 07 Aug 04:16:16.961 # WARNING: The TCP backlog setting of 511 cannot be enforced because /proc/sys/net/core/somaxconn is set to the lower value of 128.
32471:M 07 Aug 04:16:16.962 # Server initialized
32471:M 07 Aug 04:16:16.962 # WARNING overcommit_memory is set to 0! Background save may fail under low memory condition. To fix this issue add 'vm.overcommit_memory = 1' to /etc/sysctl.conf and then reboot or run the command 'sysctl vm.overcommit_memory=1' for this to take effect.
32471:M 07 Aug 04:16:16.962 # WARNING you have Transparent Huge Pages (THP) support enabled in your kernel. This will create latency and memory usage issues with Redis. To fix this issue run the command 'echo never > /sys/kernel/mm/transparent_hugepage/enabled' as root, and add it to your /etc/rc.local in order to retain the setting after a reboot. Redis must be restarted after THP is disabled.
32471:M 07 Aug 04:16:16.962 * Ready to accept connections
```
搞定

## 可执行文件
安装的redis一共有下面几个可执行文件
```Bash
root@debian:/usr/local/src/redis-4.0.11/src# ls -l | grep 'redis-[^\.]*$'
-rwxr-xr-x 1 root root 2628720 Aug  7 16:09 redis-benchmark
-rwxr-xr-x 1 root root 6118424 Aug  7 16:09 redis-check-aof
-rwxr-xr-x 1 root root 6118424 Aug  7 16:09 redis-check-rdb
-rwxr-xr-x 1 root root 2820176 Aug  7 16:09 redis-cli
-rwxr-xr-x 1 root root 6118424 Aug  7 16:09 redis-sentinel
-rwxr-xr-x 1 root root 6118424 Aug  7 16:09 redis-server
```
|可执行文件|作用|
|::|::|
|redis-benchmark|基准测试工具|
|redis-check-aof|AOF持久化文件检测工具和修复工具|
|redis-check-dump|RDB持久化文件检测工具和修复工具|
|redis-cli|redis命令行工具|
|redis-sentinel|启动redis-sentinel|
|redis-server|启动redis|

## 参考
https://redis.io/download