const http = require('http');
const fs = require('fs');
const unzipper = require('unzipper')

const server = http.createServer((req, res) => {
  console.log(req);
  let matched = req.url.match(/filename=([^&]+)/);
  let filename = matched && matched[1];
  console.log(filename)
  // let writeStream = fs.createWriteStream('../server/public/' + filename)
  let writeStream = unzipper.Extract({path: '../server/public/'});
  req.pipe(writeStream);
  req.on('end', () => {
    res.writeHead(200, { 'Content-Type': 'text/plain'});
    res.end('ok');
  })

}).listen(3002)