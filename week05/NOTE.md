# 每周总结可以写在这里


### Realm

ECMA262-2019 里8.2 section。定义了Realm： 
> Realm 是由一组Intrinsic Object(内在对象)、一个ECMAScript全局变量、在全局环境的范围加载的所有的ECMAScript的代码、其他相关的状态和资源组成的。

Realm里所有的对象在ECMA262-2019 里6.1.7.4中说明了。

大部分可以在全局变量中找到，但是有一些：

%ArrayIteratorPrototype%

%AsyncFromSyncIteratorPrototype%

%AsyncFunction%

%AstncFunctionPrototyp%

%AsyncGenerator%

%AsyncGeneratorFunction%

%AsyncGeneratorPrototype%

%AsyncIteratorPrototype%

%Generator%

%GeneratorFunction%

%GeneratorPrototype%

%IteratorPrototype%

%MapIteratorPrototype%

%SetIteratorPrototype%

%ThrowTypeError%

%TypedArray%

%TypedArrayPrototype%

无法简单得通过全局变量访问到。

通过*广度优先搜索*全局变量（浏览器的window）中拥有的**内在对象**里所有的对象、函数(包括set、get)，一共找到了473个对象

源码：./build-object/main.js

[用 G6 antv 可视化](https://northerncold.github.io/build-object/)


### http

#### request的结构

```
请求行[请求方式 路径 http版本]
请求头[以key:value形式一行]
空一行
请求体
```

#### response的结构

```
状态行[HTTP/(http版本) 状态码 状态]
响应头[以key:value形式一行]
响应体(如果响应头里的Transfer-Encodeing的值为chunked，那么响应体先是内容的长度然后再是内容，最后以内容的长度为0结束)
```

#### 玩具浏览器

```
let request = new Request({
  method: "POST",
  host: "127.0.0.1",
  port: "8088",
  headers: {
  	"X-foo2": "123"
  },
  body: {
  	name: "winter"
  }
})
```

server.js打印：

![1589383433731](.\img\request-headers.png)

client.js打印：

![1589383708274](.\img\response.png)