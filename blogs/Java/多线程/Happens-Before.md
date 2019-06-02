# Happens-Before


字面翻译过来就是先行发生， A happens-before B 就是A先行发生于B ？
这是不准确的

前面一个操作的结果对后续操作是可见的，即前一个操作的结果可以被后续的操作获取

程序次序规则：在一个线程内一段代码的执行结果是有序的。就是还会指令重排，但是随便它怎么排，结果是按照我们代码的顺序生成的不会变！

管程锁定规则：就是无论是在单线程环境还是多线程环境，对于同一个锁来说，一个线程对这个锁解锁之后，另一个线程获取了这个锁都能看到前一个线程的操作结果！(管程是一种通用的同步原语，synchronized就是管程的实现）

volatile变量规则：就是如果一个线程先去写一个volatile变量，然后一个线程去读这个变量，那么这个写操作的结果一定对读的这个线程可见。

线程启动规则：在主线程A执行过程中，启动子线程B，那么线程A在启动子线程B之前对共享变量的修改结果对线程B可见。

线程终止规则：在主线程A执行过程中，子线程B终止，那么线程B在终止之前对共享变量的修改结果在线程A中可见。

线程中断规则：对线程interrupt()方法的调用先行发生于被中断线程代码检测到中断事件的发生，可以通过Thread.interrupted()检测到是否发生中断。

传递规则：这个简单的，就是happens-before原则具有传递性，即A happens-before B ， B happens-before C，那么A happens-before C。

对象终结规则：这个也简单的，就是一个对象的初始化的完成，也就是构造函数执行的结束一定 happens-before它的finalize()方法




构造函数中 this 引用逸出的问题
this引用逃逸（"this"escape）是指对象还没有构造完成，它的this引用就被发布出去了
final 修饰变量时，初衷是告诉编译器：这个变量生而不变，可以可劲儿优化
Java 编译器在 1.5 以前的版本的确优化得很努力，以至于都优化错了
构造函数的错误重排导致线程可能看到 final 变量的值会变化
在下面例子中，在构造函数里面将 this 赋值给了全局变量 global.obj，这就是“逸出”
线程通过 global.obj 读取 x 是有可能读到 0 的
```Java
public class FinalReferenceEscapeExample {
    final int i;
    static FinalReferenceEscapeExample OBJ;
 
    // 错误的构造函数
    public FinalReferenceEscapeExample () {
        i = 1;
        // 此处就是将 this 逸出，
        OBJ = this;
    }
}
```
回忆一下类的初始化过程。这里可能由于重排序， this 还没有初始化完就先赋值到了 OBJ 中


1. 在构造函数内对一个final域的写入,与随后把这个被构造对象的引用赋值给一个引用
变量,这两个操作之间不能重排序
2. 初次读一个包含final域的对象的引用,与随后初次读这个final域,这两个操作之间不能