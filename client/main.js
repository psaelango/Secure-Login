import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
 
import App from '../imports/ui/App.js';
import Login from '../imports/components/Login';

import * as RLocalStorage from 'meteor/simply:reactive-local-storage';

Tracker.autorun(() => {
  var current_user = RLocalStorage.getItem("current_user");
  console.log(">> Tracker.autorun: current_user=",current_user);
  if(current_user && typeof current_user === 'object'){
    var path = window.location.pathname;
    Meteor.call("validateUserToken", current_user.web_token, current_user.email, function(err,res){
      if(res){
        console.log(res);
        FlowRouter.go("/dashboard");
      }
      else{
        RLocalStorage.setItem("current_user","");
        if(err.name == "TokenExpiredError") alert("Session Timeout!!! Login Again.")
      }
    });
  }
  else{
    FlowRouter.go("/");
  }
});