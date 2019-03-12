CyclicBarrier
回环栅栏、循环屏障。可以被重用。两个构造方法，public CyclicBarrier(int parties, Runnable barrierAction) {}、public CyclicBarrier(int parties) {}。传入的 parties 是指一共需要等待多少个线程达到 barrier 状态（就是调用 CyclicBarrier 的 await() 方法进行等待），当指定数量的线程达到 barrier 状态，那么指定的 parties 数量的线程就会同时被唤醒。至于另外一个参数是 barrierAction 是所有线程达到 barrier 状态时会执行的额外内容（会从由几个线程中最先被唤起的一个去执行这个 Runnable）
可重用是指，当 parties 个线程完成后，如果后面又有 parties 个线程去执行相同逻辑，结果是一样的。比如说每5个1循环，每 5 个 1 循环，而 CountDownLatch 是只能用一次，计数器到0了就用完了

实现原理
CyclicBarrier 主要是由 ReentrantLock 可重入锁和 Condition 共同实现的
```JAVA
    /** The lock for guarding barrier entry */
    private final ReentrantLock lock = new ReentrantLock();
    /** Condition to wait on until tripped */
    private final Condition trip = lock.newCondition();
```

为什么可循环使用？我们可以猜一猜，计数器的值为 0 时，在唤醒所有线程的同时，会重新设置计数器的值为 parties。那么源码是怎么实现的呢？
```JAVA
    /**
     * Updates state on barrier trip and wakes up everyone.
     * Called only while holding lock.
     */
    private void nextGeneration() {
        // signal completion of last generation
        trip.signalAll();
        // set up next generation
        count = parties;
        generation = new Generation();
    }
```
实际的唤醒操作是 nextGeneration() 方法里实现的，果然，唤醒全部线程之后又 `count = parties;` 了，所以又能重新开始一轮
