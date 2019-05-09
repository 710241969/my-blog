问题起因
新安装的虚拟机 CentOS-7-x86_64-Minimal-1810.iso

`# ping www.baidu.com`
connect： Network is unreachable

原因
CentOS7 mini 默认没有打开网卡，看到anaconda-ks.cfg文件里的配置。


解决
命令 cd /etc/sysconfig/network-scripts/
命令 ls 查看该目录文件
查看文件
打开你的第一个文件，命令 vi ifcfg-ens33
修改ONBOOT为yes

最后重启网络，命令 service network restart

