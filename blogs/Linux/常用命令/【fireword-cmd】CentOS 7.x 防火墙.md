# 【firewall-cmd】CentOS 7.x 防火墙

## 前言
在CentOS 7.x中，有了一种新的防火墙策略，`firewall`
当然你也可以继续使用iptables，得先关闭`firewall`
1. 关闭`firewall`
```
systemctl stop firewalld.service #停止firewall
systemctl disable firewalld.service #禁止firewall开机启动
```
2. 安装`iptables`防火墙
```
yum install iptables-services
```
3. 设置开机启动
```
systemctl enable iptables
```

service iptables status
systemctl status iptables

vim /etc/sysconfig/iptables
```
# sample configuration for iptables service
# you can edit this manually or use system-config-firewall
# please do not ask us to add additional ports/services to this default configuration
*filter
:INPUT ACCEPT [0:0]
:FORWARD ACCEPT [0:0]
:OUTPUT ACCEPT [0:0]
-A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT
-A INPUT -p icmp -j ACCEPT
-A INPUT -i lo -j ACCEPT
-A INPUT -p tcp -m state --state NEW -m tcp --dport 22 -j ACCEPT
-A INPUT -j REJECT --reject-with icmp-host-prohibited
-A FORWARD -j REJECT --reject-with icmp-host-prohibited
COMMIT
```

systemctl restart iptables.service
service iptables restart
