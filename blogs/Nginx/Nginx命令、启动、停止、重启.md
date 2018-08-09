# Nginx命令、启动、停止、重启

  -?,-h         : this help
  -v            : show version and exit
  -V            : show version and configure options then exit    显示nginx的版本号和编译信息
  -t            : test configuration and exit                     检查nginx配置文件的正确性
  -T            : test configuration, dump it and exit              检查nginx配置文件的正确定及配置文件的详细配置内容
  -q            : suppress non-error messages during configuration testing
  -s signal     : send signal to a master process: stop, quit, reopen, reload
  -p prefix     : set prefix path (default: /usr/local/nginx/)
  -c filename   : set configuration file (default: conf/nginx.conf)
  -g directives : set global directives out of configuration file

    nginx -s stop  快速关闭 nginx  kill -TERM kill -INT 
    nginx -s quit  优雅的关闭 nginx    kill -QUIT
    nginx -s reload  重新加载配置     kill -HUP 
    nginx -s reopen  重新打开日志文件