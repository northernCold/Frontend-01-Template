表达式语句

类型转换

运算符优先级



### Expression

> 表达式语句：通过`运算符`连接`变量`或`直接量`通过构成的表达式

#### Primary Expression 主要表达式

> 表达式中最小单位，所涉及的语法结构也是**优先级最高的**

1. 直接量以及直接量的形式定义的对象

2. this
3. 变量(标识符)
4. 加上括号的表达式

#### Member Expression 成员表达式

> 通常是用于访问对象成员。由Primary Expression 构成的复杂表达式

1. 用标识符的属性访问和用字符串的属性访问    
```
 `a.ba["b"]`
```

2. new.target 用于判断函数是否被new调用

3. super 构造函数中，由于访问父类属性的语法

4. 带函数的模板
```
	f`a${b}c`
```

5. 带参数列表的new运算

```
	new Cls()
```

#### New Expression NEW表达式

> 特指没有参数列表的表达式 e.g new Cls 。Member Expression 加上 new 可以构成New Expression 

#### Call Expression  函数调用表达式

> 基本形式是Member Expression或者super后加上一个括号的参数列表

还有一些变体：当Member Express中某一个子结构具有函数调用

#### Left Hand Side Expression 左值表达式

> New Expression 和 Call Expression 统称 左值表达式

#### Assignment Expression 赋值表达式



https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence

根据优先级将表达式从高到低排序

Primary Expression



Member Expression



New Expression



UpdateExpression

UnaryExpression



Exponentiation Expression



Multiplication Expression



Additive Expression



Shift Expression



Relational Expression



Equality Expression



Bitwise Expression



Logical Expression



Conditional Expression



Assignment Expression



yield/yield*



展开运算符



逗号