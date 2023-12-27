require("dotenv").config();
const AWS = require("aws-sdk");

exports.UploadFileToS3 = (fName, data) => {
  try{
    let S3bucket = new AWS.S3({
      accessKeyId: process.env.IAM_USER_KEY,
      secretAccessKey: process.env.IAM_USER_SECRET,
      region: process.env.AWS_REGION
    });
    var params = {
      Bucket: process.env.BUCKET_NAME,
      Key: fName,
      Body: data,
      ACL: "public-read",
    };
    
    return new Promise((resolve, reject) => {
      S3bucket.upload(params, (err, response) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log("sucess", response);
          resolve(response.Location);
        }
      });
    });

  }
  catch(err){
    console.log(err)
  }
  
};