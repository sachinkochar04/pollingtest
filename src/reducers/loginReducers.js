const initialState = {
    isLoggedIn: false,
    user:'',
    data:''
  };
  
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

      default:
        return state;
    }
  }
  