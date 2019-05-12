语法上error可以被catch
但是 OutOfMemoryError不应该去catch,出现OutOfMemoryError不管是因为一次巨大的内存分配还是内存泄漏导致,都是程序设计的问题



```Java
/**
 * An {@code Error} is a subclass of {@code Throwable}
 * that indicates serious problems that a reasonable application
 * should not try to catch. Most such errors are abnormal conditions.
 * The {@code ThreadDeath} error, though a "normal" condition,
 * is also a subclass of {@code Error} because most applications
 * should not try to catch it.
 * <p>
 * A method is not required to declare in its {@code throws}
 * clause any subclasses of {@code Error} that might be thrown
 * during the execution of the method but not caught, since these
 * errors are abnormal conditions that should never occur.
 *
 * That is, {@code Error} and its subclasses are regarded as unchecked
 * exceptions for the purposes of compile-time checking of exceptions.
 *
 * @author  Frank Yellin
 * @see     java.lang.ThreadDeath
 * @jls 11.2 Compile-Time Checking of Exceptions
 * @since   JDK1.0
 */
```
{@code Error}是{@code Throwable}的子类，表示合理的应用程序不应该试图捕获的严重问题。 大多数此类错误都是异常情况。 {@code ThreadDeath}错误虽然是“正常”条件，但也是{@code Error}的子类，因为大多数应用程序都不应该尝试捕获它。
一个方法不需要在其{@code throws}子句中声明在执行方法期间可能抛出但未捕获的{@code Error}的任何子类，因为这些错误是永远不应发生的异常情况。
 *
也就是说，{@code Error}及其子类被视为未经检查的异常，用于编译时异常检查。



```Java
/**
 * The class {@code Exception} and its subclasses are a form of
 * {@code Throwable} that indicates conditions that a reasonable
 * application might want to catch.
 *
 * <p>The class {@code Exception} and any subclasses that are not also
 * subclasses of {@link RuntimeException} are <em>checked
 * exceptions</em>.  Checked exceptions need to be declared in a
 * method or constructor's {@code throws} clause if they can be thrown
 * by the execution of the method or constructor and propagate outside
 * the method or constructor boundary.
 *
 * @author  Frank Yellin
 * @see     java.lang.Error
 * @jls 11.2 Compile-Time Checking of Exceptions
 * @since   JDK1.0
 */
```
类{@code Exception}及其子类是{@code Throwable}的一种形式，表示合理的应用程序可能想要捕获的条件。
类{@code Exception}和任何不属于{@link RuntimeException}子类的子类都是<em> checked exceptions </ em>。 如果方法或构造函数的{@code throws}子句可以通过执行方法或构造函数抛出并在方法或构造函数边界外传播，则需要在方法或构造函数的{@code throws}子句中声明已检查的异常。