-Xmx300m  最大堆大小
-Xms300m 初始堆大小
> -Xmx 和-Xms 一般设置为一样大小，这样能稍微提高GC的运行效率，因为他/她不再需要估算堆是否需要调整大小了
-Xmn100m 年轻代大小
-XX:SurvivorRatio=8 Eden区与Survivor区的大小比值，设置为8,则两个Survivor区与一个Eden区的比值为2:8,一个Survivor区占整个年轻代的1/10

-XX:+UseG1GC                　　　　　　使用 G1 (Garbage First) 垃圾收集器
-XX:MaxTenuringThreshold=14        　　提升年老代的最大临界值(tenuring threshold). 默认值为 15[每次GC，增加1岁，到15岁如果还要存活，放入Old区]
-XX:ParallelGCThreads=8            　　设置垃圾收集器在并行阶段使用的线程数[一般设置为本机CPU线程数相等，即本机同时可以处理的个数，设置过大也没有用]
-XX:ConcGCThreads=8            　　　　并发垃圾收集器使用的线程数量

-XX:+HeapDumpOnOutOfMemoryError        OOM时导出堆到文件
-XX:HeapDumpPath=d:/a.dump        　　  导出OOM的路径
-XX:+PrintGCDetails           　　　　   打印GC详细信息
-XX:+PrintGCTimeStamps            　　　 打印CG发生的时间戳
-XX:+PrintHeapAtGC            　　　　　  每一次GC前和GC后，都打印堆信息


**-XX:+AlwaysPreTouch**
JAVA进程启动的时候,虽然我们可以为JVM指定合适的内存大小,但是这些内存操作系统并没有真正的分配给JVM,而是等JVM访问这些内存的时候,才真正分配,这样会造成以下问题。 
1、GC的时候,新生代的对象要晋升到老年代的时候,需要内存,这个时候操作系统才真正分配内存,这样就会加大young gc的停顿时间; 
2、可能存在内存碎片的问题。
有 AlwaysPreTouch 参数,这样 JVM 就会先访问所有分配给它的内存,让操作系统把内存真正的分配给JVM.后续JVM就可以顺畅的访问内存了

G1
避免使用以下参数：
避免使用 -Xmn 选项或 -XX:NewRatio 等其他相关选项显式设置年轻代大小。固定年轻代的大小会覆盖暂停时间目标。
显式的使用-Xmn设置年轻代的大小，会干预G1的默认行为。
G1就不会再考虑设定的暂停时间目标，所以本质上说，设定了年轻代大小就相当于禁用了目标暂停时间
G1就无法根据需要增大或者缩小年轻代的小心。既然大小固定了，就无法在大小上做任何改变了

**-XX:+UseG1GC**
使用 G1 (Garbage First) 垃圾收集器

**-XX:G1HeapRegionSize=n**
设置的 G1 区域的大小。值是 2 的幂，范围是 1 MB 到 32 MB 之间。目标是根据最小的 Java 堆大小划分出约 2048 个区域。

**-XX:MaxGCPauseMillis=200**
为所需的最长暂停时间设置目标值（GC的最大暂停时间）。默认值是 200 毫秒。指定的值不适用于您的堆大小

**-XX:G1NewSizePercent=5**
设置要用作年轻代大小最小值的堆百分比。默认值是 Java 堆的 5%。这是一个实验性的标志。有关示例，请参见“如何解锁实验性虚拟机标志”。此设置取代了 -XX:DefaultMinNewGenPercent 设置。Java HotSpot VM build 23 中没有此设置。

**-XX:G1MaxNewSizePercent=60**
设置要用作年轻代大小最大值的堆大小百分比。默认值是 Java 堆的 60%。这是一个实验性的标志。有关示例，请参见“如何解锁实验性虚拟机标志”。此设置取代了 -XX:DefaultMaxNewGenPercent 设置。Java HotSpot VM build 23 中没有此设置。

**-XX:ParallelGCThreads=n**
设置 STW 工作线程数的值。将 n 的值设置为逻辑处理器的数量。n 的值与逻辑处理器的数量相同，最多为 8。
如果逻辑处理器不止八个，则将 n 的值设置为逻辑处理器数的 5/8 左右。这适用于大多数情况，除非是较大的 SPARC 系统，其中 n 的值可以是逻辑处理器数的 5/16 左右。

**-XX:ConcGCThreads=n**
设置并行标记的线程数。将 n 设置为并行垃圾回收线程数 (ParallelGCThreads) 的 1/4 左右。

**-XX:InitiatingHeapOccupancyPercent=45**
设置触发标记周期的 Java 堆占用率阈值。默认占用率是整个 Java 堆的 45%

**-XX:G1ReservePercent=10**
设置作为空闲空间的预留内存百分比，以降低目标空间溢出的风险。默认值是 10%。增加或减少百分比时，请确保对总的 Java 堆调整相同的量