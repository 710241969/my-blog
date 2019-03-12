# MySQL使用规范总结
2018-06-15 14:41:40

## 前言
将我从工作以来根据自己的经验，参考其他大厂的规范，学习、积累到的一些MySQL上的使用规范进行一个小总结吧，统一一个良好的规范，百利而无一害啊。

## 总结

### 创建规范
* **使用 `utf8mb4` 作为字符编码**
说明：MySQL的utf8只支持每个字符3个字节，并不是真正的UTF-8。
当出现类似emoji表情的字符，MySQL的utf8是存不了的。应当使用`utf8mb4`

* **表必备三字段：`id`, `gmt_create`, `gmt_modified`**
说明：id 必为主键，类型为`UNSIGNED BIGINT`、单表时自增、步长为 1
gmt_create,gmt_modified 的类型均为`DATETIME`类型，前者现在时表示主动创建，后者过去分词表示被动更新。


### 命名规范
* **字段名禁用保留字，如 `DESC`、`RANGE`、`MATCH`、`DELAYED` 等**

* **表名不使用复数名词**
说明：表名应该仅仅表示表里面的实体内容，不应该表示实体数量

* **使用 `is_xxx` 的字段表达是与否**
说明：数据类型为 `TINYINT(1) UNSIGNED` ，1 表示是，0 表示否
如表达逻辑删除的字段名 `is_deleted` ，1 表示删除，0 表示未删除。

### 数据类型
* **任何字段都应当设置为 `NOT NULL` 并设置默认值，除非极特殊情况**
说明：引用官方说明
> “NULL columns require additional space in the row to record whether their values are NULL. 
For MyISAM tables, each NULL column takes one bit extra, rounded up to the nearest byte.”
>
(1) NULL 需要占用空间，而空值不占用
(2) NULL 只能采用 `IS NULL`、`IS NOT NULL` 判断，并且在使用 `=`、`!=`、`IN`、`NOT IN` 时会有坑哦
(3) MySQL 难以优化引用可空列查询，它会使索引、索引统计和值更加复杂。B树索引时不会存储NULL值的，所以如果索引的字段可以为NULL，索引的效率会下降很多
**注意：**在进行 count() 统计某列的记录数的时候，如果采用的 NULL 值，系统会自动忽略掉，但是空值是会进行统计到其中的

* **小数的数据类型设置为 `DECIMAL` **
说明：禁止使用 `FLOAT` 和 `DOUBLE`。
float 和 double 在存储的时候，存在精度损失的问题，很可能在值的比较时，得到不正确的结果。如果存储的数据范围超过 decimal 的范围，建议将数据拆成整数和小数分开存储。

* **任何字段如果为非负数，必须是`UNSIGNED`**
**注意：**对 UNSIGNED 字段进行相减，可能会得到 ERROR 1690 (22003): BIGINT UNSIGNED value is out of range in 的报错，或者得到其字段表示范围的最大值 例如 INT UNSIGNED 预期结果是 -1 但是可能得到结果 4294967295 。这是因为无符号整形计算的结果还是无符号的，如果结果是负数则得不到预期的结果。解决这个问题，需要对 SQL_MODE 设置 NO_UNSIGNED_SUBTRACTION

* **表示时间的字段都使用`DATETIME`类型**
用DECIMAL数据类型的货币数据，可参考以下语法： DECIMAL(19,2);
但是，如果要遵守公认会计原则(GAAP)规则，则货币栏必须至少包含4位小数，以确保舍入值不超过$0.01。 在这种情况下，应该定义具有4位小数的列，如下所示： DECIMAL(19,4);

* **表达是与否概念的字段使用`TINYINT(1) UNSIGNED`类型**
说明：1 表示是，0 表示否
如表达逻辑删除的字段名`is_deleted`，1 表示删除，0 表示未删除。

还有很多，索引什么的。。有点懒。。未完待续，有空持续更新





