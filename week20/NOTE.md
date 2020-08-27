# 每周总结可以写在这里

[building-oauth-apps](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/)

https://github.com/login/oauth/authorize?client_id=Iv1.8f9d11057784afa8&redirect_uri=http%3A%2F%2Flocalhost&state=123

1e9b2716b0d5aa86b03d

let code = "600833d2d0984055d106";
let state = 123;
let client_secret = "";
let client_id = "Iv1.8f9d11057784afa8";
let redirect_uri = encodeURIComponent("http://localhost");

let params = `code=${code}&state=${state}&client_secret=${client_secret}&client_id=${client_id}&redirect_uri=${redirect_uri}`
let xhr = new XMLHttpRequest;

xhr.open("POST", `https://github.com/login/oauth/access_token?${params}`);

xhr.send(null);

xhr.addEventListener("readystatechange", function (event) {
  if (xhr.readyState === 4) {
    console.log(event.respnseText);
  }
})

access_token=169441bf0c642b6a47ad2db6baa00870bbebc7b8

// ------------------------------
let access_token = "169441bf0c642b6a47ad2db6baa00870bbebc7b8"

let xhr = new XMLHttpRequest;

xhr.open("GET", `https://api.github.com/user`);

xhr.setRequestHeader(`Authorization`, `token ${access_token}`)
xhr.send(null);

xhr.addEventListener("readystatechange", function (event) {
  if (xhr.readyState === 4) {
    console.log(event.responseText);
  }
})
  
// 激活浏览器   cmd /c start <url>