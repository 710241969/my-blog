# Redis哨兵设置
2018-08-08 11:22:23

## 前言
Redis 的 Sentinel 系统用于管理多个 Redis 服务器（instance）， 该系统执行以下三个任务：
* 监控（Monitoring）： Sentinel 会不断地检查你的主服务器和从服务器是否运作正常。
* 提醒（Notification）： 当被监控的某个 Redis 服务器出现问题时， Sentinel 可以通过 API 向管理员或者其他应用程序发送通知。
* 自动故障迁移（Automatic failover）： 当一个主服务器不能正常工作时， Sentinel 会开始一次自动故障迁移操作， 它会将失效主服务器的其中一个从服务器升级为新的主服务器， 并让失效主服务器的其他从服务器改为复制新的主服务器； 当客户端试图连接失效的主服务器时， 集群也会向客户端返回新主服务器的地址， 使得集群可以使用新主服务器代替失效服务器。

Redis Sentinel 是一个分布式系统， 你可以在一个架构中运行多个 Sentinel 进程（progress）， 这些进程使用流言协议（gossip protocols)来接收关于主服务器是否下线的信息， 并使用投票协议（agreement protocols）来决定是否执行自动故障迁移， 以及选择哪个从服务器作为新的主服务器。
虽然 Redis Sentinel 释出为一个单独的可执行文件 redis-sentinel ， 但实际上它只是一个运行在特殊模式下的 Redis 服务器， 你可以在启动一个普通 Redis 服务器时通过给定 --sentinel 选项来启动 Redis Sentinel

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
  > ```
  > 连接不上，不晓得为什么

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
  >
  > Tells Sentinel to monitor this master, and to consider it in O_DOWN
  (Objectively Down) state only if at least <quorum> sentinels agree.
  >
  > Note that whatever is the ODOWN quorum, a Sentinel will require to
  be elected by the majority of the known Sentinels in order to
  start a failover, so no failover can be performed in minority.
  >
  > Slaves are auto-discovered, so you don't need to specify slaves in
  any way. Sentinel itself will rewrite this configuration file adding
  the slaves using additional configuration options.
  Also note that the configuration file is rewritten when a
  slave is promoted to master.
  >
  > Note: master name should not include special characters or spaces.
  The valid charset is A-z 0-9 and the three characters ".-_".
  >
  设置监控的主节点的 名字、IP、端口 以及 有多少个哨兵认为主节点下线才真正认定主节点下线。
  
  指示 Sentinel 去监视一个名为 mymaster 的主服务器，这个主服务器的 IP 地址为 127.0.0.1 ，端口号为 6379，而将这个主服务器判断为失效至少需要 2 个 Sentinel 同意 （只要同意 Sentinel 的数量不达标，自动故障迁移就不会执行）

  不过要注意， 无论你设置要多少个 Sentinel 同意才能判断一个服务器失效， **一个 Sentinel 都需要获得系统中多数（majority） Sentinel 的支持， 才能发起一次自动故障迁移，** 并预留一个给定的配置纪元 （configuration Epoch ，一个配置纪元就是一个新主服务器配置的版本号）。
  
  换句话说， **在只有少数（minority） Sentinel 进程正常运作的情况下， Sentinel 是不能执行自动故障迁移的。**

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
  设置当哨兵超过多长时间访问不到主库，就主观得认为主节点不可用。单位是毫秒，默认30秒。
  
  如果服务器在给定的毫秒数之内， 没有返回 Sentinel 发送的 PING 命令的回复， 或者返回一个错误， 那么 Sentinel 将这个服务器标记为**主观下线**（subjectively down，简称 SDOWN ）。

  不过只有一个 Sentinel 将服务器标记为主观下线并不一定会引起服务器的自动故障迁移： 只有在足够数量的 Sentinel 都将一个服务器标记为主观下线之后， 服务器才会被标记为客观下线（objectively down， 简称 ODOWN ）， 这时自动故障迁移才会执行。

  将服务器标记为客观下线所需的 Sentinel 数量由对主服务器的配置决定。

* **`sentinel parallel-syncs <master-name> <numslaves>`**
  默认值 `sentinel parallel-syncs mymaster 1`
  How many slaves we can reconfigure to point to the new slave simultaneously
  during the failover. Use a low number if you use the slaves to serve query
  to avoid that all the slaves will be unreachable at about the same
  time while performing the synchronization with the master.
  指定了在执行故障转移时， 最多可以有多少个从服务器同时对新的主服务器进行同步， 这个数字越小， 完成故障转移所需的时间就越长。
  
  如果从服务器被设置为允许使用过期数据集（参见对 redis.conf 文件中对 slave-serve-stale-data 选项的说明）， 那么你可能不希望所有从服务器都在同一时间向新的主服务器发送同步请求， 因为尽管复制过程的绝大部分步骤都不会阻塞从服务器， 但从服务器在载入主服务器发来的 RDB 文件时， 仍然会造成从服务器在一段时间内不能处理命令请求： 如果全部从服务器一起对新的主服务器进行同步， 那么就可能会造成所有从服务器在短时间内全部不可用的情况出现。
  
  你可以通过将这个值设为 1 来保证每次只有一个从服务器处于不能处理命令请求的状态。

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
再看看 220.4 主库状态，多了220.3为从库
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

日志信息可以对照下面的内容
> +reset-master <instance details> ：主服务器已被重置。
+slave <instance details> ：一个新的从服务器已经被 Sentinel 识别并关联。
+failover-state-reconf-slaves <instance details> ：故障转移状态切换到了 reconf-slaves 状态。
+failover-detected <instance details> ：另一个 Sentinel 开始了一次故障转移操作，或者一个从服务器转换成了主服务器。
+slave-reconf-sent <instance details> ：领头（leader）的 Sentinel 向实例发送了 SLAVEOF 命令，为实例设置新的主服务器。
+slave-reconf-inprog <instance details> ：实例正在将自己设置为指定主服务器的从服务器，但相应的同步过程仍未完成。
+slave-reconf-done <instance details> ：从服务器已经成功完成对新主服务器的同步。
-dup-sentinel <instance details> ：对给定主服务器进行监视的一个或多个 Sentinel 已经因为重复出现而被移除 —— 当 Sentinel 实例重启的时候，就会出现这种情况。
+sentinel <instance details> ：一个监视给定主服务器的新 Sentinel 已经被识别并添加。
+sdown <instance details> ：给定的实例现在处于主观下线状态。
-sdown <instance details> ：给定的实例已经不再处于主观下线状态。
+odown <instance details> ：给定的实例现在处于客观下线状态。
-odown <instance details> ：给定的实例已经不再处于客观下线状态。
+new-epoch <instance details> ：当前的纪元（epoch）已经被更新。
+try-failover <instance details> ：一个新的故障迁移操作正在执行中，等待被大多数 Sentinel 选中（waiting to be elected by the majority）。
+elected-leader <instance details> ：赢得指定纪元的选举，可以进行故障迁移操作了。
+failover-state-select-slave <instance details> ：故障转移操作现在处于 select-slave 状态 —— Sentinel 正在寻找可以升级为主服务器的从服务器。
no-good-slave <instance details> ：Sentinel 操作未能找到适合进行升级的从服务器。Sentinel 会在一段时间之后再次尝试寻找合适的从服务器来进行升级，又或者直接放弃执行故障转移操作。
selected-slave <instance details> ：Sentinel 顺利找到适合进行升级的从服务器。
failover-state-send-slaveof-noone <instance details> ：Sentinel 正在将指定的从服务器升级为主服务器，等待升级功能完成。
failover-end-for-timeout <instance details> ：故障转移因为超时而中止，不过最终所有从服务器都会开始复制新的主服务器（slaves will eventually be configured to replicate with the new master anyway）。
failover-end <instance details> ：故障转移操作顺利完成。所有从服务器都开始复制新的主服务器了。
+switch-master <master name> <oldip> <oldport> <newip> <newport> ：配置变更，主服务器的 IP 和地址已经改变。 这是绝大多数外部用户都关心的信息。
+tilt ：进入 tilt 模式。
-tilt ：退出 tilt 模式。

## Sentinel 命令
以下列出的是 Sentinel 接受的命令：
* **PING** ：返回 PONG 。
* **SENTINEL masters** ：列出所有被监视的主服务器，以及这些主服务器的当前状态。
* **SENTINEL master <master name>** 显示指定master的信息和状态；
* **SENTINEL slaves <master name>** ：列出给定主服务器的所有从服务器，以及这些从服务器的当前状态。
* **SENTINEL sentinels <master name>** Show a list of sentinel instances for this master, and their state.
* **SENTINEL get-master-addr-by-name <master name>** ： 返回给定名字的主服务器的 IP 地址和端口号。 如果这个主服务器正在执行故障转移操作， 或者针对这个主服务器的故障转移操作已经完成， 那么这个命令返回新的主服务器的 IP 地址和端口号。
* **SENTINEL reset <pattern>** ： 重置所有名字和给定模式 pattern 相匹配的主服务器。 pattern 参数是一个 Glob 风格的模式。 重置操作清楚主服务器目前的所有状态， 包括正在执行中的故障转移， 并移除目前已经发现和关联的， 主服务器的所有从服务器和 Sentinel 。
* **SENTINEL failover <master name>** ： 当主服务器失效时， 在不询问其他 Sentinel 意见的情况下， 强制开始一次自动故障迁移 （不过发起故障转移的 Sentinel 会向其他 Sentinel 发送一个新的配置，其他 Sentinel 会根据这个配置进行相应的更新）。

##
哨兵至少需要 3 个实例，来保证自己的健壮性。
哨兵 + redis 主从的部署架构，是不保证数据零丢失的，只能保证 redis 集群的高可用性。


两种情况和导致数据丢失
* 主备切换的过程，可能会导致数据丢失：
异步复制导致的数据丢失
因为 master->slave 的复制是异步的，所以可能有部分数据还没复制到 slave，master 就宕机了，此时这部分数据就丢失了。
* 脑裂导致的数据丢失
脑裂，也就是说，某个 master 所在机器突然脱离了正常的网络，跟其他 slave 机器不能连接，但是实际上 master 还运行着。此时哨兵可能就会认为 master 宕机了，然后开启选举，将其他 slave 切换成了 master。这个时候，集群里就会有两个 master ，也就是所谓的脑裂。
此时虽然某个 slave 被切换成了 master，但是可能 client 还没来得及切换到新的 master，还继续向旧 master 写数据。因此旧 master 再次恢复的时候，会被作为一个 slave 挂到新的 master 上去，自己的数据会清空，重新从新的 master 复制数据。而新的 master 并没有后来 client 写入的数据，因此，这部分数据也就丢失了。

数据丢失问题的解决方案
进行如下配置：
min-slaves-to-write 1
min-slaves-max-lag 10
表示，要求至少有 1 个 slave，数据复制和同步的延迟不能超过 10 秒。
减少异步复制数据的丢失
有了 min-slaves-max-lag 这个配置，就可以确保说，一旦 slave 复制数据和 ack 延时太长，就认为可能 master 宕机后损失的数据太多了，那么就拒绝写请求，这样可以把 master 宕机时由于部分数据未同步到 slave 导致的数据丢失降低的可控范围内。
减少脑裂的数据丢失
如果一个 master 出现了脑裂，跟其他 slave 丢了连接，那么上面两个配置可以确保说，如果不能继续给指定数量的 slave 发送数据，而且 slave 超过 10 秒没有给自己 ack 消息，那么就直接拒绝客户端的写请求。因此在脑裂场景下，最多就丢失 10 秒的数据。

## 哨兵集群的自动发现机制
哨兵互相之间的发现，是通过 redis 的 pub/sub 系统实现的，每个哨兵都会往 __sentinel__:hello 这个 channel 里发送一个消息，这时候所有其他哨兵都可以消费到这个消息，并感知到其他的哨兵的存在。
每隔两秒钟，每个哨兵都会往自己监控的某个 master+slaves 对应的 __sentinel__:hello channel 里发送一个消息，内容是自己的 host、ip 和 runid 还有对这个 master 的监控配置。
每个哨兵也会去监听自己监控的每个 master+slaves 对应的 __sentinel__:hello channel，然后去感知到同样在监听这个 master+slaves 的其他哨兵的存在。
每个哨兵还会跟其他哨兵交换对 master 的监控配置，互相进行监控配置的同步。

## slave 配置的自动纠正
哨兵会负责自动纠正 slave 的一些配置，比如 slave 如果要成为潜在的 master 候选人，哨兵会确保 slave 复制现有 master 的数据；如果 slave 连接到了一个错误的 master 上，比如故障转移之后，那么哨兵会确保它们连接到正确的 master 上。

## slave->master 选举算法
如果一个 master 被认为 odown 了，而且 majority 数量的哨兵都允许主备切换，那么某个哨兵就会执行主备切换操作，此时首先要选举一个 slave 来，会考虑 slave 的一些信息：

跟 master 断开连接的时长
slave 优先级
复制 offset
run id
如果一个 slave 跟 master 断开连接的时间已经超过了 down-after-milliseconds 的 10 倍，外加 master 宕机的时长，那么 slave 就被认为不适合选举为 master。

(down-after-milliseconds * 10) + milliseconds_since_master_is_in_SDOWN_state
接下来会对 slave 进行排序：

按照 slave 优先级进行排序，slave priority 越低，优先级就越高。
如果 slave priority 相同，那么看 replica offset，哪个 slave 复制了越多的数据，offset 越靠后，优先级就越高。
如果上面两个条件都相同，那么选择一个 run id 比较小的那个 slave。

configuration 传播
哨兵完成切换之后，会在自己本地更新生成最新的 master 配置，然后同步给其他的哨兵，就是通过之前说的 pub/sub 消息机制。

这里之前的 version 号就很重要了，因为各种消息都是通过一个 channel 去发布和监听的，所以一个哨兵完成一次新的切换之后，新的 master 配置是跟着新的 version 号的。其他的哨兵都是根据版本号的大小来更新自己的 master 配置的。

## 参考
https://raw.githubusercontent.com/antirez/redis/4.0/sentinel.conf
http://doc.redisfans.com/topic/sentinel.html