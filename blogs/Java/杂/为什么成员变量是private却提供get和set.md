封装 是指隐藏对象的属性和实现细节，仅对外提供公共访问方式。是面向对象三大特征之一

其实这样说还是有点抽象

我举个栗子来说明一下，可能就好理解了

假如对某一个值进行赋值或修改，需要进行鉴权，或者需要进行一些日志记录之类的操作
成员变量是 public 的话，直接就能被修改
但是是 private 的话，只能通过 set() 方法修改，这样就能在方法里进行一系列操作了


