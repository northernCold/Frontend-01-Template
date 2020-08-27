const http = require('http');
const https = require('https');
const fs = require('fs');
const unzipper = require('unzipper')

const server = http.createServer((req, res) => {

  if (req.url.match(/^\/auth/)) {
    return auth(req, res);
  }
  if (!req.url.match(/^\/$/)) {
    res.writeHead(404, { "Content-Type": "text/plain"});
    res.end();
    return;
  }
  // console.log(req);
  let matched = req.url.match(/filename=([^&]+)/);
  let filename = matched && matched[1];
  // console.log(filename)
  // let writeStream = fs.createWriteStream('../server/public/' + filename)
  let writeStream = unzipper.Extract({
    path: '../server/public/'
  });
  req.pipe(writeStream);
  req.on('end', () => {
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end('ok');
  })

}).listen(3002)

function auth(req, res) {
  let code = req.url.match(/code=([^&]+)/)[1];
  let state = 123;
  let client_secret = "b27ba151be0c76a540f70882e632cea5daea6de6";
  let client_id = "Iv1.8f9d11057784afa8";
  let redirect_uri = encodeURIComponent("http://localhost");

  let params = `code=${code}&state=${state}&client_secret=${client_secret}&client_id=${client_id}&redirect_uri=${redirect_uri}`
  let url = `/login/oauth/access_token?${params}`
  let request = https.request({
    hostname: 'github.com',
    port: 443,
    path: url,
    method: "POST",
  }, (response) => {
    // console.log(res);
    response.on('data', (d) => {
      let result = d.toString().match(/access_token=([^&]+)/)
      let token = result[1];
      console.log(token);
      res.writeHead(200, {
        'access_token': token,
        'Content_type': 'text/html'
      })
      res.end(`<a href="http://localhost:8080/publish?token=${token}></a>`);
    })
  })
  request.on('error', (e) => {
    console.error(e)
  })
  request.end();
  // res.writeHead(200, {
  //   'Content-Type': 'text/plain'
  // });
  // res.end("okay");
}