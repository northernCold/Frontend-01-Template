#### StringLiteral(只考虑严格模式下)

```
/(\'([^'\\\u000D\u2028]|([^0-9xu\u000A\u000D\u2028\u2029]|0[^\d]|x[0-9a-f]{2}|u([0-9a-f]{4}|\{[\u0000-\u10FFFF]\}))|(\\[\u000A\u2028\u2029]|\u000D.))*\')|\"([^"\\\u000D\u2028]|([^0-9xu\u000A\u000D\u2028\u2029]|0[^\d]|x[0-9a-f]{2}|u([0-9a-f]{4}|\{[\u0000-\u10FFFF]\}))|(\\[\u000A\u2028\u2029]|\u000D.))*\"/iu
```



#### SingleStringCharacters

```
/\'([^'\\\u000D\u2028]|([^0-9xu\u000A\u000D\u2028\u2029]|0[^\d]|x[0-9a-f]{2}|u([0-9a-f]{4}|\{[\u0000-\u10FFFF]\}))|(\\[\u000A\u2028\u2029]|\u000D.))*\'/iu
```

#### DoubleStringCharacters

```
/\"([^"\\\u000D\u2028]|([^0-9xu\u000A\u000D\u2028\u2029]|0[^\d]|x[0-9a-f]{2}|u([0-9a-f]{4}|\{[\u0000-\u10FFFF]\}))|(\\[\u000A\u2028\u2029]|\u000D.))*\"/iu
```



#### SingleStringCharacter

```
SoureceCharacter but not one of ' or \ or LineTerminator =>[^'\\\u000A\u000D\u2028\u2029]
<LS> => \u000A
<PS> => \u2029
EscapeSequence => [^0-9xu\u000A\u000D\u2028\u2029]|0[^\d]|x[0-9a-f]{2}|u([0-9a-f]{4}|\{[\u0000-\u10FFFF]\})
LineContinuation =>
\ LineTerminatorSequence => \\[\u000A\u2028\u2029]|\u000D.

合并=>  /[^'\\\u000D\u2028]|([^0-9xu\u000A\u000D\u2028\u2029]|0[^\d]|x[0-9a-f]{2}|u([0-9a-f]{4}|\{[\u0000-\uDBFF\uDFFF]\}))|(\\[\u000A\u2028\u2029]|\u000D.)/iu
```

#### EscaperSequence

```
CharacterEscapeSequence      => [^0-9xu\u000A\u000D\u2028\u2029]
0 [lookahead ∉ DecimalDigit] => 0[^\d]
HexEscapeSequence            => x[0-9a-f]{2}
UnicodeEscapeSequence        => u([0-9a-f]{4}|\{[\u0000-\u10FFFF]\})

合并 => [^0-9xu\u000A\u000D\u2028\u2029]|0[^\d]|x[0-9a-f]{2}|u([0-9a-f]{4}|\{[\u0000-\u10FFFF]\})
```

####     CharacterEscapeSequence

```
SingleEscapeCharacter => ['"\\bfnrtv]
NonEscapeCharacter => [^0-9xu\u000A\u000D\u2028\u2029]
```

#### EscapeCharacter

```
SingleEscapeCharacter => ['"\\bfnrtv]
DecimalDigit
x
u             => [0-9xu]
```

#### LineTerminatorSequence

```
<LF>                   => \u000A
<CR>[lookahead ≠ <LF>] => \u000D[^\u000A]
<LS>                   => \u2028
<PS>                   => \u2029
<CR><LF>               => \u000D\u000A

合并 => [\u000A\u2028\u2029]|\u000D.
```


#### SourceCharacter

​	任意Unicode码点[U+0000,U+10FFFF], JavaScript任意字符都可以用码点表示

[lookahead ∉ DecimalDigit]

If the phrase “[lookahead ∉set]” appears in the right-hand side of a production, it indicates that the production may notbe used if the immediately following input token sequence is a member of the given set.



参考：

	ecma-262 10th
	
	https://www.w3cschool.cn/wsqzg/wsqzg-1nds25mc.html