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


class MemberPop extends React.Component { 
  
  render() {
    return (
    <div> 
      <span className="trianglePop"></span>
      <div className="memPop">
        <a href="./dashboard">個人資料</a>
        <a href="./statistics">學習統計</a>
        <div className="signOut"
          onClick={() => {
            firebase.auth().signOut();
            window.location.href = "/"
          }}>登出
        </div>
      </div>
      </div>
    )
  }

}

class MenuPop extends React.Component {
  
  render() {
    return (
    <div>
      <span className="trianglePopMenu"></span>
      <div className="menuPop">
        <a href="./addWords">新增卡片</a>
        <a href="./wordBooks">單字本</a>
        <a href="./quiz">測驗</a>
      </div>
    </div>

    )
  }

}


class RouteNav extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      menuPop: false,
      memberPop:false
    }
  }

  memberSwitch() {
    if (this.props.logIn) {
      return (
      <div className="memberFrame">
          <div className="memberImgFrame" onClick={this.toggleMemberPop.bind(this)}>
            <div className="memberImg">K</div>
            <div className="memberImgWord">Kiki Luo</div>
          </div>
          <div className="triangle"></div>
          {this.state.memberPop ? <MemberPop /> : null}
      </div>
      )
    } else {
      return (
        <div className="memLoginFrame">
          <a href="/login" >
            <img src="https://i.imgur.com/zGQkuFg.png" alt="" className="memberLogImg"></img>
          </a>
          <a href="/login" >
            <div className="triangle"></div>
          </a>
        <a href="/login" className="memberLogin">登入/註冊</a>
      </div>
      )
    }
  }

  toggleMenuPop() {
    console.log('toggleMenuPop')
    if (this.state.memberPop){
      this.setState({ memberPop: false })
      this.setState({ menuPop: !this.state.menuPop})
    }
    this.setState({ menuPop: !this.state.menuPop })
  }

  redirectToLogin() {
    window.location.replace("./login");
  }

  toggleMemberPop() {
    console.log('toggleMemberPop')
    if (this.state.menuPop) {
      this.setState({ menuPop: false })
      this.setState({ memberPop: !this.state.memberPop })
    }
    this.setState({ memberPop: !this.state.memberPop })
  }

  render() {
    let logIn = this.props.logIn
    return (
      <div>
    <div className="content">
      <div className="navBox">
        <nav className="nav">
          <ul className="menu">
                <img src="https://i.imgur.com/R3BZzK9.png" alt="" className="menuHam"
                  onClick={logIn ? this.toggleMenuPop.bind(this) : this.redirectToLogin.bind(this)}></img>
            {this.state.menuPop ? <MenuPop /> : null}  
            <a href={logIn ? "/addwords" : "/login"} className="menuItem">新增卡片</a>
            <a href={logIn ? "/wordbooks" : "/login"} className="menuItem">單字本</a>
            <a href={logIn ? "/quiz" : "/login"} className="menuItem">測驗</a>
              </ul>
              <a href="./">
                <img src="https://i.imgur.com/xV8JpBB.png" alt="" className="logo"></img>
              </a>
          

          <ul className="member">
            {this.memberSwitch()}
          </ul>
        </nav>
      </div>

        
          <RoutePage />
        </div>

        <footer className="footer"></footer>
      </div>
    )
  }
}



export default RouteNav 