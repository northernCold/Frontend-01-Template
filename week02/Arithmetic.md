### 动态与静态

|          | 运行位置                  | 运行时         | 名称        |
| -------- | ------------------------- | -------------- | ----------- |
| 动态语言 | 在用户的设备/在线服务器上 | 产品实际运行时 | Runtime     |
| 静态语言 | 在程序员的设备上          | 产品开发时     | Compiletime |

### 类型系统

- 动态类型系统与静态类型系统

- 强类型与弱类型 区别有无隐式转换

- 复合系统
  - 结构体
  - 函数签名
- 子类型
  - 协变/逆变



### 模拟四则运算步骤

1.  定义四则运算产生式
2.  词法分析
3.  语法分析
4.  解释执行

#### 定义四则运算产生式

1. 把减法看作特殊的加法
1 - 1 => 1 + -1
2. 把四则运算中，因为“+”，“-”的优先级比“*”，“/”，”()“低，所以计算的最终结果可以看作加法运算，把"*"，"/"，"()"的表达式看作一个整体数。

无括号四则运算
```
<Number> ::= "0" | "1" | ... | "9"
<DecimalNumber> ::= "0" | (("1" | "2" | ... | "9") <Number>*)
<Expression> ::= <AdditiveExpression>
<AdditiveExpression> ::= <MulitiplicationExpression> |
	<DecimalNumber> "+" <AdditiveExpression> |
	<DecimalNumber> "-" <AdditiveExpression>
<MulitiplicationExpression> ::= <DecimalNumber> |
	<DecimalNumber> "*" <MulitiplicationExpression> |
	<DecimalNumber> "/" <MulitiplicationExpression>
```

有括号四则运算

```
<PrimaryExpression> ::= <DecimalNumber> | "(" <AdditiveExpression> ")""
<AdditiveExpression> ::= <MulitiplicationExpression> |
	<DecimalNumber> "+" <AdditiveExpression> |
	<DecimalNumber> "-" <AdditiveExpression>
<MulitiplicationExpression> ::= <PrimaryExpression> |
	<PrimaryExpression> "*" <MulitiplicationExpression> |
	<PrimaryExpression> "/" <MulitiplicationExpression>
```