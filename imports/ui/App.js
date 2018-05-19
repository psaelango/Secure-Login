import React, { Component } from 'react';
import Header from '../components/Header'

// App component - represents the whole app
export default class App extends Component {
  render() {
    return (
      <div>
        <Header />
        {this.props.content}
      </div>
    )
  }
}