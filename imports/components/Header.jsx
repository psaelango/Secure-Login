import React, {Component} from 'react';
import * as RLocalStorage from 'meteor/simply:reactive-local-storage';
import { ClientStorage } from 'meteor/ostrio:cstorage';

export default class Header extends Component{
  constructor(props){
    super(props);
    // STATE:
    this.state={};
    // FUNCTION BINDINGS
    this.clickSignOut = this.clickSignOut.bind(this);
  }
  clickSignOut(event){
    RLocalStorage.setItem("current_user","");
    console.log("current_user signed out and Session cleared!");
  }
  render(){
    var current_user = ClientStorage.get("current_user");
    return(
      <nav className="navbar-inverse" style={{ alignSelf:"stretch" }}>
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand">Demo Login Module</a>
          </div>
          {( current_user && typeof current_user==="object" ?
              <ul className= "nav navbar-nav navbar-right">
                <li>
                  <a 
                    href="#"
                    onClick={ this.clickSignOut }
                    >Sign out
                  </a>
                </li>
              </ul>
            :
              null
          )}
        </div>
      </nav>
    );
  }
}
