import React from "react";
import './style/login.scss';

import { firebase } from "./firebaseConfig"

//================== Auth + DB setting ================

let rootURL = window.location.href.substr(0, window.location.href.indexOf("/", 9))

class LogPage extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      signUpBtn: false
    };

    this.switchSignUp = this.switchSignUp.bind(this)
    this.switchLogIn = this.switchLogIn.bind(this)
  }




  switchSignUp() {
    console.log("switchState")
    this.setState({ signUpBtn:true})
  }

  switchLogIn() {
    console.log("switchState")
    this.setState({ signUpBtn: false })
  }

//================render========================



  render() {
    let signUpBtn = this.state.signUpBtn
    return (
    <div className="logInBack">
    
        
        <div className="logInComtainer">
          <div className="logBtnBlock">

          </div>
          <div className="logClose" onClick={() => { window.location.href = rootURL}}>✕</div>
          <div className="logTitle">{signUpBtn ? "Sign Up" : "Log In"}</div>
          <div className="signUpComtainer" style={{ display: signUpBtn ? "block" : "none"}}>
            <form className="signUpForm" onSubmit={
            this.props.handleSignUp
          }>
              <input className="signInInput" placeholder="EMAIL" type="text" onChange={this.props.passingEmail} />
              <input className="signInInput"  placeholder="PASSWORD" type="text" onChange={this.props.passingPassword} />
              
              <input className="signInInput"  placeholder="NMAE" type="text" onChange={this.props.passingName} />
              <input type="submit" className="signInSend" value="SEND" />
              <div className="signInBtn" onClick={this.switchLogIn}>Have an account already ?  Sign in.</div>
            </form>
          </div>
        
          <div className="signInComtainer" style={{ display: signUpBtn ? "none" : "block" }}>
          <form onSubmit={
            this.props.handleSignIn
          }>
            <input type="text" placeholder="EMAIL" onChange={this.props.passingEmail} />
              <input type="text" placeholder="PASSWORD" onChange={this.props.passingPassword} />
            <input type="submit" value="SEND" />
            </form>
            
            <div className="signUpBtn" onClick={this.switchSignUp}>Don't have an account ? Join us.</div>
            <div className="signUpBtn normal" >or ...</div>
            <button
              onClick={() => {
                if (this.props.logIn) {
                  alert('You are already log in!')
                  return
                }
                const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
                firebase.auth().signInWithPopup(googleAuthProvider)
                  .then((res) => {
                    console.log(res)
                    if (res.additionalUserInfo.isNewUser) {
                      this.props.manageUserData(res, "name")
                    } else {
                      window.location.href = rootURL + "/wordbooks"
                    }
                
                  })
                  .catch((err) => { console.log(err), alert(err.message) })
              }}>I have Google account
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
                    this.props.manageUserData(res, "name")
                  }

                })
                  .catch((err) => { console.log(err), alert(err.message) })
              }}>I have Facebook account
          </button>
          </div>


          {/* <button
            onClick={() => {
              firebase.auth().signOut();
              window.location.href = "/"
            }}>Sign Out
          </button> */}
       



        </div>
        
      </div>
    )
  }




}


export default LogPage