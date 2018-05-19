import React, {Component} from 'react';
import * as RLocalStorage from 'meteor/simply:reactive-local-storage';
import moment from 'moment';

export default class Dashboard extends Component{
  constructor(props){
    super(props);
    // STATE:
    this.state={
      users: []
    };
  }
  componentDidMount(){
    var current_user = RLocalStorage.getItem("current_user");
    Meteor.call("getUsersInfo",current_user,(error,response)=>{
      this.setState({users:response});
    });
  }
  render(){
    return(
      <div className="col-sm-12" style={{textAlign:"center"}}>
        <div className="row">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <td>Id</td>
                <td>Username</td>
                <td>Email</td>
                <td>Register Date</td>
              </tr>
            </thead>
            <tbody>
              {
                this.state.users.map((user)=>(
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{ user.createdAt ? moment.unix(user.createdAt).format("YYYY-MM-DD HH:mm:ss") : null}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
