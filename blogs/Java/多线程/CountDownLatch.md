CountDownLatch
只有一个构造器 public CountDownLatch(int count) {  };，传入一个 int 。实现了一个线程计数器的功能，比如一个线程A，他要等待其他5个线程执行完之后才开始执行，就可以使用 CountDownLatch ，设置值为 4 。线程通过调用 CountDownLatch 的 await() 方法进行等待，其余线程执行完，调用 CountDownLatch 的 countDown() 方法，使内部计数器数值减一，计数器为 0 时，被 await() 的线程将被唤醒
原理：内部类 Sync 继承了 AbstractQueuedSynchronizer ，构造器传入的值其实就是 AQS 的 state 成员的值。 await() 的实现原理其实就是 AQS 的 doAcquireSharedInterruptibly 方法，就是一个 for(;;) 的死循环，不断得等待计数器的值为 0 才跳出循环

一个成员变量 `private final Sync sync;` 继承自 AbstractQueuedSynchronizer
