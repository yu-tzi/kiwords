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
          <div className="logTitle">{signUpBtn ? "註冊" : "登入"}</div>
          <div className="signUpComtainer" style={{ display: signUpBtn ? "block" : "none"}}>
            <form className="signUpForm" onSubmit={
            this.props.handleSignUp
          }>
              <input className="signInInput" placeholder="輸入你的信箱" type="text" onChange={this.props.passingEmail} />
              <input className="signInInput"  placeholder="輸入你的密碼" type="text" onChange={this.props.passingPassword} />
              
              <input className="signInInput"  placeholder="輸入你的名字" type="text" onChange={this.props.passingName} />
              <input type="submit" className="signInSend" value="送   出" />
              <div className="signInBtn" onClick={this.switchLogIn}>返回登入頁</div>
            </form>
          </div>
        
          <div className="signInComtainer" style={{ display: signUpBtn ? "none" : "block" }}>
          <form onSubmit={
            this.props.handleSignIn
          }>
            <input type="text" placeholder="輸入你的信箱" onChange={this.props.passingEmail} />
              <input type="text" placeholder="輸入你的密碼" onChange={this.props.passingPassword} />
            <input type="submit" value="送   出" />
            </form>
            
            <div className="signUpBtn" onClick={this.switchSignUp}>沒有帳號嗎？快速註冊</div>
            <div className="signUpBtn normal" >或者 ...</div>
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
                      alert("google new user!")
                      this.props.manageUserData(res, "name")
                    }
                
                  })
                  .catch((err) => { console.log(err), alert(err.message) })
              }}>使用 Google 帳號
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
                    alert("faebook new user!")
                    this.props.manageUserData(res, "name")
                  }

                })
                  .catch((err) => { console.log(err), alert(err.message) })
              }}>使用 Facebook 帳號
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