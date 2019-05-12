```Java
public class ReentrantReadWriteLock
        implements ReadWriteLock, java.io.Serializable {

}
```

```Java
    /** Inner class providing readlock */
    private final ReentrantReadWriteLock.ReadLock readerLock;
    /** Inner class providing writelock */
    private final ReentrantReadWriteLock.WriteLock writerLock;
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
     * Fair version of Sync
     */
    static final class FairSync extends Sync {

    }
```

```Java
    /**
     * Nonfair version of Sync
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

ReentrantReadWriteLock 实现 ReadWriteLock 接口
三个成员变量
和 ReentrantLock 一样，其中一个成员变量 `private final Sync sync;` 分别有两个实现类（公平和非公平）；也是两个构造函数，默认是非公平锁
读写锁均实现 Lock 接口