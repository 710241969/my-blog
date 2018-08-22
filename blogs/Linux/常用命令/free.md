# free
2018年8月22日 11:02:08

## 介绍
free - 显示Linux系统中空闲的、已用的物理内存及swap内存，及被内核使用的buffer
> **TIPS:**
> The information is gathered by parsing /proc/meminfo .
> free显示的数据是从 `/proc/meminfo` 获得的

我的版本
```Bash
root@debian:~# free --version
free from procps-ng 3.3.12
```

## 命令格式和选项
### 命令格式
free [options]

### 命令选项
* **-b, --bytes**
  以Byte为单位显示内存使用情况

* **-k, --kibi**
  以KB为单位显示内存使用情况。默认使用这个

* **-m, --mebi**
  以MB为单位显示内存使用情况

* **-g, --gibi**
  以GB为单位显示内存使用情况

* --tebi Display the amount of memory in tebibytes.
* --pebi Display the amount of memory in pebibytes.
* --kilo Display the amount of memory in kilobytes. Implies --si.
* --mega Display the amount of memory in megabytes. Implies --si.
* --giga Display the amount of memory in gigabytes. Implies --si.
* --tera Display the amount of memory in terabytes. Implies --si.
* --peta Display the amount of memory in petabytes. Implies --si.
  
* -h, --human
  自动转换成适合阅读查看的单位
      Show all output fields automatically scaled to shortest three digit unit and display the units of print out.  Following units are used.

        B = bytes
        K = kibibyte
        M = mebibyte
        G = gibibyte
        T = tebibyte
        P = pebibyte

      If unit is missing, and you have exbibyte of RAM or swap, the number is in tebibytes and columns might not be aligned with header.

* -w, --wide
  Switch to the wide mode. The wide mode produces lines longer than 80 characters. In this mode buffers and cache are reported in two separate columns.
* -c, --count count
  Display the result count times.  Requires the -s option.

* -l, --lohi
  Show detailed low and high memory statistics.

* -s, --seconds delay
  Continuously display the result delay  seconds apart.  You may actually specify any floating point number for delay using either . or , for decimal point.  usleep(3) is used for microsecond resolution delay times.

* --si   Use kilo, mega, giga etc (power of 1000) instead of kibi, mebi, gibi (power of 1024).

* -t, --total
显示总计，为每一列的总和。

* --help Print help.
free使用帮助

* -V, --version
free版本信息

### 显示信息
free  displays  the  total amount of free and used physical and swap memory in the system, as well as the buffers and caches used by the kernel. The information is gathered by parsing /proc/meminfo. The displayed columns
are:

total  Total installed memory (MemTotal and SwapTotal in /proc/meminfo)

used   Used memory (calculated as total - free - buffers - cache)

free   Unused memory (MemFree and SwapFree in /proc/meminfo)

shared Memory used (mostly) by tmpfs (Shmem in /proc/meminfo)

buffers
      Memory used by kernel buffers (Buffers in /proc/meminfo)

cache  Memory used by the page cache and slabs (Cached and SReclaimable in /proc/meminfo)

buff/cache
      Sum of buffers and cache

available
      Estimation of how much memory is available for starting new applications, without swapping. Unlike the data provided by the cache or free fields, this field takes into account page cache  and  also  that  not  all
      reclaimable memory slabs will be reclaimed due to items being in use (MemAvailable in /proc/meminfo, available on kernels 3.14, emulated on kernels 2.6.27+, otherwise the same as free)

对于OS，buffers/cached 都是属于被使用，所以他的可用内存是2098428KB,已用内存是30841684KB,其中包括，内核（OS）使用+Application(X, oracle,etc)使用的+buffers+cached.

第三行所指的是从应用程序角度来看，对于应用程序来说，buffers/cached 是等于可用的，因为buffer/cached是为了提高文件读取的性能，当应用程序需在用到内存的时候，buffer/cached会很快地被回收。

所以从应用程序的角度来说，可用内存=系统free memory+buffers+cached。