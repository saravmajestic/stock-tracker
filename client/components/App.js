import React from 'react';
import { Component } from 'react';
import Toolbar from 'components/toolbar';
import PropTypes from 'prop-types';

class App extends Component {
	componentWillMount() {
    this.props.loadUserFromToken();
  }

  render() {
    return (
      <main className="viewport">
        <Toolbar />
        {this.props.children}
      </main>
    );
  }
}

App.propTypes = {
  children: PropTypes.node
};

export default App;