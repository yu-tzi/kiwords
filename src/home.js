import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

class Home extends React.Component {
  render() {
    return (
    <div>
      <div>Home</div>
      <button
        onClick={() => {
          firebase.auth().signOut();
          window.location.href = "/"
        }}>Sign Out
      </button>
    </div>
    )
  }
}


export default Home