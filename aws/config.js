const AWS = require('aws-sdk');

AWS.config.update({region: "us-east-1"});

const awsCredentials = {
   Bucket:"uab-cs633-weglass-fileshare-bucket",
   accessKeyId: "ASIAU2XBVV2JH2IQH62C",
   secretAccessKey: "p6iLSXLwU+rLkX/t0cQe6A9jg4lHrXmZQhGu+m9Z",
   sessionToken: 'FwoGZXIvYXdzEJP//////////wEaDIw5KyCukhmv/paGAiK+ARBF4BxanxTpPu4WG9tCYy3jG9H3eWlnTpVYOkAqgim4E87CNG4Det+Wv5mZhGhKpYpy/20V257FboZav9qF6OpV7NmavCCNY/zS/nLmcZYfSephS1GAmkG38a/Z0SkpU1iaGWSviU8vRGah5wDJJhNwJacAwZ0S7f+CbNRnKWjMlO2bO1DzSb8PCZe6lHoj74C2db8Q9ekB1XM5GvwodQxQAzKffF5yLQinspfeP+5dc7jkkaxvB6F+DuuyPiQogYPCiAYyLR2BT7qyARyrWE+AgphL9IBmYYg9+yaRjh84QFUJJXv3UvE7FnRKKUZY8B00tA=='
};
const s3 = new AWS.S3({...awsCredentials});
const sns = new AWS.SNS({...awsCredentials,apiVersion: '2010-03-31'});

module.exports = {sns, s3};