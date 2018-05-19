import React, {Component} from 'react';
import * as RLocalStorage from 'meteor/simply:reactive-local-storage';

export default class NotFound extends Component{
  render(){
    return(
      <div>
        <h3>404 page not found</h3>
        <p>We are sorry but the page you are looking for does not exist.</p>
      </div>
    );
  }
}
