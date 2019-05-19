
[root@localhost network-scripts]# vi ifcfg-enp0s3

[root@localhost network-scripts]# service network restart

虚拟机 ping 主机
主机 ping 虚拟机

可是当通过 ssh 连接的时候发现，等了很久

DNS反向解析的问题
OpenSSH在用户登录的时候会验证IP，它根据用户的IP使用反向DNS找到主机名，再使用DNS找到IP地址，最后匹配一下登录的IP是否合法。如果客户机的IP没有域名，或者DNS服务器很慢或不通，那么登录就会很花时间

DNS 配置一下