const md5 = require('md5'),
      connection = require('./db.config.js');
      
function query(sql,params, next) {
  connection.query(sql,params, (err,rows) => {
    if (err || !rows) {
      console.log(JSON.stringify(sql));
      console.log(JSON.stringify(params));
      console.log(JSON.stringify(err));
      console.log(JSON.stringify(rows));
    } 
    next(err,rows);
  });
} 

function insertIntoUsers(user, next) {
  const newUser = [user.firstName, user.lastName, user.email, md5(user.password)];
  query('INSERT INTO users (firstName, lastName, email, password) VALUES (?,?,?,?)', newUser, next);
}

function selectFromUsersByLogin(login, next) {
  query("select * from users where email = ? and password = ?", [login.email, md5(login.password)], next);
}

function insertIntoShares(shares, next) {
  const newShare = [shares.email, shares.fileId, Array.from(shares.numbers).join(',')];
  query('INSERT INTO shares (email, fileId, numbers) VALUES (?,?,?)', newShare, next);
}

module.exports = {insertIntoUsers, selectFromUsersByLogin, insertIntoShares};