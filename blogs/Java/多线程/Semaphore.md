Semaphore
信号量
用于控制一组资源的访问权限
比如有 5 台电脑，但是有 10 个人，但是每台电脑只能有 1 个人使用，那么剩下的人只能等待其他人使用完

提供了两个构造器
```JAVA
    /**
     * Creates a {@code Semaphore} with the given number of
     * permits and nonfair fairness setting.
     *
     * @param permits the initial number of permits available.
     *        This value may be negative, in which case releases
     *        must occur before any acquires will be granted.
     */
    public Semaphore(int permits) {
        sync = new NonfairSync(permits);
    }
```
第二个构造器 fair 指定在获得资源时是否公平，即先请求的线程先分配资源
```JAVA
    /**
     * Creates a {@code Semaphore} with the given number of
     * permits and the given fairness setting.
     *
     * @param permits the initial number of permits available.
     *        This value may be negative, in which case releases
     *        must occur before any acquires will be granted.
     * @param fair {@code true} if this semaphore will guarantee
     *        first-in first-out granting of permits under contention,
     *        else {@code false}
     */
    public Semaphore(int permits, boolean fair) {
        sync = fair ? new FairSync(permits) : new NonfairSync(permits);
    }
```

通过 acquire() 方法去获取资源
通过 release() 方法去释放资源


原理
Semaphore内部主要通过AQS（AbstractQueuedSynchronizer）实现线程的管理