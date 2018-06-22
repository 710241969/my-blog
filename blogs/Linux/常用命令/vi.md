# vi命令
vim是vi的升级版本，对vi完全兼容，建议使用vim。所以本篇博客的vi，是针对vim。
如果没有系统没有安装vim，需要先安装vim。

## 常用命令


## 命令行模式
* 【:w】 保存文件
* 【:w!】 若文件为只读，强制保存文件
* 【:q】 离开vi
* 【:q!】 不保存强制离开vi
* 【:wq】 保存后离开
* 【:wq!】 强制保存后离开
* 【:! command】 暂时离开vi到命令行下执行一个命令后的显示结果
* **`:set nu`，`:set number`显示行号**
* 【:set nonu】 取消显示行号
* 【:w newfile】 另存为
* 【:set fileencoding】 查看当前文件编码格式
* 【:set fileencoding=utf-8】 设置当前文件编码格式为utf-8，也可以设置成其他编码格式
* 【:set fileformat】 查看当前文件的断行格式（dos\windows,unix或macintosh）
* 【:set fileformat=unix】 将当前文件的断行格式设置为unix格式