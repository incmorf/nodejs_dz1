const http = require('http');
const timeOut = 5000;
let interval;

http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url !== '/favicon.ico') {
    interval && clearInterval(interval);
    let startTime = new Date();
    let stopTime = startTime.setSeconds(startTime.getSeconds() + timeOut / 1000);

    let waitForInterval = () => new Promise(resolve => {
      interval = setInterval(() => {
        console.log(new Date().toUTCString());
        let currentTime = new Date();

        if (currentTime >= stopTime) {
          console.log('Finish');
          resolve(true);
        }
      }, 1000);
    });
    waitForInterval()
      .then(function () {
        res.end(new Date().toUTCString());
      });
  }
}).listen(3000);
