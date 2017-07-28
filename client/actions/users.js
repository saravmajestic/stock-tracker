import axios from 'axios';
import 'whatwg-fetch'

//Get current user(me) from token in localStorage
export const ME_FROM_TOKEN = 'ME_FROM_TOKEN';
export const ME_FROM_TOKEN_SUCCESS = 'ME_FROM_TOKEN_SUCCESS';
export const ME_FROM_TOKEN_FAILURE = 'ME_FROM_TOKEN_FAILURE';
export const RESET_TOKEN = 'RESET_TOKEN';

//Sign Up User
export const SIGNUP_USER = 'SIGNUP_USER';
export const SIGNUP_USER_SUCCESS = 'SIGNUP_USER_SUCCESS';
export const SIGNUP_USER_FAILURE = 'SIGNUP_USER_FAILURE';
export const RESET_USER = 'RESET_USER';

//Sign In User
export const SIGNIN_USER = 'SIGNIN_USER';
export const SIGNIN_USER_SUCCESS = 'SIGNIN_USER_SUCCESS';
export const SIGNIN_USER_FAILURE = 'SIGNIN_USER_FAILURE';


//validate email, if success, then load user and login
export const VALIDATE_EMAIL = 'VALIDATE_EMAIL';
export const VALIDATE_EMAIL_SUCCESS = 'VALIDATE_EMAIL_SUCCESS';
export const VALIDATE_EMAIL_FAILURE = 'VALIDATE_EMAIL_FAILURE';

//called when email is updated in profile to update main user's email state
export const UPDATE_USER_EMAIL = 'UPDATE_USER_EMAIL';


//log out user
export const LOGOUT_USER = 'LOGOUT_USER';


const ROOT_URL = location.href.indexOf('localhost') > 0 ? 'http://localhost:3001/api' : '/api';

export function validateEmail(validateEmailToken) {
  //check if token from welcome email is valid, if so, update email as verified and login the user from response
  const request = axios.get(`${ROOT_URL}/validateEmail/${validateEmailToken}`);

  return {
    type: VALIDATE_EMAIL,
    payload: request
  };
}

export function validateEmailSuccess(currentUser) {
  return {
    type: VALIDATE_EMAIL_SUCCESS,
    payload: currentUser
  };
}

export function validateEmailFailure(error) {
  return {
    type: VALIDATE_EMAIL_FAILURE,
    payload: error
  };
}

export function meFromToken(tokenFromStorage) {
  var payload = {"query": "{userByToken{_id first_name last_name token}}"};
  return {
    type: ME_FROM_TOKEN,
    payload: getGraph(payload)
  };
}
export function getGraph(payload){
  let token = sessionStorage.getItem('jwtToken');

  var headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', `Bearer ${token}`);
  
  var options = {
    method: 'POST',
    headers: headers,
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify(payload)
  };

  var request = new Request(`${ROOT_URL}/graphql`, options);
  return fetch(request);
}
export function meFromTokenSuccess(currentUser) {
  return {
    type: ME_FROM_TOKEN_SUCCESS,
    payload: currentUser
  };
}

export function meFromTokenFailure(error) {
  return {
    type: ME_FROM_TOKEN_FAILURE,
    payload: error
  };
}


export function resetToken() {//used for logout
  return {
    type: RESET_TOKEN
  };
}


export function signUpUser(formValues) {
  var headers = new Headers();
  headers.append('Content-Type', 'application/json');
  
  var options = {
    method: 'POST',
    headers: headers,
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify(formValues) // formData
  };

  var request = new Request(`${ROOT_URL}/users/signup`, options);

  return {
    type: SIGNUP_USER,
    payload: fetch(request)
  };
}

export function signUpUserSuccess(user) {
  return {
    type: SIGNUP_USER_SUCCESS,
    payload: {user:user}
  };
}

export function signUpUserFailure(error) {
  return {
    type: SIGNUP_USER_FAILURE,
    payload: error
  };
}


export function resetUser() {
  return {
    type: RESET_USER,
  };
}

export function signInUser(formValues) {
  var headers = new Headers();
  headers.append('Content-Type', 'application/json');
  
  var options = {
    method: 'POST',
    headers: headers,
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify(formValues) // formData
  };

  var request = new Request(`${ROOT_URL}/user/login`, options);

  return {
    type: SIGNIN_USER,
    payload: fetch(request)
  };
}

export function signInUserSuccess(user) {
  return {
    type: SIGNIN_USER_SUCCESS,
    payload: user
  };
}

export function signInUserFailure(error) {
  return {
    type: SIGNIN_USER_FAILURE,
    payload: error
  };
}

export function logoutUser() {
  let token = sessionStorage.getItem('jwtToken');
  var headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', `Bearer ${token}`);

  var options = {
    method: 'POST',
    headers: headers,
    mode: 'cors',
    cache: 'default',
    // body: JSON.stringify(formValues) // formData
  };

  var request = new Request(`${ROOT_URL}/user/logout`, options);

  return {
    type: LOGOUT_USER,
    payload: fetch(request)
  };
}
export function updateUserEmail(email) {
  return {
    type: UPDATE_USER_EMAIL,
    payload:email
  };
}


