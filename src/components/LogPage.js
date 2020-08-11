import React from "react";
import '../style/LogPage.scss';
import { firebase } from "../utility/firebaseConfig"

let rootURL = window.location.href.substr(0, window.location.href.indexOf("/", 9))

class LogPage extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      signUpBtn: false
    }
    this.switchSignUp = this.switchSignUp.bind(this)
    this.switchLogIn = this.switchLogIn.bind(this)
    this.facebookLogin = this.facebookLogin.bind(this)
    this.googleLogin = this.googleLogin.bind(this)
  }

  switchSignUp() {
    this.setState({ signUpBtn:true})
  }

  switchLogIn() {
    this.setState({ signUpBtn: false })
  }

  googleLogin() {
    if (this.props.logIn) {
      alert('You are already log in!')
      return
    }
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(googleAuthProvider)
      .then((res) => {
        if (res.additionalUserInfo.isNewUser) {
          this.props.manageUserData(res, "name")
        } else {
          window.location.href = rootURL + "/wordbooks"
        }
      })
      .catch((err) => {
        console.log(err), alert(err.message)
      })
  }

  facebookLogin() {
    if (this.props.logIn) {
      alert('you are already log in!')
      return
    }
    const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(facebookAuthProvider)
      .then((res) => {
        if (res.additionalUserInfo.isNewUser) {
          this.props.manageUserData(res, "name")
        } else {
          window.location.href = rootURL + "/wordbooks"
        }
      })
      .catch((err) => {
        console.log(err), alert(err.message)
      })
  }

  render() {
    let signUpBtn = this.state.signUpBtn
    return (
      <div className="logBackground">
    
        <div className="logContainer">
          
          <div className="logClose"
            onClick={() => {
              window.location.href = rootURL
            }}>✕
          </div>
          <div className="logTitle">
            {signUpBtn ? "Sign Up" : "Log In"}
          </div>

          <div className="signUpComtainer"
            style={{
              display: signUpBtn ? "block" : "none"
            }}>
            <form className="signUpForm"
              onSubmit={
                this.props.handleSignUp
              }>
              <input className="signInInput" placeholder="EMAIL" type="text"
                onChange={
                  this.props.passingEmail
                } />
              <input className="signInInput" type="password" placeholder="PASSWORD"
                onChange={
                  this.props.passingPassword
                } />
              <input className="signInInput" placeholder="NAME" type="text"
                onChange={
                  this.props.passingName
                } />
              <input type="submit" className="signInSend" value="SIGN UP" />
              <div className="signInBtn"
                onClick={
                  this.switchLogIn
                }>Have an account already ?  Sign in.
              </div>
            </form>
          </div>
        
          <div className="signInComtainer"
            style={{
              display: signUpBtn ? "none" : "block"
            }}>
            <form
              onSubmit={
                this.props.handleSignIn
            }>
              <input type="text" placeholder="EMAIL" value={this.props.email}
                onChange={
                  this.props.passingEmail
                } />
              <input type="text" type="password" placeholder="PASSWORD" value={this.props.password}
                onChange={
                  this.props.passingPassword
                } />
              <input type="submit" value="LOG IN" />
            </form>
            <div className="signUpBtn"
              onClick={
                this.switchSignUp
              }>Don't have an account ? Join us.
            </div>
            <div className="signUpBtn normal" >or ...
            </div>
            <button
              onClick={() => {
                this.googleLogin()
              }}>I have Google account
            </button>
            <button
              onClick={() => {
                this.facebookLogin()
              }}>I have Facebook account
            </button>
          </div>{/* end of signInComtainer */}
          
        </div>{/* end of logContainer */}
        
      </div>
    )
  }




}


export default LogPage