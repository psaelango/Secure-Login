import { Meteor } from 'meteor/meteor';
import React from 'react';
import ReactDOMServer from 'react-dom/server'
import Login from '../imports/components/Login';

const NodeCrypto = require('./nodecrypto');
const bodyParser = require('body-parser');


Meteor.startup(() => {

  const express = require('express');
  const app = express();
  app.use(bodyParser.json()); // support json encoded bodies
  app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
  app.post('/api/register', Meteor.bindEnvironment(function(req, res){
    var token;
    if(!req.body.username || !req.body.email || !req.body.password){
      res.status(400).send("Username, Email & Password are required");
    }
    else{
      try{
        token = Meteor.call("createUser",req.body.username,req.body.email,req.body.password);
        res.status(201).send(token);
      }
      catch(error){
        if(error.error == "EMAIL_EXISTS"){
          res.status(409).send("EmailID already been registered!");
        }
        else{
          res.status(500).send(error);
        }
      }
    }
  }));
  app.get('/api/usersinfo', Meteor.bindEnvironment(function(req, res){
    var token;
    if(!req.headers.email){
      res.status(400).send("Email ID is required");
    }
    if(!req.headers.token && !req.headers.password){
      res.status(400).send("Token or Password is required");
    }
    if(req.headers.token){
      token = req.headers.token;
    }
    else if(req.headers.password){
      try{
        token = Meteor.call("passwordAuthenticate",req.headers.email,req.headers.password);
      }
      catch(error){
        if(error.error == "INVALID_EMAIL" || error.error == "INVALID_PASSWORD"){
          res.status(401).send("Invalid Email and/or Password");
        }
        else{
          res.status(500).send(error);
        }
      }
    }
    if(token){
      var user_info = {
        web_token: token,
        email: req.headers.email
      }
      try{
        var result = Meteor.call("getUsersInfo",user_info);
        res.status(201).send(result);
      }
      catch(error){
        if(error.error == "INVALID_TOKEN"){
          res.status(401).send("Invalid Token");
        }
        else{
          res.status(500).send(error);
        }
      }
    }
  }));
  WebApp.connectHandlers.use(app);

});
