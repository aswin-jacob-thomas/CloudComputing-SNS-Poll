const AWS = require('aws-sdk');
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express();
const port = 80;

app.use(cors())
app.use(bodyParser.text());
AWS.config.getCredentials(function(err) {
    if (err) console.log(err.stack);
    // credentials not loaded
    else {
      console.log("Access key:", AWS.config.credentials.accessKeyId);
      console.log("Secret access key:", AWS.config.credentials.secretAccessKey);
    }
  });

AWS.config.update({region: 'us-west-2'});
s3 = new AWS.S3({apiVersion: '2006-03-01'});


app.get("/hashPage", (req,res,next) => {
      var bucketParams = {
        Bucket : 'staticwebpagesbucket',
      };

      s3.listObjects(bucketParams, function(err, data) {
        if (err) {
          console.log("Error", err);
          res.send(500).json({
            error: err
        })
        } else {
          console.log("Success", data);
          res.status(200).json(data);
        }
      });

})

app.post("/hashPage", (req,res,next) => {

  let body = req.body
  body = JSON.parse(body)
  let message = body["Message"]
  let parsedBody = JSON.parse(message)
  let key = parsedBody["Records"][0]["s3"]["object"]["key"]

  let params = {
    Bucket: 'staticwebpagesbucket',
    Key: key
  }
  
  s3.getObject(params, function (err, data) {

    if (err) {
        console.log(err);
    } else {
        console.log(data.Body.toString()); //this will log data to console
    }})

  res.send(200);
})

app.listen(port, (req,res,next) => {
    console.log(`The app is listening at the port $port`)
})
