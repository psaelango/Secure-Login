import React, {Component} from 'react';
import * as RLocalStorage from 'meteor/simply:reactive-local-storage';

export default class Login extends Component{
  constructor(props){
    super(props);
    // STATE:
    this.state={
      registerEmail: "",
      registerName: "",
      registerPassword: "",
      loginEmail: "",
      loginPassword: ""
    };
    // FUNCTION BINDINGS
    this.handleChange = this.handleChange.bind(this);
    this.clickSignIn = this.clickSignIn.bind(this);
    this.clickCreate = this.clickCreate.bind(this);
  }
  handleChange(event) {
    this.setState({[event.target.id]: event.target.value});
  }
  clickCreate(event){
    event.preventDefault();
    console.log(event);
    var username = event.target.registerName.value;
    var email = event.target.registerEmail.value;
    var password = event.target.registerPassword.value;
    Meteor.call('createUser', username, email, password, (error,response)=>{
      if(error){
        console.log(">> createUser Error - ",error);
        if(error.error == "EMAIL_EXISTS"){
          alert("Email ID already been registered!");
        }
      }
      else{
        console.log(">> createUser Response - ", response);
        alert("User Created Successfully! You can login to Brownie now.")
      }
    });
  }
  clickSignIn(event){
    event.preventDefault();
    console.log(event);
    var email = event.target.loginEmail.value;
    var password = event.target.loginPassword.value;
    Meteor.call('passwordAuthenticate', email, password, (error,response)=>{
      if(error){
        console.log(">> passwordAuthenticate Error - ",error);
        if(error.error == "INVALID_EMAIL"){
          alert("Email ID does not exists!");
        }
        else if(error.error == "INVALID_PASSWORD"){
          alert("Wrong Password!!!")
        }
      }
      else{
        console.log(">> passwordAuthenticate Response - ", response);
        var current_user = {};
        current_user.web_token = response;
        current_user.email = email;
        RLocalStorage.setItem("current_user",current_user);// This triggers the tracker.autorun
      }
    });
  }
  render(){
    return(
      <div className="col-sm-12" style={{ width:"100%", textAlign:"center" }}>
        <div id="container" className="row">
          <br/>
          <br/>
          <h1>Sign in</h1>
          <div className="row">
            <div className="col-sm-2">
            </div>
            <div className="col-sm-8">
              <form className="form" onSubmit={this.clickSignIn}>
                <input type="email" id="loginEmail" placeholder="Email" value={this.state.loginEmail} onChange={this.handleChange} required/>
                <input type="password" id="loginPassword" placeholder="Password" value={this.state.loginPassword} onChange={this.handleChange} required/>
                <button type="submit" value="submit">Sign In</button>
              </form>
            </div>
            <div className="col-sm-2">
            </div>
          </div>
          <br/>
          <br/>
          <h4>Create User</h4>
          <div className="row">
            <div className="col-sm-2">
            </div>
            <div className="col-sm-8">
              <form className="form" onSubmit={this.clickCreate} >
                <input type="email" id="registerEmail" placeholder="Email" value={this.state.registerEmail} onChange={this.handleChange} required/>
                <input type="text" id="registerName" placeholder="Username" value={this.state.registerName} onChange={this.handleChange} required/>
                <input type="password" id="registerPassword" placeholder="Password" value={this.state.registerPassword} onChange={this.handleChange} required/>
                <button type="submit" value="submit">Create</button>
              </form>
            </div>
            <div className="col-sm-2">
            </div>
          </div>
        </div>
      </div>
    );
  }
}
