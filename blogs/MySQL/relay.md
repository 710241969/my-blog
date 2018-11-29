一、问题描述

Mysql主从复制模式中，slave上报错 “relay log read failure”，导致主从同步停止。

mysql> show slave status\G

*************************** 1. row ***************************

               Slave_IO_State:

                  Master_Host: 10.0.0.93

                  Master_User: slaveuser

                  Master_Port: 3306

                Connect_Retry: 60

              Master_Log_File: dd-bin.002542

          Read_Master_Log_Pos: 752973519

               Relay_Log_File: dd-relay.002949

                Relay_Log_Pos: 950583160

        Relay_Master_Log_File: dd-bin.002540

             Slave_IO_Running: Yes

            Slave_SQL_Running: No

              Replicate_Do_DB:

          Replicate_Ignore_DB: mysql,test,information_schema

           Replicate_Do_Table:

       Replicate_Ignore_Table:

      Replicate_Wild_Do_Table:

  Replicate_Wild_Ignore_Table:

                   Last_Errno: 1594

                   Last_Error: Relay log read failure: Could not parse relay log event entry. The possible reasons are: the master's binary log is corrupted (you can check this by running 'mysqlbinlog' on the binary log), the slave's relay log is corrupted (you can check this by running 'mysqlbinlog' on the relay log), a network problem, or a bug in the master's or slave's MySQL code. If you want to check the master's binary log or slave's relay log, you will be able to know their names by issuing 'SHOW SLAVE STATUS' on this slave.

                 Skip_Counter: 0

          Exec_Master_Log_Pos: 950583017

              Relay_Log_Space: 2900478067

              Until_Condition: None

               Until_Log_File:

                Until_Log_Pos: 0

           Master_SSL_Allowed: No

           Master_SSL_CA_File:

           Master_SSL_CA_Path:

              Master_SSL_Cert:

            Master_SSL_Cipher:

               Master_SSL_Key:

        Seconds_Behind_Master: NULL

Master_SSL_Verify_Server_Cert: No

                Last_IO_Errno: 0

                Last_IO_Error:

               Last_SQL_Errno: 1594

               Last_SQL_Error: Relay log read failure: Could not parse relay log event entry. The possible reasons are: the master's binary log is corrupted (you can check this by running 'mysqlbinlog' on the binary log), the slave's relay log is corrupted (you can check this by running 'mysqlbinlog' on the relay log), a network problem, or a bug in the master's or slave's MySQL code. If you want to check the master's binary log or slave's relay log, you will be able to know their names by issuing 'SHOW SLAVE STATUS' on this slave.

  Replicate_Ignore_Server_Ids:

             Master_Server_Id: 93

1 row in set (0.00 sec)

=============================================



二、原因分析

      报错信息为从库“无法读取relay log 里的条目”，可能原因为master库的binglog错误，或slave库的中继日志错误。或者为网络问题及bug原因。

      一般是由于网络故障或slave库压力过大，导致relay-log格式错误造成的。找到当前已经同步的时间点，重新设置主从同步，就会产生新的中继日志，恢复正常。



三、问题处理

从"show  slave  status\G"的输出中，找到如下信息：

Relay_Master_Log_File: dd-bin.002540     //slave库已读取的master的binlog

Exec_Master_Log_Pos: 950583017           //在slave上已经执行的position位置点



    停掉slave，以slave已经读取的binlog文件，和已经执行的position为起点，重新设置同步。会产生新的中继日志，问题解决。

（不需要指定host，user，password等，默认使用当前已经设置好的）

mysql>stop slave;

mysql>change master to master_log_file='dd-bin.002540' , master_log_pos=950583017;

mysql>start slave;



四、验证结果

再次查看，错误已经解决，slave 开始追 master 的日志

mysql>show  slave status\G

Exec_Master_Log_Pos: 225927489        //slave上已经执行的position已经变化

Seconds_Behind_Master: 58527            //slave  落后主库的时间，单位秒



过几秒钟，再次查看。离与master同步更近了

mysql>show  slave status\G

Exec_Master_Log_Pos: 307469867

Seconds_Behind_Master: 29570



五、从relay-log中验证最后同步日志position。（作为验证，非必须）

还可以从  Relay_Log_File: dd-relay.002949  的记录找到当前已经同步的position。

使用mysqlbinlog 查看中继日志 dd-relay.002949 最后的记录

#mysqlbinlog  dd-relay.002949 >/tmp/relay_log.sql

#tail   /tmp/relay_log.sql

# at 950582947

#140914 3:32:30 server id 93 end_log_pos 950582990 Query	thread_id=1256813	exec_time=0	error_code=0

SET TIMESTAMP=1410636750/*!*/;

insert into blog_month_post_count (id, `count`) values (34509691, 0) on duplicate key update `count`=values(`count`)

/*!*/;

# at 950583133

#140914 3:32:30 server id 93 end_log_pos 950583017 Xid = 14033635514

COMMIT/*!*/;

# at 950583160

#140914 3:32:30 server id 93 end_log_pos 950583092 Query	thread_id=1256815	exec_time=0	error_code=0

SET TIMESTAMP=1410636750/*!*/;

BEGIN

/*!*/;

DELIMITER ;

# End of log file

ROLLBACK /* added by mysqlbinlog */;

/*!50003 SET COMPLETION_TYPE=@OLD_COMPLETION_TYPE*/;

可以看到，中继日志中最后一次执行成功的position 为 950583017，与 Exec_Master_Log_Pos: 950583017 记录一致。