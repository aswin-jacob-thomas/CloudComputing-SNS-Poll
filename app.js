const AWS = require('aws-sdk');
const express = require('express')
const cors = require('cors')
const app = express();
const port = 80;

app.use(cors())
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
        } else {
          console.log("Success", data);
        }
      });
})
app.listen(port, (req,res,next) => {
    console.log(`The app is listening at the port $port`)
})