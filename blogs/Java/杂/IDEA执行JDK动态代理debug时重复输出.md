IDEA直接run运行没有问题，但debug下重复输出时间语句。Eclipse中run和debug都没有问题。

原因：单步调试时IDEA会调用被代理类的toString()方法

代理类会代理目标类的所有方法（包括toString），因此会重复输出