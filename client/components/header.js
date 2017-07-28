import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class Header extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

  componentWillUnmount() {
    //Important! If your component is navigating based on some global state(from say componentWillReceiveProps)
    //always reset that global state back to null when you REMOUNT
     this.props.resetMe();
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.user.user && !nextProps.user.user) {//logout (had user(this.props.user.user) but no loger the case (!nextProps.user.user))
      this.context.router.history.push('/');
    }
  }

  renderSignInLinks(authenticatedUser) {
    if(authenticatedUser) {
      return (
        <ul className="nav nav-pills navbar-right">
            <li style={{paddingRight: '10px'}} role="presentation">      
              <Link role="presentation" style={{color:'#996633',  fontSize: '17px'}} to="/profile">
              {authenticatedUser.first_name}
              </Link>
            </li>
            <li style={{paddingRight: '10px'}} role="presentation">      
              <a style={{color:'#996633',  fontSize: '17px'}}  onClick={this.props.logout} href="javascript:;">
              Log out
              </a>
            </li>
        </ul>
      );
    }

    return (
      <ul className="nav nav-pills navbar-right">
          <li style={{paddingRight: '10px'}} role="presentation">      
            <Link  role="presentation" style={{color:'#996633',  fontSize: '17px'}} to="/signup">
            Sign up
            </Link>
          </li>
          <li style={{paddingRight: '10px'}} role="presentation">      
            <Link style={{color:'#996633',  fontSize: '17px'}} to="/signin">
            Sign in
            </Link>
          </li>
      </ul>
   );
  }
  
	renderLinks() {
		const { type, authenticatedUser } = this.props;
		return (
      <div className="container">
        {this.renderSignInLinks(authenticatedUser)}
        <ul className="nav  nav-pills navbar-left">
          <li style={{paddingRight: '10px'}} role="presentation">      
            <Link className="text-xs-right"  style={{color:'#337ab7',  fontSize: '17px'}}  to="/">Back To Index</Link>
          </li>
        </ul>
      </div>
      ); 
	};

	render() {
			return (
			 <nav className="navbar navbar-default navbar-static-top">
			      <div id="navbar" className="navbar-collapse collapse">
			      {this.renderLinks()}
	      		</div>     
			 </nav>				
			);
	}
}

export default Header