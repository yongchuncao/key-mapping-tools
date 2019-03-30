## 这是个什么玩意？
（我的心路历程）

这是一个基于mac OS X的一个按键映射工具，为什么要写这么个玩意呢？因为我是一个Windows系统用户，
但是由于工作需要，我要同时在Mac 和windows两种操作系统下开发。于是我通过远程桌面来互相切换，
然而我的是mac mini 采用的是外接键盘，快捷键就成了我最大的痛苦。mac OS下拷贝是command+c、
粘贴是command+v，然而Windows是control+c 、control+v. 这让我十分痛苦，3天下来，
我已经分不清楚，到底哪里应该control+c、哪里应该command+c。
     
我忍不了了，开始尝试怎么统一快捷键，我试了很多工具，但这些工具都是把ctrl给我改成command...
mac OS 能用了，windows快捷键废了。。。而且ctrl系列的所有快捷键，都变成command了。。。
无语这不是我想要的。

我已到了忍耐的极限，于是乎自己动手写！思路很简单，mac OS下注册全局快捷键 control+c 、control+v
，当触发这些键时，调用object-c获取当前活跃的应用程序，如果不是远程桌面创建command+c的按键事件发出去！
这样我就可以，做单鱼与熊掌二者兼得！说干就干！

## 主要技术
1.[`Electron`](https://github.com/electron/electron) 主框架
   
2.[`VUE`](https://github.com/vuejs/vue) 实现渲染进程
  
3.[`robojs`](https://github.com/octalmage/robotjs) 模拟按键
  
4.[`objc`](https://github.com/lukaskollmer/objc) 访问mac OS X API。（这个用起来感觉自己就是在写js,而不是object-c）

5.[`NeDB`](https://github.com/louischatriot/nedb) 存储配置数据
 
## 编译：
    git clone https://github.com/yongchuncao/key-mapping-tools.git
    npm install
    npm run build
    
 编译之后得到PKG安装包。
 
 ## 使用
 
 1.安装PKG包到你的MAC
 
 2.运行Key Mapping Tools 首次使用，由于需要访问MAC OS X API所以请添加，key mapping tools到：隐私>辅助功能
 
 3.默认已经添加了，一些按键，以及白名单应用。如有需要可自行添加
 
 4.你可以尽情 control+c 、control+v了
 
## 自动更新
1. 还没有实现
2. 由于我穷，买不起MAC开发者账号，所以没有上架，也没有代码签名。

