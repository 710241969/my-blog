Excel Sheet Column Number

Given a column title as appear in an Excel sheet, return its corresponding column number.

For example:

    A -> 1
    B -> 2
    C -> 3
    ...
    Z -> 26
    AA -> 27
    AB -> 28 
    ...
Example 1:

Input: "A"
Output: 1
Example 2:

Input: "AB"
Output: 28
Example 3:

Input: "ZY"
Output: 701

给定一个Excel表格中的列名称，返回其相应的列序号。

例如，

    A -> 1
    B -> 2
    C -> 3
    ...
    Z -> 26
    AA -> 27
    AB -> 28 
    ...
示例 1:

输入: "A"
输出: 1
示例 2:

输入: "AB"
输出: 28
示例 3:

输入: "ZY"
输出: 701

一开始以为是27进制。。。怎么算都不对
到 27 就进位，难道不是 27 进制吗？？？
后来发现，这里是没有 0 的，这里只有 26 个数。
二进制，有 0-1 两个数；
八进制，有 0-7 八个数
十进制，有 0-9 十个数；
十六进制，有 0-f 十六个数；
我们要把这里的 1 当成 我们认识的 0 ，26 当成我们认识的 25 ，那么 27 就是我们认识的 26 了。
所以这里应当是 26 进制。。问题解决

```C++
class Solution {
public:
    int titleToNumber(string s) {
        int sum = 0;
        int len = s.size();
        for (int i = len - 1; i >= 0; i-- )
        {
            char c = s[i];
            sum +=(c - 'A' + 1) * pow(26, len - i -1);
        }
        return sum;
    }
};
```

