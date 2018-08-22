# wc
2018-08-09 11:01:00

## 介绍
wc - Word Count
> Print newline, word, and byte counts for each FILE, and a total line if more than one FILE is specified. 
> A word is a non-zero-length sequence of characters delimited by white space.
> With no FILE, or when FILE is -, read standard input
> 
> 统计一个文件的行数、单词数（一个单词也就是没有空格分隔的字符串）和字节数并输出，如果指定了多个文件，还会将这文件的这几个数据的统计总和显示输出
> 如果没有指定文件，或者是一个 `-` ，则统计标准输入的内容

我的版本
wc (GNU coreutils) 8.26


## 命令格式和选项
### 命令格式
wc [OPTION]... [FILE]...
wc [OPTION]... --files0-from=F

### 命令选项
**-c, --bytes**
print the byte counts
只统计输出字节数

**-m, --chars**
print the character counts
只统计输出字符数（没有任何内容，字符数为0，但是如果有内容，就会有一个结束符号）

**-l, --lines**
print the newline counts
只统计输出行数

--files0-from=F
read input from the files specified by NUL-terminated names in file F; If F is - then read names from standard input

-L, --max-line-length
print the maximum display width
只统计输出最长行的长度

**-w, --words**
print the word counts
只统计输出单词数

--help
显示帮助信息

--version
显示版本信息

## 用法示例
* 查看文件基本数据统计信息
  
  ```Bash
  root@debian:/tmp# cat test 
  apple
  banana
  cat
  dog
  egg
  root@debian:/tmp# wc test 
  5  5 25 test
  root@debian:/tmp# wc -c test  
  25 test
  root@debian:/tmp# wc -m test  
  25 test
  root@debian:/tmp# wc -l test 
  5 test
  root@debian:/tmp# wc -L test  
  6 test
  root@debian:/tmp# wc -w test  
  5 test
```

* 只打印统计数字不打印文件名
  可以看到打印的统计数字后面会带上这个文件名，下面给出一种只打印统计数字不打印文件名的方法

  ```Bash
  root@debian:/tmp# cat test | wc -l
  5
  ```

* 统计当前目录下的文件数量
  
  ```Bash
  root@debian:/usr/local/src# ls -l
  total 10652
  drwxr-xr-x  9 1001  1001    4096 Jun 20 17:32 nginx-1.14.0
  -rw-r--r--  1 root staff 1016272 Apr 17 23:35 nginx-1.14.0.tar.gz
  drwxr-xr-x 19 root root     4096 Jun 20 17:50 openssl-1.1.0h
  -rw-r--r--  1 root staff 5422717 Mar 27 22:03 openssl-1.1.0h.tar.gz
  drwxr-xr-x  9 1169  1169   12288 Jun 20 17:51 pcre-8.39
  -rw-r--r--  1 root root  2062258 Jun 20 17:09 pcre-8.39.tar.gz
  drwxrwxr-x  6 root root     4096 Aug  8 16:59 redis-4.0.11
  -rw-r--r--  1 root staff 1739656 Aug  4 06:46 redis-4.0.11.tar.gz
  drwxr-sr-x  2 root staff    4096 Jun 26 17:49 shell
  -rw-r--r--  1 root staff    4471 May 22 19:50 swebInit.sh
  -rw-r--r--  1 root staff    4471 May 22 19:50 swebInit.sh.1
  drwxr-xr-x 14  501 staff    4096 Jun 20 17:51 zlib-1.2.11
  -rw-r--r--  1 root staff  607698 Jan 16  2017 zlib-1.2.11.tar.gz
  root@debian:/usr/local/src# ls -l | wc -l
  14
  ```
  > **TIPS:**
  统计的文件数中包含当前目录