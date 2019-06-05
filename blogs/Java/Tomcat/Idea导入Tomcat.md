首先下载 Tomcat 源码
我的是
https://www-us.apache.org/dist/tomcat/tomcat-9/v9.0.20/src/apache-tomcat-9.0.20-src.zip

解压

我直接在目录下创建一个 pom.xml
```Xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <groupId>org.apache.tomcat</groupId>
    <artifactId>tomcat</artifactId>
    <name>tomcat</name>
    <version>9.0.20</version>

    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.apache.ant</groupId>
            <artifactId>ant</artifactId>
            <version>1.10.5</version>
        </dependency>
        <dependency>
            <groupId>wsdl4j</groupId>
            <artifactId>wsdl4j</artifactId>
            <version>1.6.3</version>
        </dependency>

        <!--<dependency>-->
            <!--<groupId>javax.xml</groupId>-->
            <!--<artifactId>jaxrpc</artifactId>-->
            <!--<version>1.1</version>-->
        <!--</dependency>-->
        <dependency>
            <groupId>org.apache.geronimo.specs</groupId>
            <artifactId>geronimo-jaxrpc_1.1_spec</artifactId>
            <version>2.1</version>
        </dependency>

<!--        <dependency>-->
<!--            <groupId>org.eclipse.jdt.core.compiler</groupId>-->
<!--            <artifactId>ecj</artifactId>-->
<!--            <version>4.5</version>-->
<!--        </dependency>-->
        <dependency>
            <groupId>org.eclipse.jdt</groupId>
            <artifactId>ecj</artifactId>
            <version>3.17.0</version>
        </dependency>


        <dependency>
            <groupId>org.easymock</groupId>
            <artifactId>easymock</artifactId>
            <version>4.0.2</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                    <encoding>UTF-8</encoding>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-resources-plugin</artifactId>
                <configuration>
                    <encoding>UTF-8</encoding>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

idea 打开


把 java 文件夹标记为 Sources，test 文件夹标记为 Tests

新建一个 Run/Debug

Main Class org.apache.catalina.startup.Bootstrap

D:\WangYiming\Code\Java\apache-tomcat-9.0.20-src\test\util\TestCookieFilter.java
Error:(29, 36) java: 找不到符号
  符号:   变量 CookieFilter
  位置: 类 util.TestCookieFilter
解决： CookieFilter 找不到，把 home\webapps\examples\WEB-INF\classes\util\CookieFilter.java 文件拷贝到 test\util 目录下

D:\WangYiming\Code\Java\apache-tomcat-9.0.20-src\test\org\apache\coyote\http2\TestStream.java
Error:(33, 16) java: 程序包trailers不存在
Error:(91, 49) java: 找不到符号
  符号:   类 ResponseTrailers
  位置: 类 org.apache.coyote.http2.TestStream
解决： ResponseTrailers 找不到，把 home\webapps\examples\WEB-INF\classes\trailers 目录拷贝到 test 目录下


严重: Servlet.service() for servlet [jsp] in context with path [] threw exception [org.apache.jasper.JasperException: Unable to compile class for JSP] with root cause
java.lang.NullPointerException
解决：可以不管
编辑 org.apache.catalina.startup.ContextConfig 文件的 configureStart() 方法，添加初始化 JSP 解析器的代码，大概 781 行
context.addServletContainerInitializer(new JasperInitializer(), null);

严重: Error configuring application listener of class [listeners.ContextListener]
java.lang.ClassNotFoundException: listeners.ContextListener
解决：可以不管


最后访问 http://127.0.0.1:8080/ 就可以看到欢迎页了