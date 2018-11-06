// import { LOGIN, ERROR, FORGETPASSWORD } from '../actions/login_action';

const initialState = {
    isLoggedIn: false,
    user:'',
    data:''
  };
  
  // receiving response sent by action according to type of action
  export default function loginReducers(state = initialState, action) {
      console.log(action,'action')
    switch (action.type) {
      case 'LOGINSUCCESS':
        return { 
          isLoggedIn: true,
          user : action.payload
        };
        break;
  
      case 'LOGINERROR':
        return { isLoggedIn: action.payload };
        break;
  
      case 'LOGINREQUEST':
        return { isLoggedIn: action.message };
        break;
      
      case 'LOGINCHECKFAILURE':
        return { isLoggedIn: false };
        break;

      case 'SIGNUPSUCCESS':
        return { 
          signUp: action.payload,
          isLoggedIn : true,
          user:action.payload.user
         };
        break;
      default:
        return state;
    }
  }
  