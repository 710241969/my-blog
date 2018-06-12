https://www.percona.com/doc/percona-xtrabackup/LATEST/installation/apt_repo.html

Ready-to-use packages are available from the Percona XtraBackup software repositories and the download page.

Supported Releases:

Debian:
7.0 (wheezy)
8.0 (jessie)
9.0 (stretch)
Ubuntu:
14.04LTS (trusty)
16.04LTS (xenial)
17.04 (zesty)
17.10 (artful)
Supported Platforms:

x86
x86_64 (also known as amd64)

Fetch the repository packages from Percona web:

$ wget https://repo.percona.com/apt/percona-release_0.1-4.$(lsb_release -sc)_all.deb
Install the downloaded package with dpkg. To do that, run the following commands as root or with sudo:

$ sudo dpkg -i percona-release_0.1-4.$(lsb_release -sc)_all.deb
Once you install this package the Percona repositories should be added. You can check the repository setup in the /etc/apt/sources.list.d/percona-release.list file.

Remember to update the local cache:

$ sudo apt-get update
After that you can install the package:

$ sudo apt-get install percona-xtrabackup-24

root@debian:/usr/file# xtrabackup --version
xtrabackup version 2.4.11 based on MySQL server 5.7.19 Linux (x86_64) (revision id: b4e0db5)






root@debian:~# innobackupex --defaults-file=/etc/mysql/my.cnf --socket=/var/run/mysqld/mysqld.sock --user=master --password=master --databases="sync_test_1 sync_test_2 sync_test_3" /tmp/mysqlbackup
encryption: using gcrypt 1.7.6-beta
180611 16:26:44 innobackupex: Starting the backup operation

IMPORTANT: Please check that the backup run completes successfully.
           At the end of a successful backup run innobackupex
           prints "completed OK!".

180611 16:26:44  version_check Connecting to MySQL server with DSN 'dbi:mysql:;mysql_read_default_group=xtrabackup;mysql_socket=/var/run/mysqld/mysqld.sock' as 'master'  (using password: YES).
180611 16:26:44  version_check Connected to MySQL server
180611 16:26:44  version_check Executing a version check against the server...
180611 16:26:44  version_check Done.
180611 16:26:44 Connecting to MySQL server host: localhost, user: master, password: set, port: not set, socket: /var/run/mysqld/mysqld.sock
Using server version 5.6.40-log
innobackupex version 2.4.11 based on MySQL server 5.7.19 Linux (x86_64) (revision id: b4e0db5)
xtrabackup: uses posix_fadvise().
xtrabackup: cd to /var/lib/mysql
xtrabackup: open files limit requested 0, set to 1024
xtrabackup: using the following InnoDB configuration:
xtrabackup:   innodb_data_home_dir = .
xtrabackup:   innodb_data_file_path = ibdata1:12M:autoextend
xtrabackup:   innodb_log_group_home_dir = ./
xtrabackup:   innodb_log_files_in_group = 2
xtrabackup:   innodb_log_file_size = 50331648
InnoDB: Number of pools: 1
180611 16:26:44 >> log scanned up to (1665292)
xtrabackup: Generating a list of tablespaces
Skipping db: ./mysql
InnoDB: Allocated tablespace ID 7 for sync_test_2/person_tbl, old maximum was 0
Skipping db: ./test
Skipping db: ./performance_schema
xtrabackup: Starting 4 threads for parallel data files transfer
180611 16:26:44 [04] Copying ./ibdata1 to /tmp/mysqlbackup/2018-06-11_16-26-44/ibdata1
180611 16:26:44 [03] Copying ./sync_test_2/person_tbl.ibd to /tmp/mysqlbackup/2018-06-11_16-26-44/sync_test_2/person_tbl.ibd
180611 16:26:44 [02] Copying ./sync_test_1/person_tbl.ibd to /tmp/mysqlbackup/2018-06-11_16-26-44/sync_test_1/person_tbl.ibd
180611 16:26:44 [02]        ...done
180611 16:26:44 [03]        ...done
180611 16:26:44 [01] Copying ./sync_test_3/person_tbl.ibd to /tmp/mysqlbackup/2018-06-11_16-26-44/sync_test_3/person_tbl.ibd
180611 16:26:44 [01]        ...done
180611 16:26:45 [04]        ...done
180611 16:26:45 >> log scanned up to (1665292)
180611 16:26:45 Executing FLUSH NO_WRITE_TO_BINLOG TABLES...
180611 16:26:45 Executing FLUSH TABLES WITH READ LOCK...
180611 16:26:45 Starting to backup non-InnoDB tables and files
Skipping db: ./mysql
180611 16:26:45 [01] Skipping ./mysql-master-bin.000001.
180611 16:26:45 [01] Copying ./sync_test_2/person_tbl.frm to /tmp/mysqlbackup/2018-06-11_16-26-44/sync_test_2/person_tbl.frm
180611 16:26:45 [01]        ...done
180611 16:26:45 [01] Copying ./sync_test_2/db.opt to /tmp/mysqlbackup/2018-06-11_16-26-44/sync_test_2/db.opt
180611 16:26:45 [01]        ...done
180611 16:26:45 [01] Skipping ./auto.cnf.
180611 16:26:45 [01] Skipping ./ibdata1.
Skipping db: ./test
180611 16:26:45 [01] Skipping ./ib_logfile1.
180611 16:26:45 [01] Copying ./sync_test_1/person_tbl.frm to /tmp/mysqlbackup/2018-06-11_16-26-44/sync_test_1/person_tbl.frm
180611 16:26:45 [01]        ...done
180611 16:26:45 [01] Copying ./sync_test_1/db.opt to /tmp/mysqlbackup/2018-06-11_16-26-44/sync_test_1/db.opt
180611 16:26:45 [01]        ...done
180611 16:26:45 [01] Skipping ./ib_logfile0.
180611 16:26:45 [01] Skipping ./mysql-master-bin.index.
180611 16:26:45 [01] Skipping ./mysql-master-bin.000002.
Skipping db: ./performance_schema
180611 16:26:45 [01] Copying ./sync_test_3/person_tbl.frm to /tmp/mysqlbackup/2018-06-11_16-26-44/sync_test_3/person_tbl.frm
180611 16:26:45 [01]        ...done
180611 16:26:45 [01] Copying ./sync_test_3/db.opt to /tmp/mysqlbackup/2018-06-11_16-26-44/sync_test_3/db.opt
180611 16:26:45 [01]        ...done
180611 16:26:45 Finished backing up non-InnoDB tables and files
180611 16:26:45 [00] Writing /tmp/mysqlbackup/2018-06-11_16-26-44/xtrabackup_binlog_info
180611 16:26:45 [00]        ...done
180611 16:26:45 Executing FLUSH NO_WRITE_TO_BINLOG ENGINE LOGS...
xtrabackup: The latest check point (for incremental): '1665292'
xtrabackup: Stopping log copying thread.
.180611 16:26:45 >> log scanned up to (1665292)

180611 16:26:46 Executing UNLOCK TABLES
180611 16:26:46 All tables unlocked
180611 16:26:46 Backup created in directory '/tmp/mysqlbackup/2018-06-11_16-26-44/'
MySQL binlog position: filename 'mysql-master-bin.000002', position '120'
180611 16:26:46 [00] Writing /tmp/mysqlbackup/2018-06-11_16-26-44/backup-my.cnf
180611 16:26:46 [00]        ...done
180611 16:26:46 [00] Writing /tmp/mysqlbackup/2018-06-11_16-26-44/xtrabackup_info
180611 16:26:46 [00]        ...done
xtrabackup: Transaction log of lsn (1665292) to (1665292) was copied.
180611 16:26:46 completed OK!
root@debian:~# 









root@debian:~# innobackupex --defaults-file=/etc/mysql/my.cnf --socket=/var/run/mysqld/mysqld.sock --user=master --password=master  --parallel=4 --databases="sync_test_1 sync_test_2 sync_test_3" --apply-log/ /tmp/mysqlbackup/
encryption: using gcrypt 1.7.6-beta
180611 16:29:30 innobackupex: Starting the backup operation

IMPORTANT: Please check that the backup run completes successfully.
           At the end of a successful backup run innobackupex
           prints "completed OK!".

180611 16:29:30  version_check Connecting to MySQL server with DSN 'dbi:mysql:;mysql_read_default_group=xtrabackup;mysql_socket=/var/run/mysqld/mysqld.sock' as 'master'  (using password: YES).
180611 16:29:30  version_check Connected to MySQL server
180611 16:29:30  version_check Executing a version check against the server...
180611 16:29:30  version_check Done.
180611 16:29:30 Connecting to MySQL server host: localhost, user: master, password: set, port: not set, socket: /var/run/mysqld/mysqld.sock
Using server version 5.6.40-log
innobackupex version 2.4.11 based on MySQL server 5.7.19 Linux (x86_64) (revision id: b4e0db5)
xtrabackup: uses posix_fadvise().
xtrabackup: cd to /var/lib/mysql
xtrabackup: open files limit requested 0, set to 1024
xtrabackup: using the following InnoDB configuration:
xtrabackup:   innodb_data_home_dir = .
xtrabackup:   innodb_data_file_path = ibdata1:12M:autoextend
xtrabackup:   innodb_log_group_home_dir = ./
xtrabackup:   innodb_log_files_in_group = 2
xtrabackup:   innodb_log_file_size = 50331648
InnoDB: Number of pools: 1
180611 16:29:30 >> log scanned up to (1665292)
xtrabackup: Generating a list of tablespaces
Skipping db: ./mysql
InnoDB: Allocated tablespace ID 7 for sync_test_2/person_tbl, old maximum was 0
Skipping db: ./test
Skipping db: ./performance_schema
xtrabackup: Starting 4 threads for parallel data files transfer
180611 16:29:31 [04] Copying ./ibdata1 to /root/tmp/mysqlbackup/2018-06-11_16-29-30/ibdata1
180611 16:29:31 [03] Copying ./sync_test_2/person_tbl.ibd to /root/tmp/mysqlbackup/2018-06-11_16-29-30/sync_test_2/person_tbl.ibd
180611 16:29:31 [02] Copying ./sync_test_1/person_tbl.ibd to /root/tmp/mysqlbackup/2018-06-11_16-29-30/sync_test_1/person_tbl.ibd
180611 16:29:31 [02]        ...done
180611 16:29:31 [03]        ...done
180611 16:29:31 [01] Copying ./sync_test_3/person_tbl.ibd to /root/tmp/mysqlbackup/2018-06-11_16-29-30/sync_test_3/person_tbl.ibd
180611 16:29:31 [01]        ...done
180611 16:29:31 [04]        ...done
180611 16:29:31 >> log scanned up to (1665292)
180611 16:29:32 Executing FLUSH NO_WRITE_TO_BINLOG TABLES...
180611 16:29:32 Executing FLUSH TABLES WITH READ LOCK...
180611 16:29:32 Starting to backup non-InnoDB tables and files
Skipping db: ./mysql
180611 16:29:32 [01] Skipping ./mysql-master-bin.000001.
180611 16:29:32 [01] Copying ./sync_test_2/person_tbl.frm to /root/tmp/mysqlbackup/2018-06-11_16-29-30/sync_test_2/person_tbl.frm
180611 16:29:32 [01]        ...done
180611 16:29:32 [01] Copying ./sync_test_2/db.opt to /root/tmp/mysqlbackup/2018-06-11_16-29-30/sync_test_2/db.opt
180611 16:29:32 [01]        ...done
180611 16:29:32 [01] Skipping ./auto.cnf.
180611 16:29:32 [01] Skipping ./ibdata1.
Skipping db: ./test
180611 16:29:32 [01] Skipping ./ib_logfile1.
180611 16:29:32 [01] Copying ./sync_test_1/person_tbl.frm to /root/tmp/mysqlbackup/2018-06-11_16-29-30/sync_test_1/person_tbl.frm
180611 16:29:32 [01]        ...done
180611 16:29:32 [01] Copying ./sync_test_1/db.opt to /root/tmp/mysqlbackup/2018-06-11_16-29-30/sync_test_1/db.opt
180611 16:29:32 [01]        ...done
180611 16:29:32 [01] Skipping ./ib_logfile0.
180611 16:29:32 [01] Skipping ./mysql-master-bin.index.
180611 16:29:32 [01] Skipping ./mysql-master-bin.000002.
Skipping db: ./performance_schema
180611 16:29:32 [01] Copying ./sync_test_3/person_tbl.frm to /root/tmp/mysqlbackup/2018-06-11_16-29-30/sync_test_3/person_tbl.frm
180611 16:29:32 [01]        ...done
180611 16:29:32 [01] Copying ./sync_test_3/db.opt to /root/tmp/mysqlbackup/2018-06-11_16-29-30/sync_test_3/db.opt
180611 16:29:32 [01]        ...done
180611 16:29:32 Finished backing up non-InnoDB tables and files
180611 16:29:32 [00] Writing /root/tmp/mysqlbackup/2018-06-11_16-29-30/xtrabackup_binlog_info
180611 16:29:32 [00]        ...done
180611 16:29:32 Executing FLUSH NO_WRITE_TO_BINLOG ENGINE LOGS...
xtrabackup: The latest check point (for incremental): '1665292'
xtrabackup: Stopping log copying thread.
.180611 16:29:32 >> log scanned up to (1665292)

180611 16:29:32 Executing UNLOCK TABLES
180611 16:29:32 All tables unlocked
180611 16:29:32 Backup created in directory '/root/tmp/mysqlbackup/2018-06-11_16-29-30/'
MySQL binlog position: filename 'mysql-master-bin.000002', position '120'
180611 16:29:32 [00] Writing /root/tmp/mysqlbackup/2018-06-11_16-29-30/backup-my.cnf
180611 16:29:32 [00]        ...done
180611 16:29:32 [00] Writing /root/tmp/mysqlbackup/2018-06-11_16-29-30/xtrabackup_info
180611 16:29:32 [00]        ...done
xtrabackup: Transaction log of lsn (1665292) to (1665292) was copied.
180611 16:29:32 completed OK!
root@debian:~# 

```
root@debian:/tmp/mysqlbackup# scp -r 2018-06-11_16-26-44/ wang@192.168.6.4:/tmp/mysqlbackup/
wang@192.168.6.4's password: 
xtrabackup_checkpoints                                                                                                                                                                                 100%  113   329.5KB/s   00:00    
person_tbl.frm                                                                                                                                                                                         100% 8650    16.4MB/s   00:00    
db.opt                                                                                                                                                                                                 100%   67   213.8KB/s   00:00    
person_tbl.ibd                                                                                                                                                                                         100%   96KB  57.7MB/s   00:00    
ibdata1                                                                                                                                                                                                100%   12MB  89.9MB/s   00:00    
person_tbl.frm                                                                                                                                                                                         100% 8650    14.9MB/s   00:00    
db.opt                                                                                                                                                                                                 100%   67   193.2KB/s   00:00    
person_tbl.ibd                                                                                                                                                                                         100%   96KB  58.2MB/s   00:00    
xtrabackup_binlog_info                                                                                                                                                                                 100%   28    87.5KB/s   00:00    
xtrabackup_info                                                                                                                                                                                        100%  615     1.6MB/s   00:00    
backup-my.cnf                                                                                                                                                                                          100%  481     1.3MB/s   00:00    
person_tbl.frm                                                                                                                                                                                         100% 8650    21.0MB/s   00:00    
db.opt                                                                                                                                                                                                 100%   67   177.4KB/s   00:00    
person_tbl.ibd                                                                                                                                                                                         100%   96KB  56.2MB/s   00:00    
xtrabackup_logfile                                                                                                                                                                                     100% 2560     6.9MB/s   00:00    
```
root 默认不能ssh连接


xtrabackup: Error: --defaults-file must be specified first on the command line
----提示配置文件参数必须放在第一位
```
innobackupex --defaults-file=/etc/mysql/my.cnf --socket=/var/run/mysqld/mysqld.sock --user=root --password=slave --copy-back --force-non-empty-directories --redo-only /tmp/backup/
root@debian:~# innobackupex --defaults-file=/etc/mysql/my.cnf --socket=/var/run/mysqld/mysqld.sock --user=root --password=slave --copy-back /tmp/mysqlbackup/
encryption: using gcrypt 1.7.6-beta
180611 04:44:55 innobackupex: Starting the copy-back operation

IMPORTANT: Please check that the copy-back run completes successfully.
           At the end of a successful copy-back run innobackupex
           prints "completed OK!".

innobackupex version 2.4.11 based on MySQL server 5.7.19 Linux (x86_64) (revision id: b4e0db5)
Original data directory /var/lib/mysql is not empty!
```
需要删除之前的data目录下的，我们可以对原有的data目录进行重命名。
mv /data/mysql/mysql_3307/data /data/mysql/mysql_3307/data_bak_20141107






root@debian:/var/lib# ls -al
total 108
drwxr-xr-x 27 root  root  4096 Jun 11 04:53 .
drwxr-xr-x 11 root  root  4096 Jun  8 03:44 ..
drwxr-xr-x  5 root  root  4096 Jun 11 04:43 apt
drwxr-xr-x  2 root  root  4096 Jun  8 03:52 aspell
drwxr-xr-x  2 root  root  4096 Jun  8 03:53 dbus
drwxr-xr-x  2 root  root  4096 Jun 10 23:35 dhcp
drwxr-xr-x  4 root  root  4096 Jun  8 03:53 dictionaries-common
drwxr-xr-x  7 root  root  4096 Jun 11 04:43 dpkg
drwxr-xr-x  3 root  root  4096 Jun  8 03:52 emacsen-common
drwxr-xr-x  2 root  root  4096 Jun  8 03:45 initramfs-tools
drwxr-xr-x  2 root  root  4096 Jun  8 03:53 ispell
drwxr-xr-x  2 root  root  4096 Jan  7  2017 logrotate
drwxr-xr-x  2 root  root  4096 Jun  8 03:53 man-db
drwxr-xr-x  2 root  root  4096 Feb 23 18:23 misc
drwxr-x---  5 root  root  4096 Jun 11 04:53 mysql
drwxr-x---  5 mysql mysql 4096 Jun 11 00:01 mysql_201806111653
drwxrwx---  2 mysql mysql 4096 Jun 11 00:01 mysql-files
drwxr-x---  2 mysql mysql 4096 Jun 11 00:01 mysql-keyring
drwxr-xr-x  2 root  root  4096 Jul 13  2017 os-prober
drwxr-xr-x  2 root  root  4096 Jun  8 03:53 pam
drwxr-xr-x  2 root  root  4096 Jun  8 03:52 python
drwxr-xr-x  2 root  root  4096 Jun  8 03:53 sgml-base
drwxr-xr-x  6 root  root  4096 Jun  8 06:09 systemd
drwxr-xr-x  3 root  root  4096 Jun  8 03:53 ucf
drwxr-xr-x  2 root  root  4096 Jun  8 03:45 usbutils
drwxr-xr-x  3 root  root  4096 Jun  8 03:44 vim
drwxr-xr-x  2 root  root  4096 Jun  8 03:53 xml-core
root@debian:/var/lib# chown -R mysql:mysql mysql
root@debian:/var/lib# ls -al
total 108
drwxr-xr-x 27 root  root  4096 Jun 11 04:53 .
drwxr-xr-x 11 root  root  4096 Jun  8 03:44 ..
drwxr-xr-x  5 root  root  4096 Jun 11 04:43 apt
drwxr-xr-x  2 root  root  4096 Jun  8 03:52 aspell
drwxr-xr-x  2 root  root  4096 Jun  8 03:53 dbus
drwxr-xr-x  2 root  root  4096 Jun 10 23:35 dhcp
drwxr-xr-x  4 root  root  4096 Jun  8 03:53 dictionaries-common
drwxr-xr-x  7 root  root  4096 Jun 11 04:43 dpkg
drwxr-xr-x  3 root  root  4096 Jun  8 03:52 emacsen-common
drwxr-xr-x  2 root  root  4096 Jun  8 03:45 initramfs-tools
drwxr-xr-x  2 root  root  4096 Jun  8 03:53 ispell
drwxr-xr-x  2 root  root  4096 Jan  7  2017 logrotate
drwxr-xr-x  2 root  root  4096 Jun  8 03:53 man-db
drwxr-xr-x  2 root  root  4096 Feb 23 18:23 misc
drwxr-x---  5 mysql mysql 4096 Jun 11 04:53 mysql
drwxr-x---  5 mysql mysql 4096 Jun 11 00:01 mysql_201806111653
drwxrwx---  2 mysql mysql 4096 Jun 11 00:01 mysql-files
drwxr-x---  2 mysql mysql 4096 Jun 11 00:01 mysql-keyring
drwxr-xr-x  2 root  root  4096 Jul 13  2017 os-prober
drwxr-xr-x  2 root  root  4096 Jun  8 03:53 pam
drwxr-xr-x  2 root  root  4096 Jun  8 03:52 python
drwxr-xr-x  2 root  root  4096 Jun  8 03:53 sgml-base
drwxr-xr-x  6 root  root  4096 Jun  8 06:09 systemd
drwxr-xr-x  3 root  root  4096 Jun  8 03:53 ucf
drwxr-xr-x  2 root  root  4096 Jun  8 03:45 usbutils
drwxr-xr-x  3 root  root  4096 Jun  8 03:44 vim
drwxr-xr-x  2 root  root  4096 Jun  8 03:53 xml-core


root@debian:/var/lib# innobackupex --defaults-file=/etc/mysql/my.cnf --socket=/var/run/mysqld/mysqld.sock --user=root --password=slave --copy-back --force-non-empty-directories /tmp/mysqlbackup/2018-06-12_00-00-16/            
encryption: using gcrypt 1.7.6-beta
180611 22:21:54 innobackupex: Starting the copy-back operation

IMPORTANT: Please check that the copy-back run completes successfully.
           At the end of a successful copy-back run innobackupex
           prints "completed OK!".

innobackupex version 2.4.11 based on MySQL server 5.7.19 Linux (x86_64) (revision id: b4e0db5)
innobackupex: Can't create/write to file '/var/lib/mysql/ibdata1' (Errcode: 17 - File exists)
[01] error: cannot open the destination stream for ibdata1
[01] Error: copy_file() failed.
root@debian:/var/lib# rm mysql/ib
ibdata1      ib_logfile0  ib_logfile1  
root@debian:/var/lib# rm mysql/ib*
root@debian:/var/lib# innobackupex --defaults-file=/etc/mysql/my.cnf --socket=/var/run/mysqld/mysqld.sock --user=root --password=slave --copy-back --force-non-empty-directories /tmp/mysqlbackup/2018-06-12_00-00-16/

CHANGE MASTER TO
MASTER_HOST='192.168.6.3',
MASTER_PORT=3306,
MASTER_USER='master',
MASTER_PASSWORD='master'
MASTER_LOG_FILE='mysql-master-bin.000002',
MASTER_LOG_POS=0;
