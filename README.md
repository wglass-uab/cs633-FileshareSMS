# SUMCS633-weglass

## Summary

This simple filesharing app uses aws SDK to push and pull S3 objects from a Bucker

To Run:
`npm install` from package.json directory
`node server` from the same directory.

The website has been left standing at http://ec2-100-25-3-86.compute-1.amazonaws.com:3000/

It supports user signup and sharing of many file formats.

File retrieval is also available through a get endpoint but I was unable to get sms or emails working

To get an object:
* First share a file.
  * On successful share, a query value has been added to the url with key "key"
  * visiting http://ec2-100-25-3-86.compute-1.amazonaws.com:3000/download/key allows you to download the shared file.

This project has working requirements:
* Deployed to EC2 Container
* Relies on RDS db instance (MySQL)
* Pushes objects into and gets from an S3 bucket
