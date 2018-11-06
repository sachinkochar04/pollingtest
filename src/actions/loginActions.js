import { auth, firebase } from '../Inc/firebase.js'
export const LOGINSUCCESS = 'LOGINSUCCESS';
export const LOGINREQUEST = 'LOGINREQUEST';
export const LOGINERROR = 'LOGINERROR';
export const LOGOUTERROR = 'LOGOUTERROR';
export const LOGOUTSUCCESS = 'LOGOUTSUCCESS';
export const LOGOUTREQUEST = 'LOGOUTREQUEST';
export const LOGINCHECKFAILURE = 'LOGINCHECKFAILURE';

// sending received response form fetchSignup to reducer
export function handleLoginSuccess(res) {
  return {
    type: LOGINSUCCESS,
    payload: res,
    message: res.message,
  };
}

export function handleLoginRequest() {
  return {
    type: LOGINREQUEST,
    message: 'loading',
  };
}

// to handle error
export function handleLoginError(err) {
  return {
    type: LOGINERROR,
    payload: err,
    message: err.message,
  };
}
export function handleLogOutError(err) {
    return {
      type: LOGOUTERROR,
      message: err.message,
    };
  }
  export function handleLogOutSuccess() {
    return {
      type: LOGOUTSUCCESS,
    //   payload: err,
    //   message: err.message,
    };
  }
  export function handleLogOutRequest(err) {
    return {
      type: LOGOUTREQUEST,
      message: 'loading',
    };
  }

  export function handleCheckLoginFailure() {
    return {
      type: LOGINCHECKFAILURE,
    };
  }

export function loginAction() {
  return (dispatch) => {
    dispatch(handleLoginRequest());
      auth.signInAnonymously()
      .then((res)=>{
          return dispatch(handleLoginSuccess(res.user));
      })
      .catch((err)=>{
          return dispatch(handleLoginError(err));
      })
}
}

export function checkLoginAction() {
return (dispatch) => {
  dispatch(handleLoginRequest());
  auth.onAuthStateChanged(function(user) {
      if (user) {
          return dispatch(handleLoginSuccess(user));
      } else {
          return dispatch(handleCheckLoginFailure());
      }
      });
}
}



export function logOutAction(data) {
  return (dispatch) => {
    dispatch(handleLogOutRequest());
    auth.signOut()
    return dispatch(handleLogOutSuccess());
}
}
