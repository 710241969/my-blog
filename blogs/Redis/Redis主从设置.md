# Redis主从设置
## 前言
接着前面的部分，我们来搭建简单的redis主从配置。我这里设置一主二从
主 ip 192.168.220.3
从1 ip 192.168.220.4
从2 ip 192.168.220.5

## 流程步骤
### 1. 在conf文件中配置
前面讲过的，
`slaveof <masterip> <masterport>`
`masterauth <master-password>`
两个配置，在配置文件里加入，重启redis就好

### 2. 使用redis-cli客户端连接后设置
在这里我讲讲第二种
> **TIPS: **这种方式在重启后会失去主从关系

首先，参考前面的Redis配置和启动，我们在从的机器上启动redis服务，下面都以 从1 192.168.220.4 为例，从2 的步骤都是一样的
从机器开启redis服务
```Bash
root@debian:/usr/local/src/redis-4.0.11/src# ./redis-server ../redis_6379.conf 
506:C 07 Aug 21:50:31.183 # oO0OoO0OoO0Oo Redis is starting oO0OoO0OoO0Oo
506:C 07 Aug 21:50:31.183 # Redis version=4.0.11, bits=64, commit=00000000, modified=0, pid=506, just started
506:C 07 Aug 21:50:31.184 # Configuration loaded
```
然后通过redis-cli连接上本机服务
```Bash
root@debian:/usr/local/src/redis-4.0.11/src# ./redis-cli -p 6379
127.0.0.1:6379> auth wangwang
OK
127.0.0.1:6379> 
```
然后通过 `slaveof <masterip> <masterport>` 命令设置为从库
```Bash
127.0.0.1:6379> SLAVEOF 192.168.220.3 6379
OK
```
看到OK，是不是就可以了呢？稳一点，再看看主从状态，通过 `INFO Replication` 查看复制状态
```Bash
127.0.0.1:6379> INFO Replication
# Replication
role:slave
master_host:192.168.220.3
master_port:6379
master_link_status:down                             <---------------- DOWN!!!!!
master_last_io_seconds_ago:-1
master_sync_in_progress:0
slave_repl_offset:1
master_link_down_since_seconds:1533693621
slave_priority:100
slave_read_only:1
connected_slaves:0
master_replid:c12277806e3d4ddb8de31be3c10f79566fc09042
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:0
second_repl_offset:-1
repl_backlog_active:0
repl_backlog_size:1048576
repl_backlog_first_byte_offset:0
repl_backlog_histlen:0
127.0.0.1:6379> 
```
可以看到，slave连接不上master！我们也可以再看看这时主库的状态，在 主 192.168.220.3 通过 `INFO Replication` 看一下复制状态
```Bash
127.0.0.1:6379> INFO replication
# Replication
role:master
connected_slaves:0                  <-------------------- 并没有从库连接
master_replid:a8e0d77fb016e89ee7d20e0936565716604c8071
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:0
second_repl_offset:-1
repl_backlog_active:0
repl_backlog_size:1048576
repl_backlog_first_byte_offset:0
repl_backlog_histlen:0
127.0.0.1:6379> 
```
这时为啥呢？不要忘记了，我们是设置了密码的，还记得 `masterauth <master-password>` 的配置项吗，我们从库还漏了一步，如果主库设置了密码，从库必须在配置文件里面加上这个配置，加上之后，重启Redis，再尝试连接看看？
```Bash
root@debian:/usr/local/src/redis-4.0.11/src# ./redis-cli -p 6379               
127.0.0.1:6379> auth wangwang
OK
127.0.0.1:6379> slaveof 192.168.220.3 6379
OK
127.0.0.1:6379> info replication
# Replication
role:slave
master_host:192.168.220.3
master_port:6379
master_link_status:up                     <--------------------- 终于可以了
master_last_io_seconds_ago:2
master_sync_in_progress:0
slave_repl_offset:0
slave_priority:100
slave_read_only:1
connected_slaves:0
master_replid:595ed8ec5cd2b23aaccb4f2cddb10d2487003efc
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:0
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:0
```
可以连上了，再看看主库的状态
```Bash
127.0.0.1:6379> INFO replication
# Replication
role:master
connected_slaves:1                                 <------------------------ 已经成功连上一个从库
slave0:ip=192.168.220.4,port=6379,state=online,offset=14,lag=1
master_replid:595ed8ec5cd2b23aaccb4f2cddb10d2487003efc
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:14
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:14
```
这时我们在主库插入一条数据
```Bash
127.0.0.1:6379> set test_key test_value
OK
127.0.0.1:6379> 
```
然后在从库获取一下看看
```Bash
127.0.0.1:6379> KEYs *
1) "test_key"
127.0.0.1:6379> GET test_key
"test_value"
127.0.0.1:6379> 
```
搞定，主从设置完成，另外一台机子也是一样的操作啦

> **TIPS: **在一个已经拥有数据的redis服务上，将他设置为从库的话，在主从同步完成后，这个redis服务之前的数据都会被删除或者覆盖掉
>
> 例如，我先在 192.168.220.5 Redis上操作（还没设置为从库），插入一条数据 
```Bash
root@debian:/usr/local/src/redis-4.0.11/src# ./redis-server ../redis_6379.conf
root@debian:/usr/local/src/redis-4.0.11/src# ./redis-cli -p 6379
127.0.0.1:6379> auth wangwang
OK
127.0.0.1:6379> set foo bar
OK
127.0.0.1:6379> KEYS *
1) "foo"
```
这是再将他设置为从库
```Bash
127.0.0.1:6379> slaveof 192.168.220.3 6379
OK
```
这时候再看下同步后的数据
```Bash
127.0.0.1:6379> KEYS *
1) "test_key"
127.0.0.1:6379> 
```
可以看到，之前的数据已经不见了，剩下的是从主库同步来的数据
>


