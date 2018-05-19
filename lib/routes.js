import * as RLocalStorage from 'meteor/simply:reactive-local-storage';
import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';

import App from '../imports/ui/App';
import Login from '../imports/components/Login';
import Dashboard from '../imports/components/Dashboard';
import NotFound from '../imports/pages/NotFound'


FlowRouter.route('/', {
  name: 'Login',
  action() {
    mount(App, {content: <Login />});
  },
});

FlowRouter.route('/dashboard', {
  name: 'Dashboard',
  action() {
    var current_user = RLocalStorage.getItem("current_user");
    if(current_user && typeof current_user === 'object'){
      Meteor.call("validateUserToken", current_user.web_token, current_user.email, function(err,res){
        if(res){
          mount(App, {content: <Dashboard />});
        }
        else{
          RLocalStorage.setItem("current_user","");
        }
      });
    }
  },
});

FlowRouter.notFound = {
  name: 'NotFound',
  action() {
    mount(App, {content: <NotFound />});
  },
}
