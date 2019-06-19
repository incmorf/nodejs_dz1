const http = require('http');
const timeOut = 5000;

http.createServer((req, res) => {
  if (req.method === 'GET' && req.url !== '/favicon.ico') {
    const interval = setInterval(() => {
      console.log(new Date().toUTCString());
    }, 1000);

    const timeout = (timeOut) => {
      return new Promise(function (resolve, reject) {
        setTimeout(() => {
          resolve();
        }, timeOut);
      });
    };
    timeout(timeOut).then(() => {
      clearInterval(interval);
      res.end(new Date().toUTCString());
    });
  }
}).listen(3000);
