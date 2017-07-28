import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logoutUser } from '../actions/users';
import Header from '../components/header.js';



function mapStateToProps(state) {
  return { 
    authenticatedUser: state.user.status === 'authenticated' ? state.user.user : null,
    user: state.user
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
     resetMe: () =>{
     },

     logout: () => {
         dispatch(logoutUser());
         sessionStorage.removeItem('jwtToken');
     }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Header);
