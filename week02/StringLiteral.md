```
//只考虑严格模式下

StringLiteral=/\"([^"\\\u000A\u000D]|\\([^0-9xu\u000A\u000D\u2028\u2029]|0[^\d]|(x[0-9a-f]{2}|u[0-9a-f]{4})|(u\{(1?0?|0?[0-9a-f]?)[0-9a-f][0-9a-f][0-9a-f][0-9a-f]\}))|\\([\u000A\u2028\u2029]|(\u000D.)))+\"|\'([^'\\\u000A\u000D]|\\([^0-9xu\u000A\u000D\u2028\u2029]|0[^\d]|(x[0-9a-f]{2}|u[0-9a-f]{4})|(u\{(1?0?|0?[0-9a-f]?)[0-9a-f][0-9a-f][0-9a-f][0-9a-f]\}))|\\([\u000A\u2028\u2029]|(\u000D.)))+\'/i
//感觉有点不对劲..

SingleStringCharacter = 
	[^'\\u000A\u000D\u2028\u2029]
  \u2028
  \u2029
  \([^0-9xu\u000A\u000D\u2028\u2029]|0[^\d]|(x[0-9a-f]{2}|u[0-9a-f]{4})|(u\{(1?0?|0?[0-9a-f]?)[0-9a-f][0-9a-f][0-9a-f][0-9a-f]\}))
  \[\u000A\u2028\u2029]|(\u000D.)
  合并 =
  [^'\\u000A\u000D]
  \([^0-9xu\u000A\u000D\u2028\u2029]|0[^\d]|(x[0-9a-f]{2}|u[0-9a-f]{4})|(u\{(1?0?|0?[0-9a-f]?)[0-9a-f][0-9a-f][0-9a-f][0-9a-f]\}))
  \[\u000A\u2028\u2029]|(\u000D.)
	
	=/[^'\\\u000A\u000D]|\\([^0-9xu\u000A\u000D\u2028\u2029]|0[^\d]|(x[0-9a-f]{2}|u[0-9a-f]{4})|(u\{(1?0?|0?[0-9a-f]?)[0-9a-f][0-9a-f][0-9a-f][0-9a-f]\}))|\\([\u000A\u2028\u2029]|(\u000D.))/i

SourceCharacter = any Unicode code point(.)

EScapeSequence = 
  [^0-9xu\u000A\u000D\u2028\u2029]
  0[^\d]
  x[0-9a-f]{2}|u[0-9a-f]{4}
  u[0-9a-f]{4}|u\{(1?0?|0?[0-9a-f]?)[0-9a-f][0-9a-f][0-9a-f][0-9a-f]\}

CharacterEscapeSequence = [^0-9xu\u000A\u000D\u2028\u2029]
SingleEscapeCharacter = ['"\bfnrtv]
NonEscapeCharacter = [^'"\bfnrtv0-9xu\u000A\u000D\u2028\u2029]

0 [lookahead ∉ DecimalDigit] = 0[^\d]
HexEscapeSequence = x[0-9a-f]{2}
UnicodeEscapeSequence = u[0-9a-f]{4} | u\{(1?0?|0?[0-9a-f]?)[0-9a-f][0-9a-f][0-9a-f][0-9a-f]\}

LineContinuation = \\[\u000A\u2028\u2029]|(\u000D.)
LineTerminatorSequence = [\u000A\u2028\u2029]|(\u000D[^\u000A])|(\u000D\u000A)
 = [\u000A\u2028\u2029]|(\u000D.)

LineTerminator = 
  <LF> U+000A
  <CR> U+000D
  <LS> U+2028
  <PS> U+2029
  [^\u000A\u000D\u2028\u2029]

```



[lookahead ∉ DecimalDigit]

If the phrase “[lookahead ∉set]” appears in the right-hand side of a production, it indicates that the production may notbe used if the immediately following input token sequence is a member of the given set.



参考：

​	ecma-262 10th

​	https://www.w3cschool.cn/wsqzg/wsqzg-1nds25mc.html