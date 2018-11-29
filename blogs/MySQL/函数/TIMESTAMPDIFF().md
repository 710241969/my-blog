# MySQL TIMESTAMPDIFF函数
> TIPS: 在 MYSQL 里面，两个 datetime 类型相减是得不到想要的结果的

MySQL 提供了 `IMESTAMPDIFF()` 函数来计算两个 `DATE` 或 `DATETIME` 值之间的差值。

## 语法
**基本语法**
下面说明了 `TIMESTAMPDIFF()` 函数的语法。
```MYSQL
TIMESTAMPDIFF(unit, begin, end);
```

**返回**
`TIMESTAMPDIFF` 函数返回 `end-begin` (减)的结果，其中 `begin` 和 `end` 是 `DATE` 或 `DATETIME` 表达式。

**参数**
`TIMESTAMPDIFF` 函数允许其参数具有混合类型，例如， `begin` 是 `DATE` 值， `end` 可以是 `DATETIME` 值。 如果使用 `DATE` 值，则 `TIMESTAMPDIFF` 函数将其视为时间部分为 `“00:00:00”` 的 `DATETIME` 值。

`unit` 参数是确定( `end-begin` )的结果的单位，表示为整数。 以下是有效单位：
* MICROSECOND 微秒
* SECOND 秒
* MINUTE 分钟
* HOUR 小时
* DAY  天
* WEEK 星期
* MONTH 月
* QUARTER 季度
* YEAR 年
  
## 示例
以下示例将以月份值的形式返回2018-01-01和2018-07-26的差值：
```MYSQL
mysql> SELECT TIMESTAMPDIFF(MONTH, '2018-01-01', '2018-07-26') AS result;
+--------+
| result |
+--------+
|      7 |
+--------+
1 row in set
```

> **TIPS:** `TIMESTAMPDIFF` 仅考虑与 `unit` 参数相关的时间部分。
> 
请参阅以下示例：
```MYSQL
mysql> SELECT TIMESTAMPDIFF(MINUTE, '2018-01-01 10:00:00', '2018-01-01 10:58:59') AS result;
+--------+
| result |
+--------+
|     58 |
+--------+
1 row in set
```