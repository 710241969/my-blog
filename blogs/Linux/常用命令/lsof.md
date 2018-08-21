# lsof

## 介绍
lsof - list open files

在linux环境下，任何事物都以文件的形式存在，通过文件不仅仅可以访问常规数据，还可以访问网络连接和硬件。所以如传输控制协议 (TCP) 和用户数据报协议 (UDP) 套接字等，系统在后台都为该应用程序分配了一个文件描述符，无论这个文件的本质如何，该文件描述符为应用程序与基础操作系统之间的交互提供了通用接口。因为应用程序打开文件的描述符列表提供了大量关于这个应用程序本身的信息，因此通过lsof工具能够查看这个列表对系统监测以及排错将是很有帮助的。

lsof命令用于查看你进程开打的文件，打开文件的进程，进程打开的端口(TCP、UDP)。找回/恢复删除的文件。是十分方便的系统监视工具，因为lsof命令需要访问核心内存和各种文件，所以需要root用户执行。


## 命令格式和选项
### 命令格式
lsof [参数][文件]

### 命令选项

-i [46][protocol][@hostname|hostaddr][:service|port]
选择出和指定的Internet地址信息匹配的文件列表。如果未指定地址信息，则列出所有Internet和x.25 (HP-UX)网络文件。
选项：
**46** 指定IP版本（只有当 UNIX 方言支持 IPv6 的时候，使用 `-i6` 才有效）。如果没有指定则输出全部ip版本
**protocol** 指定网络协议。TCP 或 UDP `-iTCP`
**hostname** 指定主机名。除非指定 IP 版本，否则列出全部IP版本的网络文件
**hostaddr** 指定IP地址。IPv4地址使用点号的数字格式，如 127.0.0.1 ；IPv6地址则用冒号形式的数字地址，括在中括号中，如 [::1] （如果UNIX方言支持IPv6）。当选择IP版本时，只能指定其数字地址。
**service** 指定 /etc/services 中服务的名字，可以多个，使用逗号隔开
**port** 指定端口，可以多个，使用逗号隔开，或者数字的范围使用 - 指定范围 如 1-9999

当指定了其中一个 IP 版本，则另外一个IP版本的文件信息将不会被列出。当打开的IPv4网络文件的地址映射到IPv6地址时，打开文件的类型将是IPv6，而不是IPv4，其显示将由“6”选择，而不是“4”。
指定的命令之间可以不需要空格

简单示例：
-i6 - IPv6 only
TCP:25 - TCP and port 25
@1.2.3.4 - Internet IPv4 host address 1.2.3.4
@[3ffe:1ebc::1]:1234 - Internet IPv6 host address
      3ffe:1ebc::1, port 1234
UDP:who - UDP who service port
TCP@lsof.itap:513 - TCP, port 513 and host name lsof.itap
tcp@foo:1-10,smtp,99 - TCP, ports 1 through 10,
      service name smtp, port 99, host name foo
tcp@bar:1-smtp - TCP, ports 1 through smtp, host bar
:time - either TCP, UDP or UDPLITE time service port
                     

                IPv4 host names and addresses may not be specified if network file selection is limited to IPv6 with -i 6.  IPv6 host names and addresses may not be specified if network file selection is limited to IPv4 with -i4.  When an open IPv4 network file's address is mapped in an IPv6 address, the open file's type will be IPv6, not IPv4, and its display will be selected by '6', not '4'.

                At  least one address component - 4, 6, protocol, hostname, hostaddr, or service - must be supplied.  The `@' character, leading the host specification, is always required; as is the `:', leading the port speci‐
                fication.  Specify either hostname or hostaddr.  Specify either service name list or port number list.  If a service name list is specified, the protocol may also need to be specified if the TCP, UDP and UDPLITE
                port numbers for the service name are different.  Use any case - lower or upper - for protocol.

                Service  names  and  port  numbers  may be combined in a list whose entries are separated by commas and whose numeric range entries are separated by minus signs.  There may be no embedded spaces, and all service
                names must belong to the specified protocol.  Since service names may contain embedded minus signs, the starting entry of a range can't be a service name; it can be a port number, however.


-a：列出打开文件存在的进程；
-c<进程名>：列出指定进程所打开的文件；
-g：列出GID号进程详情；
-d<文件号>：列出占用该文件号的进程；
+d<目录>：列出目录下被打开的文件；
+D<目录>：递归列出目录下被打开的文件；
-n<目录>：列出使用NFS的文件；
-i<条件>：列出符合条件的进程。（4、6、协议、:端口、 @ip ）
-p<进程号>：列出指定进程号所打开的文件；
-u：列出UID号进程详情；
-h：显示帮助信息；
-v：显示版本信息。

  -?|-h list help          -a AND selections (OR)     -b avoid kernel blocks
  -c c  cmd c ^c /c/[bix]  +c w  COMMAND width (9)    +d s  dir s files
  -d s  select by FD set   +D D  dir D tree *SLOW?*   +|-e s  exempt s *RISKY*
  -i select IPv[46] files  -K list tasKs (threads)    -l list UID numbers
  -n no host names         -N select NFS files        -o list file offset
  -O no overhead *RISKY*   -P no port names           -R list paRent PID
  -s list file size        -t terse listing           -T disable TCP/TPI info
  -U select Unix socket    -v list version info       -V verbose search
  +|-w  Warnings (+)       -X skip TCP&UDP* files     -Z Z  context [Z]
  -- end option scan     
  -E display endpoint info              +E display endpoint info and files
  +f|-f  +filesystem or -file names     +|-f[gG] flaGs 
  -F [f] select fields; -F? for help  
  +|-L [l] list (+) suppress (-) link counts < l (0 = all; default = 0)
                                        +m [m] use|create mount supplement
  +|-M   portMap registration (-)       -o o   o 0t offset digits (8)
  -p s   exclude(^)|select PIDs         -S [t] t second stat timeout (15)
  -T qs TCP/TPI Q,St (s) info
  -g [s] exclude(^)|select and print process group IDs
  -i i   select by IPv[46] address: [46][proto][@host|addr][:svc_list|port_list]
  +|-r [t[m<fmt>]] repeat every t seconds (15);  + until no files, - forever.
       An optional suffix to t is m<fmt>; m must separate t from <fmt> and
      <fmt> is an strftime(3) format for the marker line.
  -s p:s  exclude(^)|select protocol (p = TCP|UDP) states by name(s).
  -u s   exclude(^)|select login|UID set s
  -x [fl] cross over +d|+D File systems or symbolic Links

lsof输出各列信息的意义如下：

COMMAND：进程的名称

PID：进程标识符

PPID：父进程标识符（需要指定-R参数）

USER：进程所有者

PGID：进程所属组

FD：文件描述符，应用程序通过文件描述符识别该文件。如cwd、txt等

（1）cwd：表示current work dirctory，即：应用程序的当前工作目录，这是该应用程序启动的目录，除非它本身对这个目录进行更改

（2）txt ：该类型的文件是程序代码，如应用程序二进制文件本身或共享库，如上列表中显示的 /sbin/init 程序

（3）lnn：library references (AIX);

（4）er：FD information error (see NAME column);

（5）jld：jail directory (FreeBSD);

（6）ltx：shared library text (code and data);

（7）mxx ：hex memory-mapped type number xx.

（8）m86：DOS Merge mapped file;

（9）mem：memory-mapped file;

（10）mmap：memory-mapped device;

（11）pd：parent directory;

（12）rtd：root directory;

（13）tr：kernel trace file (OpenBSD);

（14）v86  VP/ix mapped file;

（15）0：表示标准输出

（16）1：表示标准输入

（17）2：表示标准错误

一般在标准输出、标准错误、标准输入后还跟着文件状态模式：r、w、u等

（1）u：表示该文件被打开并处于读取/写入模式

（2）r：表示该文件被打开并处于只读模式

（3）w：表示该文件被打开并处于

（4）空格：表示该文件的状态模式为unknow，且没有锁定

（5）-：表示该文件的状态模式为unknow，且被锁定

同时在文件状态模式后面，还跟着相关的锁

（1）N：for a Solaris NFS lock of unknown type;

（2）r：for read lock on part of the file;

（3）R：for a read lock on the entire file;

（4）w：for a write lock on part of the file;（文件的部分写锁）

（5）W：for a write lock on the entire file;（整个文件的写锁）

（6）u：for a read and write lock of any length;

（7）U：for a lock of unknown type;

（8）x：for an SCO OpenServer Xenix lock on part      of the file;

（9）X：for an SCO OpenServer Xenix lock on the      entire file;

（10）space：if there is no lock.

TYPE：文件类型，如DIR、REG等，常见的文件类型

（1）DIR：表示目录

（2）CHR：表示字符类型

（3）BLK：块设备类型

（4）UNIX： UNIX 域套接字

（5）FIFO：先进先出 (FIFO) 队列

（6）IPv4：网际协议 (IP) 套接字

DEVICE：指定磁盘的名称

SIZE：文件的大小

NODE：索引节点（文件在磁盘上的标识）

NAME：打开文件的确切名称

# 用法示例
* 查看某一端口是否开放
  
  ```Bash
  root@debian:/usr/local/src# lsof -i:3306
  COMMAND PID  USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
  mysqld  605 mysql   14u  IPv6  11938      0t0  TCP *:mysql (LISTEN)
  ```