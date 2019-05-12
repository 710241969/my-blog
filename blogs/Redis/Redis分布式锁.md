# Redis分布式锁的正确实现
## 前言
首先，这篇博客内容大部分来自转载，我作出了实践，所以很想记录一下。
本博客内容是以JAVA为后端语言，这个思想和方式是正确的，其他语言也大同小异。
分布式锁一般有三种实现方式：1. 数据库乐观锁；2. 基于Redis的分布式锁；3. 基于ZooKeeper的分布式锁。
本篇博客将介绍第二种方式，基于Redis实现分布式锁。

## 锁的可靠性
首先，还得说一下这个基础的问题。为了确保分布式锁可用，我们至少要确保锁的实现同时满足以下四个条件：
1. 互斥性。在任意时刻，只有一个客户端能持有锁。
2. 不会发生死锁。即使有一个客户端在持有锁的期间崩溃而没有主动解锁，也能保证后续其他客户端能加锁。
3. 具有容错性。只要大部分的Redis节点正常运行，客户端就可以加锁和解锁。
4. 加锁和解锁必须是同一个客户端，客户端自己不能把别人加的锁给解了。

## 加锁
先说正确加锁，再说说网上看到的其他加锁方式的问题
**正确加锁**
```Java
public class RedisTool {

    private static final String LOCK_SUCCESS = "OK";
    private static final String SET_IF_NOT_EXIST = "NX";
    private static final String SET_WITH_EXPIRE_TIME = "PX";

    /**
     * 尝试获取分布式锁
     * @param jedis Redis客户端
     * @param lockKey 锁
     * @param requestId 请求标识
     * @param expireTime 超期时间
     * @return 是否获取成功
     */
    public static boolean tryGetDistributedLock(Jedis jedis, String lockKey, String requestId, int expireTime) {

        String result = jedis.set(lockKey, requestId, SET_IF_NOT_EXIST, SET_WITH_EXPIRE_TIME, expireTime);

        if (LOCK_SUCCESS.equals(result)) {
            return true;
        }
        return false;

    }

}
```
`jedis.set(String key, String value, String nxxx, String expx, long time)`
正确加锁，通过这个set方法实现，一个五个形参
* key ，要加锁的内容，使用是唯一的，
* value ，使用一个能唯一标识当前客户端或者请求的值，可以使用 `UUID.randomUUID().toString()` 作为value。为什么需要这样？这是上面提到的锁的可靠性的第四点，**解铃还须系铃人**，谁加的锁，谁才能够去解
* nxxx ，这里会传入 `NX` ，将这个set操作设置为 **Only set the key if it does not already exist** ，只有当这个key不存在的时候才能够进行set操作，返回成功，否则不执行任何操作
  TIPS：参数另外一个可选项为 `XX` ，和 `NX` 相反， **Only set the key if it already exist** ，当key存在的时候才进行set操作
* expx ，这里传入的可选值为 `EX` | `PX`。这个参数用来设置过期时间的单位。 EX 的过期时间单位是 seconds 秒， PX 的过期时间单位是 milliseconds 毫秒
* time ，设置过期时间，根据第三个参数来设置

总的来说，执行上面的set()方法就只会导致两种结果：1. 当前没有锁（key不存在），那么就进行加锁操作，并对锁设置个有效期，同时value表示加锁的客户端。2. 已有锁存在，不做任何操作。
上面的操作，可以发现已经满足我们可靠性里描述的三个条件。首先，set()加入了NX参数，可以保证如果已有key存在，则函数不会调用成功，也就是只有一个客户端能持有锁，满足互斥性。其次，由于我们对锁设置了过期时间，即使锁的持有者后续发生崩溃而没有解锁，锁也会因为到了过期时间而自动解锁（即key被删除），不会发生死锁。最后，因为我们将value赋值为requestId，代表加锁的客户端请求标识，那么在客户端在解锁的时候就可以进行校验是否是同一个客户端。由于我们只考虑Redis单机部署的场景，所以容错性我们暂不考虑。

**错误示例1**
比较常见的错误示例就是使用jedis.setnx()和jedis.expire()组合实现加锁，代码如下：
```Java
public static void wrongGetLock1(Jedis jedis, String lockKey, String requestId, int expireTime) {

    Long result = jedis.setnx(lockKey, requestId);
    if (result == 1) {
        // 若在这里程序突然崩溃，则无法设置过期时间，将发生死锁
        jedis.expire(lockKey, expireTime);
    }

}
```
解析：
setnx()方法作用就是SET IF NOT EXIST
expire()方法就是给锁加一个过期时间
乍一看好像和前面的set()方法结果一样，然而由于这是两条Redis命令，**不具有原子性**，如果程序在执行完setnx()之后突然崩溃，导致锁没有设置过期时间，**那么将会发生死锁**。网上之所以有人这样实现，是因为低版本的jedis并不支持多参数的set()方法。

**错误示例2**
这一种错误示例就比较难以发现问题，而且实现也比较复杂。实现思路：使用jedis.setnx()命令实现加锁，其中key是锁，value是锁的过期时间。执行过程：1. 通过setnx()方法尝试加锁，如果当前锁不存在，返回加锁成功。2. 如果锁已经存在则获取锁的过期时间，和当前时间比较，如果锁已经过期，则设置新的过期时间，返回加锁成功。代码如下：
```Java
public static boolean wrongGetLock2(Jedis jedis, String lockKey, int expireTime) {

    long expires = System.currentTimeMillis() + expireTime;
    String expiresStr = String.valueOf(expires);

    // 如果当前锁不存在，返回加锁成功
    if (jedis.setnx(lockKey, expiresStr) == 1) {
        return true;
    }

    // 如果锁存在，获取锁的过期时间
    String currentValueStr = jedis.get(lockKey);
    if (currentValueStr != null && Long.parseLong(currentValueStr) < System.currentTimeMillis()) {
        // 锁已过期，获取上一个锁的过期时间，并设置现在锁的过期时间
        String oldValueStr = jedis.getSet(lockKey, expiresStr);
        if (oldValueStr != null && oldValueStr.equals(currentValueStr)) {
            // 考虑多线程并发的情况，只有一个线程的设置值和当前值相同，它才有权利加锁
            return true;
        }
    }
        
    // 其他情况，一律返回加锁失败
    return false;

}
```
那么这段代码问题在哪里？
1. 由于是客户端（指redis客户端）自己生成过期时间，所以需要强制要求分布式下每个客户端的时间必须同步。 
2. 当锁过期的时候，如果多个客户端同时执行jedis.getSet()方法，那么虽然最终只有一个客户端可以加锁，但是这个客户端的锁的过期时间可能被其他客户端覆盖。
3. 锁不具备拥有者标识，即任何客户端都可以解锁。

## 解锁
还是先说正确的，再说说网上看到的其他方式的问题
### 正确解锁
```JAVA
public class RedisTool {

    private static final Long RELEASE_SUCCESS = 1L;

    /**
     * 释放分布式锁
     * @param jedis Redis客户端
     * @param lockKey 锁
     * @param requestId 请求标识
     * @return 是否释放成功
     */
    public static boolean releaseDistributedLock(Jedis jedis, String lockKey, String requestId) {

        String script = "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end";
        Object result = jedis.eval(script, Collections.singletonList(lockKey), Collections.singletonList(requestId));

        if (RELEASE_SUCCESS.equals(result)) {
            return true;
        }
        return false;

    }

}
```
可以看到，我们解锁只需要两行代码就搞定了！第一行代码，我们写了一个简单的Lua脚本代码，上一次见到这个编程语言还是在《黑客与画家》里，没想到这次居然用上了。第二行代码，我们将Lua代码传到jedis.eval()方法里，并使参数KEYS[1]赋值为lockKey，ARGV[1]赋值为requestId。eval()方法是将Lua代码交给Redis服务端执行。

那么这段Lua代码的功能是什么呢？其实很简单，首先获取锁对应的value值，检查是否与requestId相等，如果相等则删除锁（解锁）。那么为什么要使用Lua语言来实现呢？因为要确保上述操作是原子性的。那么为什么执行eval()方法可以确保原子性，源于Redis的特性，下面是官网对eval命令的部分解释：
> ### Atomicity of scripts
> 
>Redis uses the same Lua interpreter to run all the commands. Also Redis guarantees that a script is executed in an atomic way: no other script or Redis command will be executed while a script is being executed. This semantic is similar to the one of MULTI / EXEC. From the point of view of all the other clients the effects of a script are either still not visible or already completed.
>
> However this also means that executing slow scripts is not a good idea. It is not hard to create fast scripts, as the script overhead is very low, but if you are going to use slow scripts you should be aware that while the script is running no other client can execute commands.
>
> 翻译一下：
> 
> ### 脚本的原子性
> 
> Redis 使用单个 Lua 解释器去运行所有脚本，并且， Redis 也保证脚本会以原子性(atomic)的方式执行：当某个脚本正在运行的时候，不会有其他脚本或 Redis 命令被执行。这和使用 MULTI / EXEC 包围的事务很类似。在其他别的客户端看来，脚本的效果(effect)要么是不可见的(not visible)，要么就是已完成的(already completed)。
> 
> 另一方面，这也意味着，执行一个运行缓慢的脚本并不是一个好主意。写一个跑得很快很顺溜的脚本并不难，因为脚本的运行开销(overhead)非常少，但是当你不得不使用一些跑得比较慢的脚本时，请小心，因为当这些蜗牛脚本在慢吞吞地运行的时候，其他客户端会因为服务器正忙而无法执行命令

上面的加锁和解锁，其实redis官方文档，在set操作中也给出了详细的做法
<a target="_blank" href="https://redis.io/commands/set">Jedis官方文档</a>

> ### Patterns
> 
> Note: The following pattern is discouraged in favor of the Redlock algorithm which is only a bit more complex to implement, but offers better guarantees and is fault tolerant.
> 
> The command SET resource-name anystring NX EX max-lock-time is a simple way to implement a locking system with Redis.
>
> A client can acquire the lock if the above command returns OK (or retry after some time if the command returns Nil), and remove the lock just using DEL.
>
> The lock will be auto-released after the expire time is reached.
>
> It is possible to make this system more robust modifying the unlock schema as follows:
>
> * Instead of setting a fixed string, set a non-guessable large random string, called token.
> * Instead of releasing the lock with DEL, send a script that only removes the key if the value matches.
> 
> This avoids that a client will try to release the lock after the expire time deleting the key created by another client that acquired the lock later.
>
> An example of unlock script would be similar to the following:
> ```
> if redis.call("get",KEYS[1]) == ARGV[1]
> then
>     return redis.call("del",KEYS[1])
> else
>     return 0
> end
> ```
> The script should be called with EVAL ...script... 1 resource-name token-value
> 
> 翻译一下
> ### 使用模式
> 命令 SET resource-name anystring NX EX max-lock-time 是一种在 Redis 中实现锁的简单方法。
>
> 客户端执行以上的命令：
>
> 如果服务器返回 OK ，那么这个客户端获得锁。
> 如果服务器返回 NIL ，那么客户端获取锁失败，可以在稍后再重试。
> 设置的过期时间到达之后，锁将自动释放。
>
> 可以通过以下修改，让这个锁实现更健壮：
>
> 不使用固定的字符串作为键的值，而是设置一个不可猜测（non-guessable）的长随机字符串，作为口令串（token）。
> 不使用 DEL 命令来释放锁，而是发送一个 Lua 脚本，这个脚本只在客户端传入的值和键的口令串相匹配时，才对键进行删除。
> 这两个改动可以防止持有过期锁的客户端误删现有锁的情况出现。
> 
> 以下是一个简单的解锁脚本示例：
> ```
> if redis.call("get",KEYS[1]) == ARGV[1]
> then
>     return redis.call("del",KEYS[1])
> else
>     return 0
> end
> ```
> 这个脚本可以通过 EVAL ...script... 1 resource-name token-value 命令来调用。

**错误示例1**
最常见的解锁代码就是直接使用jedis.del()方法删除锁，这种不先判断锁的拥有者而直接解锁的方式，会导致任何客户端都可以随时进行解锁，即使这把锁不是它的。这样的解锁，会让加锁毫无意义
```
public static void wrongReleaseLock1(Jedis jedis, String lockKey) {
    jedis.del(lockKey);
}
```

**错误示例2**
这种解锁代码乍一看也是没问题，甚至我之前也差点这样实现，与正确姿势差不多，唯一区别的是分成两条命令去执行，代码如下：
```
public static void wrongReleaseLock2(Jedis jedis, String lockKey, String requestId) {
        
    // 判断加锁与解锁是不是同一个客户端
    if (requestId.equals(jedis.get(lockKey))) {
        // 若在此时，这把锁突然不是这个客户端的，则会误解锁
        jedis.del(lockKey);
    }

}
```
如代码注释，问题在于如果调用jedis.del()方法的时候，这把锁已经不属于当前客户端的时候会解除他人加的锁。那么是否真的有这种场景？答案是肯定的，比如客户端A加锁，一段时间之后客户端A解锁，在执行jedis.del()之前，锁突然过期了，此时客户端B尝试加锁成功，然后客户端A再执行del()方法，则将客户端B的锁给解除了。产生问题的临界点是设置的锁在解锁前过期。

## 总结
本文主要介绍了如何使用Java代码正确实现Redis分布式锁，对于加锁和解锁也分别给出了两个比较经典的错误示例。其实想要通过Redis实现分布式锁并不难，只要保证能满足可靠性里的四个条件。互联网虽然给我们带来了方便，只要有问题就可以google，然而网上的答案一定是对的吗？其实不然，所以我们更应该时刻保持着质疑精神，多想多验证。

如果你的项目中Redis是多机部署的，那么可以尝试使用Redisson实现分布式锁，这是Redis官方提供的Java组件（等我用一下再说）

## redis 分布式锁和 zk 分布式锁的对比
redis 分布式锁，其实需要自己不断去尝试获取锁，比较消耗性能。
zk 分布式锁，获取不到锁，注册个监听器即可，不需要不断主动尝试获取锁，性能开销较小。
另外一点就是，如果是 redis 获取锁的那个客户端 出现 bug 挂了，那么只能等待超时时间之后才能释放锁；而 zk 的话，因为创建的是临时 znode，只要客户端挂了，znode 就没了，此时就自动释放锁。



## 参考
<a target="_blank" href="https://www.javadoc.io/doc/redis.clients/jedis/2.9.0">Jedis官方文档</a>
<a target="_blank" href="https://redis.io/commands/set">Redis官方文档</a>
https://wudashan.cn/2017/10/23/Redis-Distributed-Lock-Implement/#%E5%8F%82%E8%80%83%E9%98%85%E8%AF%BB