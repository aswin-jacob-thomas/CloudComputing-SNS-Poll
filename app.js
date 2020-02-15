const AWS = require('aws-sdk');
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const crypto = require('crypto')
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
  if(key.endsWith("hash")){
     console.log("The key is now that of the hashed version of the contents. Ignore!");
     return res.send(200);
  }
  let params = {
    Bucket: 'staticwebpagesbucket',
    Key: key
  }
  
  s3.getObject(params, function (err, data) {

    if (err) {
        console.log(err);
    } else {
    let contents = data.Body.toString(); 
    let hashValue = crypto.createHash('sha256').update(contents).digest('hex');
    let uploadKey = key+'/hash'
    var uploadParams = {Bucket: 'staticwebpagesbucket', Key: uploadKey, Body: hashValue};
    s3.upload (uploadParams, function (err, data) {
      if (err) {
        console.log("Error", err);
      } if (data) {
        console.log("Upload Success", data.Location);
        return res.send(200);
      }
    });

    console.log(hashValue);
  }})

})

app.listen(port, (req,res,next) => {
    console.log(`The app is listening at the port $port`)
})
