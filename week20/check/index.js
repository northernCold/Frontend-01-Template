var page = require('webpage').create();
page.open('http://localhost:8085/', function() {
    setTimeout(function() {
        page.render('baidu1.png');
        phantom.exit();
    }, 12000);
});