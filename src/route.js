import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import AddWords from "./addWords"
import Dashboard from "./dashboard"
import Quiz from "./quiz"
import Statistics from "./statistics"
import WordBook from "./wordBooks"
import Home from "./home"
import LogPage from "./logIn"
import './style/route.scss';

import firebase from "firebase/app";
import "firebase/auth";
import { render } from "react-dom";



class RoutePage extends React.Component{
  
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  render() {

   /*  if (this.props.logIn) { */
      return (
        <Router>

          <Link to="/"></Link>
          <Link to="/login"></Link>
          <Link to="/dashboard"></Link>
          <Link to="/addwords"></Link>
          <Link to="/wordbooks"></Link>
          <Link to="/quiz"></Link>
          <Link to="/statistics"></Link>

          <Switch>
            <Route exact path="/">
              <Home />
              {/* 測試模式用，之後刪掉 */}
              <LogPage handleSignUp={this.props.handleSignUp} handleSignIn={this.props.handleSignIn} storeToUser={this.props.storeToUser} passingName={this.props.passingName} passingEmail={this.props.passingEmail} passingPassword={this.props.passingPassword} logIn={this.props.logIn} manageUserData={this.props.manageUserData} />
              {/* 測試模式用，之後刪掉 */}
            </Route>
            <Route path="/login">
              <LogPage handleSignUp={this.props.handleSignUp} handleSignIn={this.props.handleSignIn} storeToUser={this.props.storeToUser} passingName={this.props.passingName} passingEmail={this.props.passingEmail} passingPassword={this.props.passingPassword} logIn={this.props.logIn} manageUserData={this.props.manageUserData} />
            </Route>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
            <Route path="/addwords">
              <AddWords />
            </Route>
            <Route path="/wordbooks">
              <WordBook />
            </Route>
            <Route path="/quiz">
              <Quiz />
            </Route>
            <Route path="/statistics">
              <Statistics />
            </Route>

          </Switch>

        </Router>
      )
/* 
    } else {
      return(
      <Router>

        <Link to="/"></Link>
        <Link to="/login"></Link>
        <Link to="/dashboard"></Link>
        <Link to="/addwords"></Link>
        <Link to="/wordbooks"></Link>
        <Link to="/quiz"></Link>
        <Link to="/statistics"></Link>

        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/login">
            <LogPage handleSignUp={this.props.handleSignUp} handleSignIn={this.props.handleSignIn} storeToUser={this.props.storeToUser} passingName={this.props.passingName} passingEmail={this.props.passingEmail} passingPassword={this.props.passingPassword} logIn={this.props.logIn} manageUserData={this.props.manageUserData} />
            <Home />
          </Route>
          <Route path="/dashboard">
            <LogPage handleSignUp={this.props.handleSignUp} handleSignIn={this.props.handleSignIn} storeToUser={this.props.storeToUser} passingName={this.props.passingName} passingEmail={this.props.passingEmail} passingPassword={this.props.passingPassword} logIn={this.props.logIn} manageUserData={this.props.manageUserData} />
            <Home />
          </Route>
          <Route path="/addwords">
            <LogPage handleSignUp={this.props.handleSignUp} handleSignIn={this.props.handleSignIn} storeToUser={this.props.storeToUser} passingName={this.props.passingName} passingEmail={this.props.passingEmail} passingPassword={this.props.passingPassword} logIn={this.props.logIn} manageUserData={this.props.manageUserData} />
            <Home />
          </Route>
          <Route path="/wordbooks">
            <LogPage handleSignUp={this.props.handleSignUp} handleSignIn={this.props.handleSignIn} storeToUser={this.props.storeToUser} passingName={this.props.passingName} passingEmail={this.props.passingEmail} passingPassword={this.props.passingPassword} logIn={this.props.logIn} manageUserData={this.props.manageUserData} />
            <Home />
          </Route>
          <Route path="/quiz">
            <LogPage handleSignUp={this.props.handleSignUp} handleSignIn={this.props.handleSignIn} storeToUser={this.props.storeToUser} passingName={this.props.passingName} passingEmail={this.props.passingEmail} passingPassword={this.props.passingPassword} logIn={this.props.logIn} manageUserData={this.props.manageUserData} />
            <Home />
          </Route>
          <Route path="/statistics">
            <LogPage handleSignUp={this.props.handleSignUp} handleSignIn={this.props.handleSignIn} storeToUser={this.props.storeToUser} passingName={this.props.passingName} passingEmail={this.props.passingEmail} passingPassword={this.props.passingPassword} logIn={this.props.logIn} manageUserData={this.props.manageUserData} />
            <Home />
          </Route>

        </Switch>

      </Router>
      )  
  } */
    
  }

  
};


class RouteNav extends React.Component{

  clickMemberBtn() {
    console.log("click member!")
    return (
      <div>
        <div className="signOut"
          onClick={() => {
            firebase.auth().signOut();
            window.location.href = "/"
          }}>登出
        </div>
      </div>
    )
  }

  memberSwitch() {
    if (this.props.logIn) {
      return (
        <div className="memberFrame">
        <div className="memberImgFrame">
            <div className="memberImg">K</div>
            <div className="memberImgWord">Kiki Luo</div>
          </div>
          <div className="triangle" onClick={
            () => { this.clickMemberBtn() }
          }></div>
      </div>
      )
    } else {
      return (
      <div className="memLoginFrame">
        <img src="https://i.imgur.com/zGQkuFg.png" alt="" className="memberLogImg"></img>
        <div className="triangle"></div>
        <a href="/login" className="memberLogin">登入/註冊</a>
      </div>
      )
    }
  }

  render() {
    let logIn = this.props.logIn
    return (
    <div>
      <div className="navBox">
        <nav className="nav">
          <ul className="menu">
            <img src="https://i.imgur.com/R3BZzK9.png" alt="" className="menuHam"></img>
            <a href={logIn ? "/addwords" : "/login"} className="menuItem">新增卡片</a>
            <a href={logIn ? "/wordbooks" : "/login"} className="menuItem">單字本</a>
            <a href={logIn ? "/quiz" : "/login"} className="menuItem">測驗</a>
          </ul>
          <img src="https://i.imgur.com/xV8JpBB.png" alt="" className="logo"></img>

          <ul className="member">
            {this.memberSwitch()}
          </ul>
        </nav>
      </div>

        <RoutePage />

        <footer className="footer"></footer>
      </div>
    )
  }
}



export default RouteNav 