import React from "react";


class firebaseConfig extends React.Component{

  render() {
    var firebaseConfig = {
      apiKey: "AIzaSyAgpVLf1iNb1RJmq3QBIuHdDnMUYObYqKo",
      authDomain: "kiwords-c058b.firebaseapp.com",
      databaseURL: "https://kiwords-c058b.firebaseio.com",
      projectId: "kiwords-c058b",
      storageBucket: "kiwords-c058b.appspot.com",
      messagingSenderId: "959153092087",
      appId: "1:959153092087:web:278807305aad9aa00caaf2",
      measurementId: "G-1GYNCR5WYZ"
    };

    firebase.initializeApp(firebaseConfig);
  }
}


export default firebaseConfig