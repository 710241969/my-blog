# Redis配置、停止、启动、连接
2018-08-07 19:09:31

## 前言
接着上一篇 Redis的安装和简单启动 ，我们来学习一下redis的基本配置、停止、启动和客户端进行连接

## 问题引入
在上一篇中，我们启动了redis服务(192.168.220.4)，但是使用的是默认配置，这时，我们试一下在本机用客户端访问这个redis服务，然后查看redis服务信息
```Bash
root@debian:/usr/local/src/redis-4.0.11/src# ./redis-cli -h 127.0.0.1 -p 6379
127.0.0.1:6379> info
# Server
redis_version:4.0.11
redis_git_sha1:00000000
redis_git_dirty:0
redis_build_id:db1855f603466ba
...
```
可以，服务跑起来没问题，客户端也能连接。这时，我们试一下在另外一台虚拟机(192.168.220.3)用客户端访问这个redis服务，然后查看redis服务信息，可以预测，是不行的，可能服务端的防火墙没开放端口，可能是redis还没进行详细配置。不管是啥，先试试
```Bash
root@debian:/usr/local/src/redis-4.0.11/src# ./redis-cli -h 192.168.220.4 -p 6379
192.168.220.4:6379> INFO
DENIED Redis is running in protected mode because protected mode is enabled, no bind address was specified, no authentication password is requested to clients. In this mode connections are only accepted from the loopback interface. If you want to connect from external computers to Redis you may adopt one of the following solutions: 1) Just disable protected mode sending the command 'CONFIG SET protected-mode no' from the loopback interface by connecting to Redis from the same host the server is running, however MAKE SURE Redis is not publicly accessible from internet if you do so. Use CONFIG REWRITE to make this change permanent. 2) Alternatively you can just disable the protected mode by editing the Redis configuration file, and setting the protected mode option to 'no', and then restarting the server. 3) If you started the server manually just for testing, restart it with the '--protected-mode no' option. 4) Setup a bind address or an authentication password. NOTE: You only need to do one of the above things in order for the server to start accepting connections from the outside.
```
这时可以发现，呀，果然不行，报错内容解释得很详细，我就不多说了。

## 进行配置
redis有一份默认配置放在解压的安装目录里面，注释比配置还多
```Bash
root@debian:/usr/local/src/redis-4.0.11# ls -l
total 372
-rw-rw-r--  1 root root 164219 Aug  4 06:44 00-RELEASENOTES
-rw-rw-r--  1 root root     53 Aug  4 06:44 BUGS
-rw-rw-r--  1 root root   1815 Aug  4 06:44 CONTRIBUTING
-rw-rw-r--  1 root root   1487 Aug  4 06:44 COPYING
drwxrwxr-x  6 root root   4096 Aug  7 16:08 deps
-rw-rw-r--  1 root root     11 Aug  4 06:44 INSTALL
-rw-rw-r--  1 root root    151 Aug  4 06:44 Makefile
-rw-rw-r--  1 root root   4223 Aug  4 06:44 MANIFESTO
-rw-rw-r--  1 root root  20543 Aug  4 06:44 README.md
-rw-rw-r--  1 root root  58766 Aug  4 06:44 redis.conf                            <-----------就是这个
-rwxrwxr-x  1 root root    271 Aug  4 06:44 runtest
-rwxrwxr-x  1 root root    280 Aug  4 06:44 runtest-cluster
-rwxrwxr-x  1 root root    281 Aug  4 06:44 runtest-sentinel
-rw-rw-r--  1 root root   7921 Aug  4 06:44 sentinel.conf
drwxrwxr-x  3 root root   4096 Aug  7 17:03 src
drwxrwxr-x 10 root root   4096 Aug  4 06:44 tests
drwxrwxr-x  8 root root   4096 Aug  4 06:44 utils
```
然后我们来对我们的redis进行配置，下面一些常用的配置，字体**加粗**
* **端口**
  配置文件里，默认的端口号配置为 `port 6379`
  指定Redis服务监听端口，默认端口为6379，作者在自己的一篇博文中解释了为什么选用6379作为默认端口，因为6379在手机按键上MERZ对应的号码，而MERZ取自意大利歌女Alessia Merz的名字...
  要修改运行端口的话直接修改为你要的端口就可以了

* **守护进程**
  默认值 `daemonize no`
  Redis默认不是以守护进程的方式运行，可以通过该配置项修改，使用yes启用守护进程

下面三个选项，互相产生作用，决定了是否能够远程访问本机的redis服务，其中 绑定地址 的设置将直接影响其他两个。
* **保护模式**
  默认值 `protected-mode yes`
  Redis 3.2后加入的参数，是否开启保护模式，默认开启。要是配置里没有指定bind和密码。开启该参数后，redis只会本地进行访问，拒绝外部访问。要是开启了密码或者bind了地址，可以开启，设置为 yes 。否则最好关闭，设置为 no 。

* **绑定地址**
  默认值 `bind 127.0.0.1`
  指定 redis 绑定的服务器ip地址，即指定当前 redis 可对外开放访问的ip。如果不进行设置，那么将监听本机的所有IP。多个IP用空格隔开，如 `bind 192.168.220.4 127.0.0.1`，那么远程客户端能通过 `redis-cli -h 192.168.220.4 -p 6379` 来进行访问，本机能通过 `redis-cli -h 192.168.220.4 -p 6379` 和 `redis-cli -h 127.0.0.1 -p 6379` 进行访问。
  > **TIPS:** Redis 是不会限制来源ip的，网上有些说法，说这个设置是指定 redis 只接收来自于该 IP 地址的请求，这是错误的！

* **连接密码**
  默认值 `# requirepass foobared` 也就是无，因为是注释掉的
  设置Redis连接密码，默认关闭。如果配置了连接密码，要求客户端在连接Redis时需要通过 `AUTH <password>` 命令提供密码进行访问。

* **从库只读**
  默认值 `slave-read-only yes`
  You can configure a slave instance to accept writes or not. Writing against a slave instance may be useful to store some ephemeral data (because data written on a slave will be easily deleted after resync with the master) but may also cause problems if clients are writing to it because of a misconfiguration.
  Since Redis 2.6 by default slaves are read-only.
  Note: read only slaves are not designed to be exposed to untrusted clients on the internet. It's just a protection layer against misuse of the instance.Still a read only slave exports by default all the administrative commands such as CONFIG, DEBUG, and so forth. To a limited extent you can improve security of read only slaves using 'rename-command' to shadow all the administrative / dangerous commands.
  设置从数据库是否可以写，默认是只读，而且应该被设置为只读，因为写在从库的数据很容易被主库数据的同步而删除覆盖。从Redis 2.6开始，从库默认为只读。
  另外，从数据库不应该被不受信的网络访问得到

* **日志输出**
  默认值 `logfile ""`
  Specify the log file name. Also the empty string can be used to force Redis to log on the standard output. Note that if you use standard output for logging but daemonize, logs will be sent to /dev/null
  日志记录方式，默认为标准输出，如果配置Redis为守护进程方式运行，而这里又配置为日志记录方式为标准输出，则日志将会发送给/dev/null

* **数据库数量**
  默认值 `databases 16`
  Set the number of databases. The default database is DB 0, you can select a different one on a per-connection basis using `SELECT <dbid>` where dbid is a number between 0 and 'databases'-1
  设置数据库的数量，默认16个，默认使用的数据库为0，可以使用SELECT <dbid>命令在连接上指定数据库id。注意下标是从0开始的

* 日志级别
  默认值 `loglevel notice`
  Specify the server verbosity level.
  This can be one of:
  debug (a lot of information, useful for development/testing)
  verbose (many rarely useful info, but not a mess like the debug level)
  notice (moderately verbose, what you want in production probably)
  warning (only very important / critical messages are logged)
  指定了服务端日志的级别。级别包括：debug（很多信息，方便开发、测试），verbose（许多有用的信息，但是没有debug级别信息多），notice（适当的日志级别，适合生产环境），warn（只有非常重要的信息）

* 数据目录
  默认值 `dir ./`
  The working directory.
  The DB will be written inside this directory, with the filename specifiedabove using the 'dbfilename' configuration directive.
  The Append Only File will also be created inside this directory.
  Note that you must specify a directory here, not a file name.
  指定本地数据库存放目录

* 断开连接
  默认值 `timeout 0`
  Close the connection after a client is idle for N seconds (0 to disable)
  当客户端空闲时间超过N秒后，服务端会主动断开连接。默认为0，表示禁用该配置

* 进程pid文件
  默认值 `pidfile /var/run/redis_6379.pid`
  当Redis以守护进程方式运行时，Redis默认会把pid写入 /var/run/redis_6379.pid 文件，可以通过 pidfile 指定写入文件

## 停止Redis
要使用新的配置启动我们所需要的Redis，首先，把当前运行的Redis停掉，我这里有两个方法关闭redis服务
### 1. 方法一：通过客户端停止
   在客户端使用 `shutdown` 命令停止服务
   这个方法适用于能够通过Redis客户端连接到服务端的情况（大部分情况就是本地客户端连接本地服务端了）
   首先看一下，我们的redis服务进程

   ```Bash
   root@debian:/usr/local/src/redis-4.0.11/src# ps -ef | grep --color=auto redis
   root     12186     1  0 20:24 ?        00:00:00 ./redis-server 192.168.220.4:6379
   root     12191  7891  0 20:24 pts/1    00:00:00 grep --color=auto redis
   ```
   这时候通过客户端停止服务

   ```Bash
   root@debian:/usr/local/src/redis-4.0.11/src# ./redis-cli -h 127.0.0.1 -p 6379
   127.0.0.1:6379> AUTH wangwang
   OK
   127.0.0.1:6379> shutdown
   not connected> 
   ```
   再看一下服务进程

   ```
   root@debian:/usr/local/src/redis-4.0.11/src# ps -ef | grep --color=auto redis
   root     12201 11288  0 20:26 pts/0    00:00:00 ./redis-cli -h 127.0.0.1 -p 6379
   root     12206  7891  0 20:27 pts/1    00:00:00 grep --color=auto redis
   ```
   可以看到，服务进程已经不见了，只剩下客户端进程

#### 2. 方法二：kill
   这个终极方法，不多说

   ```Bash
   root@debian:/usr/local/src/redis-4.0.11/src# ps -ef | grep --color=auto redis  
   root     12222     1  0 20:30 ?        00:00:00 ./redis-server 192.168.220.4:6379
   root     12227  7891  0 20:30 pts/1    00:00:00 grep --color=auto redis
   root@debian:/usr/local/src/redis-4.0.11/src# kill 12222
   ```

## 启动Redis
我建立一个 redis_6379.conf，代表我要使用这个配置运行一个监听6379端口的redis服务
```Bash
root@debian:/usr/local/src/redis-4.0.11# vi redis_6379.conf
```
现在可以根据我们需要的配置启动Redis了，很简单， `redis-server` 后面加上我们需要加载的配置文件即可
```Bash
root@debian:/usr/local/src/redis-4.0.11/src# ./redis-server ../redis_6379.conf
12243:C 07 Aug 20:34:18.035 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
12243:C 07 Aug 20:34:18.035 # Redis version=4.0.11, bits=64, commit=00000000, modified=0, pid=12243, just started
12243:C 07 Aug 20:34:18.035 # Configuration loaded
```

## 客户端连接
Redis服务启动之后，就可以进行客户端连接了。很简单，上面也已经出现过了
### 1. redis-cli -h {host} -p {port}
连接到Redis服务，之后所有的操作都是在交互的方式实现

### 2. redis-cli -h {host} -p {port} {command}
直接得到命令的返回结果

## 参考
https://raw.githubusercontent.com/antirez/redis/4.0/redis.conf
   
