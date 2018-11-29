# MySQL FIND_IN_SET函数
MySQL提供了一个名为 `FIND_IN_SET()` 的内置字符串函数，允许您在逗号分隔的字符串列表中查找指定字符串的位置。

## 语法
**基本语法**
下面说明了 `FIND_IN_SET()` 函数的语法。
```MYSQL
FIND_IN_SET(needle,haystack);
```

**参数**
`FIND_IN_SET()` 函数接受两个参数：
* 第一个参数 `needle` 是要查找的字符串。
* 第二个参数 `haystack` 是要搜索的逗号分隔的字符串列表。
  
**返回**
`FIND_IN_SET()` 函数根据参数的值返回一个整数或一个 `NULL` 值：
* 如果 `needle` 或 `haystack` 为 `NULL` ，则函数返回 `NULL` 值。
* 如果 `needle` 不在 `haystack` 中，或者 `haystack` 是空字符串，则返回 `0` 。
* 如果 `needle` 在 `haystack` 中，则返回一个正整数，值为 `needle` 所在的位置（从1开始）。
请注意，如果 `needle` 包含逗号( `,` )，该函数将无法正常工作。 此外，如果 `needle` 是一个常量字符串，而且 `haystack` 是一个类型为 `SET` 的列，MySQL将使用位算术优化。

**否定返回值**
因为 `FIND_IN_SET()` 函数在第二个参数中找不到第一个参数时返回0。 因此，您可以使用 `NOT` 运算符来否定 `FIND_IN_SET()` 函数返回的结果值。
也可以使用 `=0` 来否定函数返回的结果值。

** `FIND_IN_SET()` 与 `IN` 运算符**
`column IN (x, y, z)` 表达式与 `FIND_IN_SET(column, 'x,y,z')` 效果相同
但是实际应用还是不要用 `FIND_IN_SET(column, 'x,y,z')` 替代 `IN` ， `IN` 比 `FIND_IN_SET` 性能高。使用 `IN` 时会使用索引，只会查询表中部分数据。 `FIND_IN_SET` 则会查询表中全部数据

## 示例
```MYSQL
mysql> SELECT FIND_IN_SET('1','2,1,3');
+--------------------------+
| FIND_IN_SET('1','2,1,3') |
+--------------------------+
|                        2 |
+--------------------------+
1 row in set
```

```MYSQL
mysql> SELECT FIND_IN_SET('4','1,2,3');
+--------------------------+
| FIND_IN_SET('4','1,2,3') |
+--------------------------+
|                        0 |
+--------------------------+
1 row in set
```