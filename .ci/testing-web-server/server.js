var http = require("http");
var fs = require("fs");
var exec = require("child_process").exec;

var server = http.createServer(async function (req, res) {
  let identy = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 8);
  console.log(req.method + " " + req.url);
  var data = "";

  req.on("data", function (chunk) {
    data += chunk;
  });

  req.on("end", async function () {
    try {

      // ========================
      // Патч от 23 декабря 2021 г. Заменено название dish-control на dish-line 
      // Можно удалить после релиза альфы
      data = data.replace(/dish-control/g, "dish-line")
      // ========================


      data = JSON.parse(data);
      console.log("DATA IN TEST WEB SERVICE", data)
      if (data.identy) identy = data.identy;
      let timeStart = new Date().getTime();

      // Only for testing webserver
      if (data.test === true) {
        setTimeout(() => {
          res.end(`{
                    "identy": "${identy}",
                    "url": "${identy}.42.pub",
                    "commit": "${process.env.CI_COMMIT_SHORT_SHA}",
                    "commit_title":"${process.env.CI_COMMIT_TITLE}",
                    "status": "test"
                }`);
        }, 3000);
      } else {
        if (data.url !== undefined) {
          if (!Boolean(data.url)) {
            res.end(`{
              "identy": "ERROR",
              "url": "ERROR",
              "commit": "ERROR",
              "commit_title":"ERROR"
            }`);
          } else {
            console.log("Run in Recepie-URL mode");
            console.log(data);
            var child = exec(`bash /app/testing-web-server/run_test ${data.url} ${identy} ${data.silent ? "silent": "no_silent"}`);
            child.stdout.on("data", function (data) {
              console.log("stdout: " + data);
            });

            child.stderr.on("data", function (data) {
              console.log("stderr: " + data);
            });

            child.on("close", function (code) {
              console.log('closing code: ' + code);
              if (code === 0) {
                let response_data = `{
                  "identy": "${identy}",
                  "url": "${identy}.42.pub",
                  "commit": "${process.env.CI_COMMIT_SHORT_SHA}",
                  "commit_title":"${process.env.CI_COMMIT_TITLE}",
                  "status": "ok",
                  "time": ${(((new Date().getTime()) - timeStart)/1000).toFixed()}
                }`; 

                console.log("response_data",response_data)
                res.end(response_data);

              } else {
                let response_data = `{
                  "identy": "${identy}",
                  "url": "${identy}.42.pub",
                  "commit": "${process.env.CI_COMMIT_SHORT_SHA}",
                  "commit_title":"${process.env.CI_COMMIT_TITLE}",
                  "status": "Error",
                  "time": ${(((new Date().getTime()) - timeStart)/1000).toFixed()}
                }`

                console.log("response_data",response_data)
                res.end(response_data);
              }
            });
          }
        } else {
          console.log("Run in Recepie-File mode");
          let receipe = data;
          fs.writeFileSync(`/app/testing-web-server/recepie-${identy}.json`, JSON.stringify(receipe));

          var child = exec(`bash /app/testing-web-server/run_test /app/testing-web-server/recepie-${identy}.json ${identy}`);
          child.stdout.on("data", function (data) {
            console.log("stdout: " + data);
          });

          child.stderr.on("data", function (data) {
            console.log("stderr: " + data);
          });

          child.on("close", function (code) {
            console.log("closing code: " + code);
          });

          res.end(`{
                    "identy": "${identy}",
                    "url": "${identy}.42.pub",
                    "commit": "${process.env.CI_COMMIT_SHORT_SHA}",
                    "commit_title":"${process.env.CI_COMMIT_TITLE}",
                    "status": "ok",
                    "time": ${(((new Date().getTime()) - timeStart)/1000).toFixed()}
                }`);
        }
      }
    } catch (error) {
      console.error(error);
      res.end(`{ "error": ${error} }`);
    }
  });
});

server.listen(3000, function () {
  console.log("listening on 3000");
});
