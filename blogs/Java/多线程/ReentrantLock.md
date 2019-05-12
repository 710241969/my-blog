```Java
public class ReentrantLock implements Lock, java.io.Serializable {

}
```

```Java
    /** Synchronizer providing all implementation mechanics */
    private final Sync sync;
```

```Java
    /**
     * Base of synchronization control for this lock. Subclassed
     * into fair and nonfair versions below. Uses AQS state to
     * represent the number of holds on the lock.
     */
    abstract static class Sync extends AbstractQueuedSynchronizer {

    }
```

```Java
    /**
     * Sync object for fair locks
     */
    static final class FairSync extends Sync {

    }
```

```Java
    /**
     * Sync object for non-fair locks
     */
    static final class NonfairSync extends Sync {

    }
```

```Java
    /**
     * Creates an instance of {@code ReentrantLock}.
     * This is equivalent to using {@code ReentrantLock(false)}.
     */
    public ReentrantLock() {
        sync = new NonfairSync();
    }

    /**
     * Creates an instance of {@code ReentrantLock} with the
     * given fairness policy.
     *
     * @param fair {@code true} if this lock should use a fair ordering policy
     */
    public ReentrantLock(boolean fair) {
        sync = fair ? new FairSync() : new NonfairSync();
    }
```

ReentrantLock 实现 Lock 接口
一个成员变量 private final Sync sync;
Sync 是个抽象类，继承自 AbstractQueuedSynchronizer
Sync 的两个实现类（子类）分别是 FairSync 和 NonfairSync ，公平锁和非公平锁
ReentrantLock 两个构造函数，默认是非公平锁

```Java
        /**
         * Fair version of tryAcquire.  Don't grant access unless
         * recursive call or no waiters or is first.
         */
        protected final boolean tryAcquire(int acquires) {
            final Thread current = Thread.currentThread();
            int c = getState();
            if (c == 0) {
                if (!hasQueuedPredecessors() &&
                    compareAndSetState(0, acquires)) {
                    setExclusiveOwnerThread(current);
                    return true;
                }
            }
            else if (current == getExclusiveOwnerThread()) {
                int nextc = c + acquires;
                if (nextc < 0)
                    throw new Error("Maximum lock count exceeded");
                setState(nextc);
                return true;
            }
            return false;
        }
```

```Java
        protected final boolean tryAcquire(int acquires) {
            return nonfairTryAcquire(acquires);
        }
```
```Java
        /**
         * Performs non-fair tryLock.  tryAcquire is implemented in
         * subclasses, but both need nonfair try for trylock method.
         */
        final boolean nonfairTryAcquire(int acquires) {
            final Thread current = Thread.currentThread();
            int c = getState();
            if (c == 0) {
                if (compareAndSetState(0, acquires)) {
                    setExclusiveOwnerThread(current);
                    return true;
                }
            }
            else if (current == getExclusiveOwnerThread()) {
                int nextc = c + acquires;
                if (nextc < 0) // overflow
                    throw new Error("Maximum lock count exceeded");
                setState(nextc);
                return true;
            }
            return false;
        }
```

公平锁和非公平锁的区别，是在获取锁的机制上的区别。表现在，在尝试获取锁时 —— 公平锁，只有在当前线程是CLH等待队列的表头时，才获取锁；而非公平锁，只要当前锁处于空闲状态，则直接获取锁，而不管CLH等待队列中的顺序。
只有当非公平锁尝试获取锁失败的时候，它才会像公平锁一样，进入CLH等待队列排序等待
可以看到公平锁 tryAcquire 方法和非公平锁 nonfairTryAcquire 方法的差别就在于公平锁多了 !hasQueuedPredecessors() && 这一段