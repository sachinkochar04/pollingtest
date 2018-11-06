import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
    apiKey: 'AIzaSyCUcqxsvAj-qXS5WZ-x0otMlfX4jYGSbLg',
    authDomain: 'polltest-962a1.firebaseapp.com',
    databaseURL: 'https://polltest-962a1.firebaseio.com',
    projectId: 'polltest-962a1',
    storageBucket: 'polltest-962a1.appspot.com',
    messagingSenderId: '594824958803',
  };
  
  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }

  const auth = firebase.auth();
  const database = firebase.database();

export {
  auth,database
};