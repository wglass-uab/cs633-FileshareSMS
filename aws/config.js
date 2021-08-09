const AWS = require('aws-sdk');

AWS.config.update({region: "us-east-1"});

const awsCredentials = {
   Bucket:"uab-cs633-weglass-fileshare-bucket",
   accessKeyId: "ASIAU2XBVV2JG4SQZVX6",
   secretAccessKey: "F7ni57kmKyWZ5t4mhHN6mjyX7rXSKOO91zi/2laZ",
   sessionToken: `FwoGZXIvYXdzEI///////////wEaDJe2vdq3D7ZsjvCcGCK+Aa8rYvUxV8u0VXro+YCHcEXFv+7yV5OESEIOVrwd2HYlgslBuAUtI6MYdO515W1Rglqa6E7pfCLi1gfs9vmU5MVdN1tHBBT07003AO2rz8a3fNpiIHn7pI0RSSA2+k5mPslcSyauzpuG+HXvVoY8/nlzRvDeuu96JX4O3xp2d9Nf9bYajqfZV1Ck7f3BYHr1vKKtLOPDekhgqlQyCL9eGFV8GoT6z1b/+GGn3I0iYSDjAum2AMB3clAIwu8T0MconZjBiAYyLT4YPuZepptJZgUDqghDjjW/Mpa0+7awg2R2j4P2LmvH1cgex9byr+97iZ10CQ==`
};
const s3 = new AWS.S3({...awsCredentials});
const sns = new AWS.SNS({...awsCredentials,apiVersion: '2010-03-31'});

module.exports = {sns, s3};