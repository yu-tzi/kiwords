
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
import BookDtail from "./wordBook-route"
import QuizMatch from "./quiz"
import './style/route.scss';

import { db, firebase } from "./firebaseConfig"

let rootURL = window.location.href.substr(0, window.location.href.indexOf("/", 9))

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
          <Link to="/details"></Link>

          <Switch>
            <Route exact path="/">
              {/* <Home logIn={this.props.logIn}/> */}
              {/* <Dashboard img={this.props.img} name={this.props.name} memberEmail={this.props.memberEmail} userData={this.props.userData} /> */}
              {/* <LogPage handleSignUp={this.props.handleSignUp} handleSignIn={this.props.handleSignIn} storeToUser={this.props.storeToUser} passingName={this.props.passingName} passingEmail={this.props.passingEmail} passingPassword={this.props.passingPassword} logIn={this.props.logIn} manageUserData={this.props.manageUserData} /> */}
              <AddWords showBook={this.props.showBook} />
              {/* <WordBook userData={this.props.userData} showBook={this.props.showBook} popularBook={this.props.popularBook} saveBook={this.props.saveBook} img={this.props.img} name={this.props.name} memberEmail={this.props.memberEmail}/> */}
              {/* <Dtail showBook={this.props.showBook} popularBook={this.props.popularBook} saveBook={this.props.saveBook} userData={this.props.userData}/> */}
              {/* <QuizMatch showBook={this.props.showBook}/> */}
              {/* <Statistics /> */}
            </Route>
            <Route path="/login">
              <Home logIn={this.props.logIn}/>
              <LogPage handleSignUp={this.props.handleSignUp} handleSignIn={this.props.handleSignIn} storeToUser={this.props.storeToUser} passingName={this.props.passingName} passingEmail={this.props.passingEmail} passingPassword={this.props.passingPassword} logIn={this.props.logIn} manageUserData={this.props.manageUserData} />
            </Route>
            <Route path="/dashboard">
              <Dashboard img={this.props.img} name={this.props.name} memberEmail={this.props.memberEmail} userData={this.props.userData} />
            </Route>
            <Route path="/addwords">
              <AddWords showBook={this.props.showBook}/>
            </Route>
            <Route path="/wordbooks">
              <WordBook userData={this.props.userData} memberEmail={this.props.memberEmail} showBook={this.props.showBook} popularBook={this.props.popularBook} saveBook={this.props.saveBook} />
            </Route>
            <Route path="/details">
              <BookDtail showBook={this.props.showBook} popularBook={this.props.popularBook} saveBook={this.props.saveBook} userData={this.props.userData}/>
            </Route>
            <Route path="/quiz">
              <QuizMatch showBook={this.props.showBook}/>
            </Route>
            <Route path="/statistics">
              <Statistics />
            </Route>

          </Switch>

        </Router>
      )
    
  }
};




class MemberPop extends React.Component { 
  
  render() {
    return (
    <div> 
      <span className="trianglePop"></span>
      <div className="memPop">
          <a href={rootURL+"/dashboard"}>Profile</a>
          {/* <a href={rootURL+"/statistics"}>學習統計</a> */}
        <div className="signOut"
          onClick={() => {
            firebase.auth().signOut().then(() => {
              window.location.href = rootURL
            })
            
          }}>Log Out
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
          <a href={rootURL + "/addWords"}>Add Words</a>
          <a href={rootURL +"/wordBooks"}>Wordbook</a>
          <a href={rootURL +"/quiz"}>Quiz</a>
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
      memberPop: false,
    }
    this.convertName = this.convertName.bind(this)
    this.convertImg = this.convertImg.bind(this)
  }
  
  convertName() {
    if (this.props.name.length < 19) {
      name = this.props.name
    } else {
      name = this.props.name.slice(0, 18)
      name = name + "..."
    }
    return (
      <div className="memberImgWord">{name}</div>
    )
  }

  convertImg() {

    if (this.props.img.length < 5) {
      return (
        <div className="memberImg">{this.props.name.slice(0, 1)}</div>
      )
    } else {
      return (
        <img className="memberImg memberImgY" src={this.props.img} alt=""
        ></img>
      )
    }
    
    
  }


  memberSwitch() {
    if (this.props.logIn) {
      return (
      <div className="memberFrame">
          <div className="memberImgFrame" onClick={this.toggleMemberPop.bind(this)}>
            {this.convertName()}
            {this.convertImg()}
          </div>
          <div className="triangle" onClick={this.toggleMemberPop.bind(this)}></div>
          {this.state.memberPop ? <MemberPop /> : null}
      </div>
      )
    } else {
      return (
        <div className="memLoginFrame">
          <a href={rootURL +"/login"} >
            <img src="https://i.imgur.com/zGQkuFg.png" alt="" className="memberLogImg"></img>
          </a>
          <a href={rootURL +"/login"} >
            <div className="triangle"></div>
          </a>
          <a href={rootURL + "/login"} className="memberLogin">Log In / Sign Up<div className="decolineLog"></div></a>
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
    window.location.replace(rootURL +"/login");
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
                <a href={logIn ? rootURL + "/addwords" : rootURL + "/login"} className="menuItem">Add Words<div className="decoline"></div></a>
                <a href={logIn ? rootURL + "/wordbooks" : rootURL + "/login"} className="menuItem">Wordbook<div className="decoline"></div></a>
                <a href={logIn ? rootURL + "/quiz" : rootURL + "/login"} className="menuItem">Quiz<div className="decoline"></div></a>
              </ul>

              <a href={rootURL} className="logo">KiWords</a>

              {/* <a href={rootURL}>
                <img src="https://i.imgur.com/xV8JpBB.png" alt="" className="logo"></img>
              </a> */}
          

          <ul className="member">
            {this.memberSwitch()}
          </ul>
        </nav>
      </div>

        
          <RoutePage handleSignUp={this.props.handleSignUp} handleSignIn={this.props.handleSignIn} storeToUser={this.props.storeToUser} passingName={this.props.passingName} passingEmail={this.props.passingEmail} passingPassword={this.props.passingPassword} logIn={this.props.logIn} manageUserData={this.props.manageUserData} img={this.props.img} name={this.props.name} memberEmail={this.props.memberEmail} userData={this.props.userData} showBook={this.props.showBook} popularBook={this.props.popularBook} saveBook={this.props.saveBook}/>
        </div>

        <footer className="footer"></footer>
      </div>
    )
  }
}



export default RouteNav 