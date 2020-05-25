const http = require('http');

const server = http.createServer((req, res) => {
  console.log("request recevied");
  console.log(req.headers)
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(
`<html>
<head>
    <style>
.p {
    display: flex;
    justify-content: center;
    width: 800px;
    background-color: rgb(255,255,255);
}

.p div {
    background-color: rgb(255,255,255);
    width: 100px;
    height: 100px;
}
.p .c1 {
    background-color: rgb(123,1,52);
}
.p .c2 {
    background-color: rgb(123,1,1);
}
.p .c3 {
    background-color: rgb(2,1,52);
}
.p .c4 {
    background-color: rgb(32,1,52);
}
    </style>
</head>
<body>
    <div class="p">
        <div class="c1"></div>
        <div class="c2"></div>
        <div class="c3"></div>
        <div class="c4"></div>
    </div>
</body>
</html>`
  )
});

server.listen(8088);