import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from "./firebaseConfig"

//================== Initialize Firebase ================
/*  var firebaseConfig = {
  apiKey: "AIzaSyAgpVLf1iNb1RJmq3QBIuHdDnMUYObYqKo",
  authDomain: "kiwords-c058b.firebaseapp.com",
  databaseURL: "https://kiwords-c058b.firebaseio.com",
  projectId: "kiwords-c058b",
  storageBucket: "kiwords-c058b.appspot.com",
  messagingSenderId: "959153092087",
  appId: "1:959153092087:web:278807305aad9aa00caaf2",
  measurementId: "G-1GYNCR5WYZ"
}; 
*/

/* firebase.initializeApp(firebaseConfig); */

//================== Auth + DB setting ================


class LogPage extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {


    };


  }



//================render========================



  render() {
    //let redirect = this.state.redirect
    //className="logBlockHide" style={redirect ? { display: "none" } : { display: "block" }}
    {/* <firebaseConfig /> */}
    return (
      <div>
        <div className="logBlock" >
          <form onSubmit={
            this.props.handleSignUp
          }>
            email<input type="text" onChange={this.props.passingEmail} />
            password<input type="text" onChange={this.props.passingPassword} />
            name<input type="text" onChange={this.props.passingName} />
            <input type="submit" value="sign upppp" />
          </form>

          <form onSubmit={
            this.props.handleSignIn
          }>
            email<input type="text" onChange={this.props.passingEmail} />
            password<input type="text" onChange={this.props.passingPassword} />
            <input type="submit" value="sign innnn" />
          </form>
        </div>

        <div>
          <div className="logBlock" >
            <button
              onClick={() => {
                if (this.props.logIn) {
                  alert('you are already log in!')
                  return
                }
                const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
                firebase.auth().signInWithPopup(googleAuthProvider)
                  .then((res) => {
                    console.log(res)
                    if (res.additionalUserInfo.isNewUser) {
                      console.log("google new user!")
                      this.props.manageUserData(res, "name")
                    }
                    window.location.href = "/"
                  })
                  .catch((err) => { console.log(err), alert(err.message) })
              }}>Sign In with Google
          </button>

            <button
              onClick={() => {
                if (this.props.logIn) {
                  alert('you are already log in!')
                  return
                }
                const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
                firebase.auth().signInWithPopup(facebookAuthProvider).then((res) => {
                  console.log(res)
                  if (res.additionalUserInfo.isNewUser) {
                    console.log("faebook new user!")
                    this.props.manageUserData(res, "name")
                  }
                  window.location.href = "/"
                })
                  .catch((err) => { console.log(err), alert(err.message) })
              }}>Sign In with Facebook
          </button>
          </div>


          <button
            onClick={() => {
              firebase.auth().signOut();
              window.location.href = "/"
            }}>Sign Out
          </button>
        </div>



      </div>
    )
  }




}


export default LogPage