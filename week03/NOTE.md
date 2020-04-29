找出 JavaScript 标准里有哪些对象是我们无法实现出来的,都有哪些特性?

在ECMAScript6之后，标准将Object的类别分为以下几种：

- 普通对象(Ordinary Objects)是指具备JavaScript对象所有默认行为的对象
- 怪异对象(Exotic Objects)是指某些行为与默认行为不同的对象
- 标准对象(Standard Objects)是指由ES6语言规范定义的对象，比如Array、Date等。标准对象可以是普通对象，也可以是怪异对象
- 内置对象(Built-in Objects)是指JavaScript运行环境定义的对象。



#### 1.Bound Function Exotic Objects

bind() 函数会创建一个新的绑定函数（bound function）。绑定函数是一个 exotic function object，它包装了原函数对象。调用绑定函数通常会导致执行包装函数。
绑定函数具有以下内部属性：

- [[BoundTargetFunction]] - 包装的函数对象
- [[BoundThis]] - 在调用包装函数时始终作为 this值传递的值。
- [[BoundArguments]] - 列表，在对包装函数做任何调用都会优先用列表元素填充参数列表。
- [[Call]] - 执行与此对象关联的代码。通过函数调用表达式调用。内部方法的参数是一个this值和一个包含通过调用表达式传递给函数的参数的列表。

当调用绑定函数时，它调用 [[BoundTargetFunction]] 上的内部方法 [[Call]]，就像这样 Call(boundThis, args)。其中，boundThis 是 [[BoundThis]]，args 是 [[BoundArguments]]加上通过函数调用传入的参数列表。

#### 2.Array Exoitc Objects

数组对象是对象数组索引属性进行特殊处理的怪异对象。

- 属性为数字也能访问(普通对象中规定属性名只能是string或者symbol)。

- 每个数组对象有一个不可配置的属性——"length"，其值的大小范围为0-2<sup>32</sup>

- 而且"length"永远大于该数组每一个数组下标

- 在新增或者删除数组的大小时，"length"也会发生改变。 反之亦然。

#### 3.String Exotic Objects

- 封装字符串值以及暴露出映射的独立的code unit元素字符串值的整数下标属性

- 字符串也有一个"length"属性，它的值是字符串值中码点（code unit）的个数

- 码点和"length"属性都是不可写和不可配置的

#### 4.Arguments Exoitc Objects

- 根据函数定义的特征，Arguments对象可以是普通对象，也可以是参数奇异对象。

- 怪异Arguments对象是奇异对象，其数组索引属性映射为其关联的ECMAScript函数的调用的形式参数绑定

- 怪异Arguments对象除了拥有普通对象的行为，它还有\[\[ParameterMap\]\],

- 普通Arguments对象也有\[\[ParameterMap\]\]，不过它的值永远为undefined

#### 5. Integer-INdexed Exotic Objects

- Integer-Indexed怪异对象是对整数索引属性的特殊处理。

- 它相比于普通对象，多个\[\[ViewedArrayBuffer\]\]、\[\[ArrayLength\]\]，\[\[ByteOffset\]\],\[\[TypedArrayName\]\]


#### 6.Module Namespave Exotic Objects

- Module Namespace怪异对象，它暴露出了从ECMAScript模块导出的绑定。 

- Module Namespace怪异对象的字符串键自己的属性与模块导出的绑定名称之间存在一一对应的关系。

- 导出的绑定包括使用export导出项间接导出的任何绑定。

- Module Namespace怪异对象不可扩展


#### 7. Immutable Prototype Exotic Objects

- Immutable Prototype怪异对象，它有一个[[prototype]]行为，一旦初始化就不会改变