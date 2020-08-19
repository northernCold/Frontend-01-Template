const http = require('http');
const querystring = require('querystring')
const fs = require('fs');
const archiver = require('archiver');

const postData = querystring.stringify({
  'content': 'hello world!'
})

let packname = './package';

// let filename = './cat.jpg';
// fs.stat(filename, (error, stat) => {
  const options = {
    host: 'localhost',
    port: 3002,
    path: '/?filename=package.zip',
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
    }
  }
  
  let archive = archiver('zip', {
    zlib: { level: 9 }
  })
  archive.directory(packname, false);
  archive.finalize();
  const req = http.request(options, (res) => {
    console.log(`状态码: ${res.statusCode}`);
    console.log(`响应头: ${JSON.stringify(res.headers)}`);
    // res.setEncoding('utf8');
    // res.on('data', (chunk) => {
    //   console.log(`响应主体: ${chunk}`);
    // });
    // res.on('end', () => {
      //   console.log('响应中已无数据');
      // });
    });
    
  req.on('error', (e) => {
    console.error(`请求遇到问题: ${e.message}`);
  });
  
  // 将数据写入请求主体。
  archive.pipe(req)
  archive.on('end', () => {
    req.end();
  })


  // let readStream = fs.createReadStream('./cat.jpg')
  
  // readStream.pipe(req)
  // readStream.on('end', () => {
  //   req.end();
  // })
  // req.end();
// })