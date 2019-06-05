org.apache.catalina.startup.Bootstrap 的 main 函数为入口
初始化一个 Bootstrap 实例
主要还是通过 Bootstrap 的 init() 方法进行

init() 方法
初始化 Tomcat 的类加载器 commonLoader catalinaLoader sharedLoader
创建 Catalina

判断 command.equals("start") 执行 daemon.start(); 里面通过反射调用 org.apache.catalina.startup.Catalina 的 start()
```Java
public void start() {
    //1. 如果持有的 Server 实例为空，就解析 server.xml 创建出来
    if (getServer() == null) {
        load();
    }
    //2. 如果创建失败，报错退出
    if (getServer() == null) {
        log.fatal(sm.getString("catalina.noServer"));
        return;
    }

    //3. 启动 Server
    try {
        getServer().start();
    } catch (LifecycleException e) {
        return;
    }

    // 创建并注册关闭钩子
    if (useShutdownHook) {
        if (shutdownHook == null) {
            shutdownHook = new CatalinaShutdownHook();
        }
        Runtime.getRuntime().addShutdownHook(shutdownHook);
    }

    // 用 await 方法监听停止请求
    if (await) {
        await();
        stop();
    }
}
```


监听 8005 端口 SHUTDOWN 则进入 stop