import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import renderField from './renderField';
import { signInUser, signInUserSuccess, signInUserFailure, resetUserFields, meFromTokenSuccess } from '../actions/users';

//Client side validation
function validate(values) {
  var errors = {};
  var hasErrors = false;
  if (!values.username || values.username.trim() === '') {
    errors.username = 'Enter username';
    hasErrors = true;
  }
  if (!values.password || values.password.trim() === '') {
    errors.password = 'Enter password';
    hasErrors = true;
  }
  return hasErrors && errors;
}

//For any field errors upon submission (i.e. not instant check)
const validateAndSignInUser = (values, dispatch) => {
  return dispatch(signInUser(values))
    .then((result) => {
      result.payload.json().then(response => {
        // Note: Error's "data" is in result.payload.response.data (inside "response")
        // success's "data" is in result.payload.data
        if (result.payload.status !== 200) {
          dispatch(signInUserFailure(response.data));
          throw new SubmissionError(response.data);
        }

        //Store JWT Token to browser session storage 
        //If you use localStorage instead of sessionStorage, then this w/ persisted across tabs and new windows.
        //sessionStorage = persisted only in current tab
        sessionStorage.setItem('jwtToken', response.token);
        //let other components know that everything is fine by updating the redux` state
        dispatch(signInUserSuccess({user: response.data})); //ps: this is same as dispatching RESET_USER_FIELDS
        dispatch(meFromTokenSuccess({data: {user: response.data}}))
      });
    });
};



class SignInForm extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

  componentWillMount() {
    //Important! If your component is navigating based on some global state(from say componentWillReceiveProps)
    //always reset that global state back to null when you REMOUNT
    this.props.resetMe();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.status === 'authenticated' && nextProps.user.user && !nextProps.user.error) {
      this.context.router.history.push('/');
    }

    //error
    //Throw error if it was not already thrown (check this.props.user.error to see if alert was already shown)
    //If u dont check this.props.user.error, u may throw error multiple times due to redux-form's validation errors
    if (nextProps.user.status === 'signin' && !nextProps.user.user && nextProps.user.error && !this.props.user.error) {
      alert(nextProps.user.error.message);
    }
  }

  render() {
    const {asyncValidating, handleSubmit, submitting} = this.props;
    return (
      <div className="container">
        <form onSubmit={ handleSubmit(validateAndSignInUser) }>
          <Field
                 name="email"
                 type="text"
                 component={ renderField }
                 label="@username*" />
          <Field
                 name="password"
                 type="password"
                 component={ renderField }
                 label="Password*" />
          <div>
            <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={ submitting }>
              Submit
            </button>
            <Link
                  to="/"
                  className="btn btn-error"> Cancel
            </Link>
          </div>
        </form>
      </div>
    )
  }
}

export default reduxForm({
  form: 'SignInForm', // a unique identifier for this form
  validate // <--- validation function given to redux-form
})(SignInForm)

