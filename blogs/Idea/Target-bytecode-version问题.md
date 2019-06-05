问题现象：使用Intellij IDEA新建Java项目，使用jdk1.8版本，设置好Target bytecode version 为1.8，Language level为8。但是，每次新加一个module，所有的设置都变成默认的1.5

解决方法：在工程的pom.xml中添加　

<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <configuration>
                <source>1.8</source>
                <target>1.8</target>
            </configuration>
        </plugin>
    </plugins>
</build>


