# escape、encodeURI 和 encodeURIComponent 辨析
2018-07-02 14:48:03

## 问题背景
在日常工作中，我们会经常使用到 `encodeURI` 和 `encodeURIComponent` 两个方法，也可能会遇到 `escape` 方法，这里容易混淆，所以要特别注意，分清楚三个方法的作用。

## excape 废弃
> TIPS: 已废弃
该特性已经从 Web 标准中删除，虽然一些浏览器目前仍然支持它，但也许会在未来的某个时间停止支持，请尽量不要使用该特性。
>
> 请使用 `encodeURI` 或 `encodeURIComponent` 代替

语法：
```JavaScript
escape(str)
```
参数：
`str` 
待编码的字符串.

返回值：
已编码的 string 的副本。其中某些字符被替换成了十六进制的转义序列。

说明：
该方法不会对 `ASCII字母` 、 `数字`  `* @ - _ + . /` 进行编码，其他所有的字符都会被转义序列替换。

可以看到，这个方法其实已经被废弃了，大家也别用了。我也不举例子了

## encodeURI 用来编码一整个URL
语法：
```JavaScript
encodeURI(URI)
```
参数：
URI
一个完整的URI

返回值：
一个新字符串, 表示提供的字符串编码为统一资源标识符 (URI)。

说明：
该方法不会对 `ASCII字母` 、 `数字`  `; , / ? : @ & = + $ #` 进行编码，其他所有的字符都会被转义序列替换。

例如，对
`https://710241969.github.io/#/JavaScript/常用方法/encodeURI和encodeURIComponent`
的编码结果是
`https://710241969.github.io/#/Javascript/%E5%B8%B8%E7%94%A8%E6%96%B9%E6%B3%95/encodeURI%E5%92%8CencodeURIComponent
`

所以，该方法是对真个url进行编码，生成一个可以用的url，目的是使用这个url。
所以，`encodeURI` 无法产生能适用于HTTP GET 或 POST 请求的URI，例如对于 XMLHTTPRequests, 因为 "&", "+", 和 "=" 不会被编码，然而在 GET 和 POST 请求中它们是特殊字符。
需要编码URL中的参数的时候，应该使用下面的 `encodeURIComponent` 这个方法会对这些字符编码。

## encodeURIComponent 用来编码URL中的参数
语法：
```JavaScript
encodeURIComponent(str);
```

参数：
str String. URI 的组成部分。

说明：
该方法不会对 `ASCII字母` 、 `数字`  `( ) . ! ~ * ' - _` ，其他所有的字符都会被转义序列替换。

例如，对
`https://710241969.github.io/#/JavaScript/常用方法/encodeURI和encodeURIComponent`
的编码结果是
`https%3A%2F%2F710241969.github.io%2F%23%2FJavascript%2F%E5%B8%B8%E7%94%A8%E6%96%B9%E6%B3%95%2FencodeURI%E5%92%8CencodeURIComponent`

可以看到，整个url都被编码了，因此 encodeURIComponent() 函数将转义用于分隔 URI 各个部分的标点符号


> TIPS: 为了避免服务器收到不可预知的请求，对任何用户输入的作为URI部分的内容你都需要用encodeURIComponent进行转义。比如，一个用户可能会输入 `Thyme &time=again` 作为comment变量的一部分。如果不使用encodeURIComponent对此内容进行转义，服务器得到的将是 `comment=Thyme%20&time=again`。请注意，"&"符号和"="符号产生了一个新的键值对，所以服务器得到两个键值对（一个键值对是 `comment=Thyme`，另一个则是 `time=again`），而不是一个键值对。

## 参考
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/escape