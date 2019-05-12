java.util.concurrent.*

锁
三个接口
Lock
Condition
ReadWriteLock
三个抽象类
AbstractOwnableSynchronizer
AbstractQueuedLongSynchronizer
AbstractQueuedSynchronizer
锁
ReentrantLock 独占锁
ReentrantReadWriteLock 读写锁

AtomicInteger CAS
AtomicLong 64位的long 和 double 变量由于会被JVM当作两个分离的32位来进行操作，所以不具有原子性。而使用AtomicLong能让long的操作保持原子型 CAS
AtomicBoolean CAS

JUC 集合
CopyOnWriteArrayList 相当于线程安全的ArrayList，底层是没有容量的 volatile 修饰的 Object[] ，顾名思义，当数组有变化时重新建立一个新的数组。通过 ReentrantLock 加锁增删改操作，复制数组。适合读多写少场景，所以写场景少，每次加1个容量，不会浪费空间。读取到的是可能脏数据，size，contains也都是统计的老的数组的值
CopyOnWriteArraySet 相当于线程安全的HashSet 通过 CopyOnWriteArrayList 实现，所以 API 基本上都是通过调用CopyOnWriteArrayList的API来实现的，先读副本判断是否存在，再加锁，再判断当前是否和读的副本一致


ConcurrentHashMap 是线程安全的哈希表(相当于线程安全的HashMap)
ConcurrentSkipListMap 是线程安全的有序的哈希表(相当于线程安全的TreeMap) 通过“跳表”来实现的 并发安全主要由 CAS 来实现
ConcurrentSkipListSet 是线程安全的有序的集合(相当于线程安全的TreeSet) 通过ConcurrentSkipListMap实现，只用到了ConcurrentSkipListMap中的key ， value 是 Boolean.TRUE


ArrayBlockingQueue 数组实现的线程安全的有界的阻塞队列， Object[] items ReentrantLock 两个 Condition 一个锁，两个 condition
LinkedBlockingQueue 单向链表实现的阻塞队列，可指定大小，该队列按 FIFO（先进先出）排序元素，有两个锁 putLock是插入锁，takeLock是取出锁；notEmpty是“非空条件”，notFull是“未满条件”。通过它们对链表进行并发控制，对于“插入”和“取出(删除)”操作分别使用了不同的锁。对于插入操作，通过“插入锁putLock”进行同步；对于取出操作，通过“取出锁takeLock”进行同步，两个锁，两个 condition
LinkedBlockingDeque 双向链表实现的双向并发阻塞队列，可指定大小，该阻塞队列同时支持FIFO和FILO两种操作方式 一个锁，两个 condition
ConcurrentLinkedQueue 单向链表实现的无界队列，该队列按 FIFO（先进先出）排序元素 CAS
ConcurrentLinkedDeque 双向链表实现的无界队列，该队列同时支持FIFO和FILO两种操作方式 CAS
SynchronousQueue
PriorityBlockingQueue 二叉堆结构的无界优先级阻塞队列，二叉堆 Object[] queue 二叉堆一般用数组来表示。如果根节点在数组中的位置是1，第n个位置的子节点分别在 2*n 和 2*n+1。因此，第1个位置的子节点在2和3，第2个位置的子节点在4和5。以此类推。这种基于1的数组存储方式便于寻找父节点和子节点。如果存储数组的下标基于0，那么下标为i的节点的子节点是 2*n + 1 与 2*(n+1)；其父节点的下标是 (n − 1)/2，PriorityBlockingQueue 中使用的就是基于0下标的二叉堆。 使用显示锁 Lock 保证线程安全
DealyQueue 无界延时阻塞队列，元素顺序按照过期时间排序，通过显式锁 ReentrantLock 保证并发安全 使用优先级队列PriorityQueue实现元素存储


newCachedThreadPool
可缓存线程池，如果线程池长度超过处理需要，可灵活回收空闲线程，若无可回收，则新建线程
工作线程的创建数量几乎没有限制(其实也有限制的,数目为Interger. MAX_VALUE), 这样可灵活的往线程池中添加线程。
如果长时间没有往线程池中提交任务，即如果工作线程空闲了指定的时间(默认为1分钟)，则该工作线程将自动终止。终止后，如果你又提交了新的任务，则线程池重新创建一个工作线程。
在使用CachedThreadPool时，一定要注意控制任务的数量，否则，由于大量线程同时运行，很有会造成系统瘫痪
newFixedThreadPool
创建一个指定工作线程数量的线程池。每当提交一个任务就创建一个工作线程，如果工作线程数量达到线程池初始的最大数，则将提交的任务存入到池队列中。
FixedThreadPool是一个典型且优秀的线程池，它具有线程池提高程序效率和节省创建线程时所耗的开销的优点。但是，在线程池空闲时，即线程池中没有可运行任务时，它不会释放工作线程，还会占用一定的系统资源
newSingleThreadExecutor
创建一个单线程化的Executor，即只创建唯一的工作者线程来执行任务，它只会用唯一的工作线程来执行任务，保证所有任务按照指定顺序(FIFO, LIFO, 优先级)执行。如果这个线程异常结束，会有另一个取代它，保证顺序执行。单工作线程最大的特点是可保证顺序地执行各个任务，并且在任意给定的时间不会有多个线程是活动的
newScheduleThreadPool
创建一个定长的线程池，而且支持定时的以及周期性的任务执行，支持定时及周期性任务执行