const crypto = require('crypto');
const NodeCrypto = require('./nodecrypto');
const jwt = require('jsonwebtoken');
const mysql = require('promise-mysql');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('testdb', 'root', 'Root@123', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  operatorsAliases: false
});
const sqltable = "users";


Meteor.methods({
  'createUser': function(username,email,password){
      if(!username || !password || !email){
        throw new Meteor.Error("Username and/or Password cannot be empty")
      }
      var checkQuery = "SELECT * FROM "+sqltable+" WHERE email = '"+email+"'";
      return sequelize.query(checkQuery, { type: sequelize.QueryTypes.SELECT})
      .then(result =>{
        console.log(result); 
        if(result.length == 0){
          passwordcrypted = NodeCrypto.encrypt(password);
          var createdAt = parseInt(new Date().getTime()/1000);
          var insertQuery = 'INSERT INTO '+sqltable+' (username, email, password, createdAt) VALUES ("'+username+'","'+email+'","'+passwordcrypted+'","'+createdAt+'")';
          return sequelize.query(insertQuery, { type: sequelize.QueryTypes.INSERT})
        }
        else{
          throw "EMAIL_EXISTS";
        }
      })
      .then(rows =>{
        var output = JSON.stringify(rows);
        output = JSON.parse(output);
        var user = output[0];
        return jwt.sign({user}, NodeCrypto.secretkey, { expiresIn: '1h' })
      })
      .then(token =>{
        console.log(token);
        return token
      })
      .catch(error =>{
        console.log(error);
        throw new Meteor.Error(error);
      })        
  },
  'passwordAuthenticate': function(email,password){
      if(!email || !password){
        throw new Meteor.Error("Email and/or Password cannot be empty");
      }
      var sql = 'SELECT * FROM '+sqltable+' WHERE email = "'+email+'"';
      return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT})
      .then(result =>{
        console.log(result);
        var output = JSON.stringify(result);
        output = JSON.parse(output);
        if(output.length == 0){
          throw "INVALID_EMAIL";
        }
        else{
          console.log(password);
          console.log(output[0]);
          try{
            passworddecrypted = NodeCrypto.decrypt(password,output[0].password);
          }
          catch(error){
            throw "INVALID_PASSWORD";
          }          
          console.log("Valid User");
          var user = output[0];
          return user;
        }
      })
      .then(user =>{
        return jwt.sign({user}, NodeCrypto.secretkey, { expiresIn: '1h' });
      })
      .then(token =>{
        console.log(token);
        return token
      })
      .catch(error =>{
        console.log(error);
        throw new Meteor.Error(error);
      })
  },
  'validateUserToken': function(token,email){
    return new Promise((resolve,reject)=>{
      jwt.verify(token, NodeCrypto.secretkey, (error, authData) => {
        if(error) {
          console.log(error);
          reject(new Meteor.Error("INVALID_TOKEN"));
        } 
        else {
          resolve(authData.exp);
        }
      });
    });
  },
  'getUsersInfo': function(current_user){
    if(!current_user.web_token || !current_user.email){
      throw new Meteor.Error("INVALID_USER");
    }
    try{
      Meteor.call("validateUserToken",current_user.web_token,current_user.email)
    }
    catch(error){
      throw error;
    }
    var sql = 'SELECT id,username,email,createdAt FROM '+sqltable+'';
    return sequelize.query(sql, { type: sequelize.QueryTypes.SELECT})
    .then(result =>{
      var output = JSON.stringify(result);
      output = JSON.parse(output);
      return output;
    })
    .catch(error =>{
      console.log(error);
      throw new Meteor.Error(error);
    })
  },
  // Just for development purpose
  'deleteUsersInfo': function(){
    var ids = [4];
    var sql = "DELETE FROM "+sqltable+"";
    return sequelize.query(sql, { type: sequelize.QueryTypes.UPDATE})
    .then(result =>{
      console.log(result);
      var output = JSON.stringify(result);
      output = JSON.parse(output);
      return output;
    })
    .catch(error =>{
      console.log(error);
      throw new Meteor.Error(error);
    })
  }
})