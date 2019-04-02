const AWS = require('aws-sdk');

const rekognition = new AWS.Rekognition();

const headers = {
  "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
  "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
};



exports.handler = async (event,context,callback) => {

  console.log('Invoking image tagger in Ireland...');
  console.log(event.queryStringParameters);

  try {

      let params = {
        Image: {
          S3Object: {
            Bucket: event.queryStringParameters.bucketname,
            Name: event.queryStringParameters.decodedsrckey
          }
        },
        MaxLabels: 10,
        MinConfidence: 60
      };

      let rekognitionData = await rekognition.detectLabels(params).promise();

        const response = {
          statusCode: 200,
          headers: headers,
          body: JSON.stringify(rekognitionData.Labels),
        };
        callback(null, response);
      
  } catch (err) {
    console.log(err);
    const response = {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({ "message": "Server error " + error.toString() })
    };
    callback(null, response);  
  }
}

