const mysql = require('mysql'),
      dbConfig = {
        host: 'filesharedb.cg77c5xbhksi.us-east-1.rds.amazonaws.com',
        user: 'fileshare',
        password: 'fileshare',
        database: 'fileshare'
      },
      connection = mysql.createConnection(dbConfig);

// open the MySQL connection
connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

module.exports = connection;