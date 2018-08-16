# Redis哨兵设置
2018-08-08 11:22:23

## 前言
1、Sentinel（哨兵）进程的作用：

              1】、监控(Monitoring): 哨兵(sentinel) 会不断地检查你的Master和Slave是否运作正常。

              2】、提醒(Notification)：当被监控的某个Redis节点出现问题时, 哨兵(sentinel) 可以通过 API 向管理员或者其他应用程序发送通知。

              3】、自动故障迁移(Automatic failover)：当一个Master不能正常工作时，哨兵(sentinel) 会开始一次自动故障迁移操作，它会将失效Master的其中一个Slave升级为新的Master, 并让失效Master的其他Slave改为复制新的Master；当客户端试图连接失效的Master时，集群也会向客户端返回新Master的地址，使得集群可以使用现在的Master替换失效Master。Master和Slave服务器切换后，Master的redis.conf、Slave的redis.conf和sentinel.conf的配置文件的内容都会发生相应的改变，即，Master主服务器的redis.conf配置文件中会多一行slaveof的配置，sentinel.conf的监控目标会随之调换。

      
       2、Sentinel（哨兵）进程的工作方式：

             1】、每个Sentinel（哨兵）进程以每秒钟一次的频率向整个集群中的Master主服务器，Slave从服务器以及其他Sentinel（哨兵）进程发送一个 PING 命令。

             2】、如果一个实例（instance）距离最后一次有效回复 PING 命令的时间超过 down-after-milliseconds 选项所指定的值， 则这个实例会被 Sentinel（哨兵）进程标记为主观下线（SDOWN）。

             3】、如果一个Master主服务器被标记为主观下线（SDOWN），则正在监视这个Master主服务器的所有 Sentinel（哨兵）进程要以每秒一次的频率确认Master主服务器的确进入了主观下线状态。

             4】、当有足够数量的 Sentinel（哨兵）进程（大于等于配置文件指定的值）在指定的时间范围内确认Master主服务器进入了主观下线状态（SDOWN）， 则Master主服务器会被标记为客观下线（ODOWN）。

             5】、在一般情况下， 每个 Sentinel（哨兵）进程会以每 10 秒一次的频率向集群中的所有Master主服务器、Slave从服务器发送 INFO 命令。

             6】、当Master主服务器被 Sentinel（哨兵）进程标记为客观下线（ODOWN）时，Sentinel（哨兵）进程向下线的 Master主服务器的所有 Slave从服务器发送 INFO 命令的频率会从 10 秒一次改为每秒一次。

             7】、若没有足够数量的 Sentinel（哨兵）进程同意 Master主服务器下线， Master主服务器的客观下线状态就会被移除。若 Master主服务器重新向 Sentinel（哨兵）进程发送 PING 命令返回有效回复，Master主服务器的主观下线状态就会被移除。

## 哨兵配置
类似redis服务的配置，redis有一份默认的哨兵配置放在解压的安装目录里面，注释比配置还多
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
-rw-rw-r--  1 root root  58766 Aug  4 06:44 redis.conf
-rwxrwxr-x  1 root root    271 Aug  4 06:44 runtest
-rwxrwxr-x  1 root root    280 Aug  4 06:44 runtest-cluster
-rwxrwxr-x  1 root root    281 Aug  4 06:44 runtest-sentinel
-rw-rw-r--  1 root root   7921 Aug  4 06:44 sentinel.conf                            <-----------就是这个
drwxrwxr-x  3 root root   4096 Aug  7 17:03 src
drwxrwxr-x 10 root root   4096 Aug  4 06:44 tests
drwxrwxr-x  8 root root   4096 Aug  4 06:44 utils
```
然后我们来看一下都有哪些哨兵配置，下面一些常用的配置，字体**加粗**

* **守护进程**
  默认值 无
  和redis服务的 `daemonize` 配置的作用一样一样，但是默认配置文件里没有出现

* **端口**
  默认值 `port 26379`
  用法 `port <sentinel-port>`
  The port that this sentinel instance will run on
  设置哨兵进程启动并监听的端口

下面两个选项，互相产生作用，决定了是否能够远程访问本机的redis哨兵。
* **绑定地址**
  默认值 无 `#bind 127.0.0.1 192.168.1.1`
  和redis服务的 `bind` 配置的作用一样一样，但是默认没有设置。 
  > **TIPS:**
  > 如果有多个地址，要把对外的 192.168.1.1 写在前面，即 `bind 192.168.1.1 127.0.0.1` 否则会
  > ```
  17070:X 16 Aug 15:22:15.482 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
  17070:X 16 Aug 15:22:15.482 # Redis version=4.0.11, bits=64, commit=00000000, modified=0, pid=17070, just started
  17070:X 16 Aug 15:22:15.482 # Configuration loaded
  17071:X 16 Aug 15:22:15.484 * Running mode=sentinel, port=26379.
  17071:X 16 Aug 15:22:15.488 # Sentinel ID is 2f6767c89ce38b8d0233e11628def4e089f28b5b
  17071:X 16 Aug 15:22:15.488 # +monitor master mymaster 192.168.220.3 6379 quorum 2
  17071:X 16 Aug 15:22:18.511 # +sdown master mymaster 192.168.220.3 6379
  ```
  >连接不上，不晓得为什么

* **保护模式**
  默认值 无 `#protected-mode no`
  和redis服务的 `protected-mode` 配置的作用一样一样，但是默认没有设置。 

> **TIPS: **
> *** IMPORTANT ***
>
> By default Sentinel will not be reachable from interfaces different than
> localhost, either use the 'bind' directive to bind to a list of network
> interfaces, or disable protected mode with "protected-mode no" by
> adding it to this configuration file.
>
> Before doing that MAKE SURE the instance is protected from the outside
> world via firewalling or other means.
> 
> 也就是说，默认的配置启动哨兵模式是不可访问的，因为上面两个选项默认都没启用

* **工作目录**
  默认值 `dir /tmp`
  用法 `dir <working-directory>`
  Every long running process should have a well-defined working directory.For Redis Sentinel to chdir to /tmp at startup is the simplest thing for the process to don't interfere with administrative tasks such as unmounting filesystems.
  > **TIPS:**
  > 注意不要和redis-server使用相同的路径

* **监控的主节点**
  默认值 `sentinel monitor mymaster 127.0.0.1 6379 2`
  用法 `sentinel monitor <master-name> <ip> <redis-port> <quorum>`
  Tells Sentinel to monitor this master, and to consider it in O_DOWN (Objectively Down) state only if at least <quorum> sentinels agree.
  Note that whatever is the ODOWN quorum, a Sentinel will require to be elected by the majority of the known Sentinels in order to start a failover, so no failover can be performed in minority.
  Slaves are auto-discovered, so you don't need to specify slaves in any way. Sentinel itself will rewrite this configuration file adding the slaves using additional configuration options. Also note that the configuration file is rewritten when a slave is promoted to master.
  Note: master name should not include special characters or spaces.The valid charset is A-z 0-9 and the three characters ".-_".
  设置监控的主节点的 名字、IP、端口 以及 有多少个哨兵认为主节点下线才真正认定主节点下线

* **连接密码**
  默认值 无 `#sentinel auth-pass mymaster MySUPER--secret-0123passw0rd`
  用法 `sentinel auth-pass <master-name> <password>`
  Set the password to use to authenticate with the master and slaves.Useful if there is a password set in the Redis instances to monitor.
  **Note that the master password is also used for slaves, so it is not possible to set a different password in masters and slaves instances if you want to be able to monitor these instances with Sentinel.**
  However you can have Redis instances without the authentication enabled mixed with Redis instances requiring the authentication (as long as the password set is the same for all the instances requiring the password) as the AUTH command will have no effect in Redis instances with authentication switched off.
  设置哨兵连接master和slave时的密码，注意的是sentinel不能分别为master和slave设置不同的密码，因此master和slave的密码应该设置相同。当然，也可以将不需要密码验证的redis节点实例混合进来，此时要求那些需要密码验证的节点的密码保持一致即可

> **TIPS: **
> 注意配置的顺序问题，必须先设置 `sentinel monitor <master-name> <ip> <redis-port> <quorum>` ，才能设置其他有 master-name 的选项（如 `sentinel auth-pass <master-name> <password>` ）
> 否则启动哨兵报错
> ```Bash
> root@debian:/usr/local/src/redis-4.0.11/src# ./redis-sentinel ../redis_sentinel_6379.conf  
> 
> *** FATAL CONFIG FILE ERROR ***
> Reading the configuration file, at line 17
> >>> 'sentinel auth-pass mymaster wangwang'
> No such master with specified name.
> ```

* **下线时间**
  默认值 `sentinel down-after-milliseconds mymaster 30000`
  用法 `sentinel down-after-milliseconds <master-name> <milliseconds>`
  Number of milliseconds the master (or any attached slave or sentinel) should be unreachable (as in, not acceptable reply to PING, continuously, for the specified period) in order to consider it in S_DOWN state (Subjectively Down).
  Default is 30 seconds.
  设置当哨兵超过多长时间访问不到主库，就主观得认为主节点不可用。单位是毫秒，默认30秒

  sentinel parallel-syncs <master-name> <numslaves>
 
  How many slaves we can reconfigure to point to the new slave simultaneously
  during the failover. Use a low number if you use the slaves to serve query
  to avoid that all the slaves will be unreachable at about the same
  time while performing the synchronization with the master.
sentinel parallel-syncs mymaster 1

* **主从切换超时时间**
  默认值 `sentinel failover-timeout mymaster 180000`
  用法 `sentinel failover-timeout <master-name> <milliseconds>`
  Specifies the failover timeout in milliseconds. It is used in many ways:
  - The time needed to re-start a failover after a previous failover was already tried against the same master by a given Sentinel, is two times the failover timeout.
  - The time needed for a slave replicating to a wrong master according to a Sentinel current configuration, to be forced to replicate with the right master, is exactly the failover timeout (counting since the moment a Sentinel detected the misconfiguration).
  - The time needed to cancel a failover that is already in progress but did not produced any configuration change (SLAVEOF NO ONE yet not acknowledged by the promoted slave).
  - The maximum time a failover in progress waits for all the slaves to be reconfigured as slaves of the new master. However even after this time the slaves will be reconfigured by the Sentinels anyway, but not with the exact parallel-syncs progression as specified.
  Default is 3 minutes.

## 启动哨兵
我建立一个 redis_26379.conf，代表我要使用这个配置运行一个监听26379端口的redis哨兵
```Bash
root@debian:/usr/local/src/redis-4.0.11# vi redis_sentinel_26379.conf
```
可以通过redis-cli连接哨兵，查看哨兵状态
```Bash
root@debian:/usr/local/src/redis-4.0.11/src# ./redis-cli -p 26379
127.0.0.1:26379> INFO sentinel
# Sentinel
sentinel_masters:1
sentinel_tilt:0
sentinel_running_scripts:0
sentinel_scripts_queue_length:0
sentinel_simulate_failure_flags:0
master0:name=mymaster,status=ok,address=127.0.0.1:6379,slaves=2,sentinels=1
127.0.0.1:26379> 
```

其他机器的哨兵配置也是一样的，注意 ip、端口和maser名即可

## 测试主从切换
配置好了三台哨兵，再来连接主结点看一下现在的哨兵状态
```Bash
root@debian:/usr/local/src/redis-4.0.11/src# ./redis-cli -p 26379
127.0.0.1:26379> info sentinel
# Sentinel
sentinel_masters:1
sentinel_tilt:0
sentinel_running_scripts:0
sentinel_scripts_queue_length:0
sentinel_simulate_failure_flags:0
master0:name=mymaster,status=ok,address=192.168.220.3:6379,slaves=2,sentinels=3
```
可以看到主节点有2个从库，3个哨兵
哨兵的目的就是提高可用性和健壮性，所以我们来测试一下，加入主节点down机，能否正常进行主从切换
直接kill掉
```Bash
root@debian:/usr/local/src/redis-4.0.11/src# ps -ef | grep --color=auto redis
root      1902     1  0 16:59 ?        00:00:01 ./redis-server *:6379
root      1907     1  0 16:59 ?        00:00:01 ./redis-sentinel 192.168.220.3:26379 [sentinel]
root      1944  1137  0 17:07 pts/0    00:00:00 grep --color=auto redis
root@debian:/usr/local/src/redis-4.0.11/src# kill 1902
```
再看看sentinel的日志
```Bash
1907:X 08 Aug 17:08:17.016 # +sdown master mymaster 192.168.220.3 6379                 <-------------- 检测到主库崩了，主观下线
1907:X 08 Aug 17:08:17.057 # +new-epoch 1
1907:X 08 Aug 17:08:17.059 # +vote-for-leader 27f2446afd91bd7306ae36984f4993b86c2a411a 1              <-------------- 投票选举
1907:X 08 Aug 17:08:17.093 # +odown master mymaster 192.168.220.3 6379 #quorum 3/2             <-------------- 3个哨兵都检测到主库崩了，超过了设置的2个，客观下线
1907:X 08 Aug 17:08:17.093 # Next failover delay: I will not start a failover before Wed Aug  8 17:14:17 2018
1907:X 08 Aug 17:08:18.303 # +config-update-from sentinel 27f2446afd91bd7306ae36984f4993b86c2a411a 192.168.220.4 26379 @ mymaster 192.168.220.3 6379  <-------------- 自动修改配置文件，220.4 被选定为主库
1907:X 08 Aug 17:08:18.303 # +switch-master mymaster 192.168.220.3 6379 192.168.220.4 6379         <-------------- 交换主从 220.3 和 220.4 交换
1907:X 08 Aug 17:08:18.305 * +slave slave 192.168.220.5:6379 192.168.220.5 6379 @ mymaster 192.168.220.4 6379    <-------------- 主库 220.4 添加从库 220.5
1907:X 08 Aug 17:08:18.306 * +slave slave 192.168.220.3:6379 192.168.220.3 6379 @ mymaster 192.168.220.4 6379    <-------------- 主库 220.4 添加从库 220.3
1907:X 08 Aug 17:08:23.317 # +sdown slave 192.168.220.3:6379 192.168.220.3 6379 @ mymaster 192.168.220.4 6379    <-------------- 曾经的主库，崩掉的从库 220.3 依旧是崩的
```
其中一个哨兵的日志会比其他更多，多出的内容大致就是将选定的从库升为主库
```Bash
937:X 08 Aug 05:08:17.003 # +sdown master mymaster 192.168.220.3 6379
937:X 08 Aug 05:08:17.080 # +odown master mymaster 192.168.220.3 6379 #quorum 2/2
937:X 08 Aug 05:08:17.081 # +new-epoch 1
937:X 08 Aug 05:08:17.081 # +try-failover master mymaster 192.168.220.3 6379
937:X 08 Aug 05:08:17.085 # +vote-for-leader 27f2446afd91bd7306ae36984f4993b86c2a411a 1
937:X 08 Aug 05:08:17.092 # 5355b7f64a2ceb663fb7fd033152f0a8189bc0f4 voted for 27f2446afd91bd7306ae36984f4993b86c2a411a 1
937:X 08 Aug 05:08:17.093 # 31f82da60960bb29353b64d44d225cf3d8e8b232 voted for 27f2446afd91bd7306ae36984f4993b86c2a411a 1
937:X 08 Aug 05:08:17.157 # +elected-leader master mymaster 192.168.220.3 6379
937:X 08 Aug 05:08:17.158 # +failover-state-select-slave master mymaster 192.168.220.3 6379
937:X 08 Aug 05:08:17.217 # +selected-slave slave 192.168.220.4:6379 192.168.220.4 6379 @ mymaster 192.168.220.3 6379
937:X 08 Aug 05:08:17.218 * +failover-state-send-slaveof-noone slave 192.168.220.4:6379 192.168.220.4 6379 @ mymaster 192.168.220.3 6379
937:X 08 Aug 05:08:17.289 * +failover-state-wait-promotion slave 192.168.220.4:6379 192.168.220.4 6379 @ mymaster 192.168.220.3 6379
937:X 08 Aug 05:08:18.263 # +promoted-slave slave 192.168.220.4:6379 192.168.220.4 6379 @ mymaster 192.168.220.3 6379
937:X 08 Aug 05:08:18.263 # +failover-state-reconf-slaves master mymaster 192.168.220.3 6379
937:X 08 Aug 05:08:18.333 * +slave-reconf-sent slave 192.168.220.5:6379 192.168.220.5 6379 @ mymaster 192.168.220.3 6379
937:X 08 Aug 05:08:19.217 # -odown master mymaster 192.168.220.3 6379
937:X 08 Aug 05:08:19.286 * +slave-reconf-inprog slave 192.168.220.5:6379 192.168.220.5 6379 @ mymaster 192.168.220.3 6379
937:X 08 Aug 05:08:19.286 * +slave-reconf-done slave 192.168.220.5:6379 192.168.220.5 6379 @ mymaster 192.168.220.3 6379
937:X 08 Aug 05:08:19.347 # +failover-end master mymaster 192.168.220.3 6379
937:X 08 Aug 05:08:19.348 # +switch-master mymaster 192.168.220.3 6379 192.168.220.4 6379
937:X 08 Aug 05:08:19.349 * +slave slave 192.168.220.5:6379 192.168.220.5 6379 @ mymaster 192.168.220.4 6379
937:X 08 Aug 05:08:19.350 * +slave slave 192.168.220.3:6379 192.168.220.3 6379 @ mymaster 192.168.220.4 6379
937:X 08 Aug 05:08:24.367 # +sdown slave 192.168.220.3:6379 192.168.220.3 6379 @ mymaster 192.168.220.4 6379
```
这时我们去新的主库 192.168.220.4 上面看看redis状态
```Bash
root@debian:/usr/local/src/redis-4.0.11/src# ./redis-cli -p 6379
127.0.0.1:6379> AUTH wangwang
OK
127.0.0.1:6379> INFO replication
# Replication
role:master
connected_slaves:1
slave0:ip=192.168.220.5,port=6379,state=online,offset=167484,lag=0
master_replid:88bb70e52545a09bbf5ab133455199171a578735
master_replid2:eb977dba3d9ca71baa1b8b470085d9edd0e121ff
master_repl_offset:167625
second_repl_offset:71220
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:167625
127.0.0.1:6379> 
```
可以看到已经成功地成为了主库了
这时我们再去重启曾经的主库会怎么样呢？
同样看看sentinel日志
```
937:X 08 Aug 05:18:26.658 # -sdown slave 192.168.220.3:6379 192.168.220.3 6379 @ mymaster 192.168.220.4 6379
937:X 08 Aug 05:18:36.615 * +convert-to-slave slave 192.168.220.3:6379 192.168.220.3 6379 @ mymaster 192.168.220.4 6379
```
看看 220.3 启动之后的状态
```Bash
root@debian:/usr/local/src/redis-4.0.11/src# ./redis-server ../redis_6379.conf             
root@debian:/usr/local/src/redis-4.0.11/src# ./redis-cli -p 6379             
127.0.0.1:6379> AUTH wangwang
OK
127.0.0.1:6379> info replication
# Replication
role:slave
master_host:192.168.220.4
master_port:6379
master_link_status:up
master_last_io_seconds_ago:0
master_sync_in_progress:0
slave_repl_offset:220027
slave_priority:100
slave_read_only:1
connected_slaves:0
master_replid:88bb70e52545a09bbf5ab133455199171a578735
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:220027
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:200562
repl_backlog_histlen:19466
127.0.0.1:6379> 
```
已经成为从库了
再看看 220.4 主库状态
```Bash
127.0.0.1:6379> info replication
# Replication
role:master
connected_slaves:2
slave0:ip=192.168.220.5,port=6379,state=online,offset=201007,lag=0
slave1:ip=192.168.220.3,port=6379,state=online,offset=201007,lag=1
master_replid:88bb70e52545a09bbf5ab133455199171a578735
master_replid2:eb977dba3d9ca71baa1b8b470085d9edd0e121ff
master_repl_offset:201148
second_repl_offset:71220
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:201148
127.0.0.1:6379> 
```
这时可以看到已经完美实现主从切换了

sentinel支持的合法命令如下：

PING sentinel回复PONG.

SENTINEL masters 显示被监控的所有master以及它们的状态.   //用来查看监听的master name

SENTINEL master <master name> 显示指定master的信息和状态；

SENTINEL slaves <master name> 显示指定master的所有slave以及它们的状态；

SENTINEL get-master-addr-by-name <master name> 返回指定master的ip和端口，如果正在进行failover或者failover已经完成，将会显示被提升为master的slave的ip和端口。

SENTINEL reset <pattern> 重置名字匹配该正则表达式的所有的master的状态信息，清楚其之前的状态信息，以及slaves信息。

SENTINEL failover <master name> 强制sentinel执行failover，并且不需要得到其他sentinel的同意。但是failover后会将最新的配置发送给其他sentinel。

## 参考
https://raw.githubusercontent.com/antirez/redis/4.0/sentinel.conf