import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import AddWords from "./AddWords";
import Dashboards from "./Dashboards";
import WordBook from "./WordBook";
import Home from "./Home";
import LogPage from "./LogPage";
import BookDetailRouter from "./BookDetailRouter";
import Quiz from "./Quiz";
import "../style/RouteNav.scss";
import Loading from "./Loading.js";
import { firebase } from "../utility/firebaseConfig";
import { RippleButton } from "./Effect.js";

let rootURL = window.location.href.substr(
  0,
  window.location.href.indexOf("/", 9)
);

class RoutePage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Link to="/"></Link>
        <Link to="/login"></Link>
        <Link to="/dashboard"></Link>
        <Link to="/addwords"></Link>
        <Link to="/wordbooks"></Link>
        <Link to="/quiz"></Link>
        <Link to="/details"></Link>

        <Switch>
          <Route exact path="/">
            <Home logIn={this.props.logIn} />
          </Route>
          <Route path="/login">
            <Home logIn={this.props.logIn} />
            <LogPage
              handleSignUp={this.props.handleSignUp}
              handleSignIn={this.props.handleSignIn}
              storeToUser={this.props.storeToUser}
              passingName={this.props.passingName}
              passingEmail={this.props.passingEmail}
              passingPassword={this.props.passingPassword}
              logIn={this.props.logIn}
              manageUserData={this.props.manageUserData}
              email={this.props.email}
              password={this.props.password}
            />
          </Route>
          <Route path="/dashboard">
            <Dashboards
              userData={this.props.userData}
              memberData={this.props.memberData}
              uploadImg={this.props.uploadImg}
              popImageUpload={this.props.popImageUpload}
              closeImageUpload={this.props.closeImageUpload}
              imgUploadPop={this.props.imgUploadPop}
              popTitleUpload={this.props.popTitleUpload}
              closeTitleUpload={this.props.closeTitleUpload}
              uploadName={this.props.uploadName}
              changeName={this.props.changeName}
              titleUploadPop={this.props.titleUploadPop}
              titleContent={this.props.titleContent}
              isLoading={this.props.isLoading}
            />
          </Route>
          <Route path="/addwords">
            <AddWords showBook={this.props.showBook} />
          </Route>
          <Route path="/wordbooks">
            <WordBook
              userData={this.props.userData}
              showBook={this.props.showBook}
              memberData={this.props.memberData}
              storeBookData={this.props.storeBookData}
              addBookPop={this.props.addBookPop}
              addBookSucceed={this.props.addBookSucceed}
              popAddBook={this.props.popAddBook}
              closeAddBook={this.props.closeAddBook}
            />
          </Route>
          <Route path="/details">
            <BookDetailRouter
              showBook={this.props.showBook}
              userData={this.props.userData}
            />
          </Route>
          <Route path="/quiz">
            <Quiz
              showBook={this.props.showBook}
              userData={this.props.userData}
            />
          </Route>
        </Switch>
      </Router>
    );
  }
}

class MemberPop extends React.Component {
  render() {
    return (
      <div>
        <span className="trianglePop"></span>
        <div className="memPop">
          <RippleButton effectClass={"homeMemLogRippleBtnContainer"}>
            <div
              onClick={() => {
                setTimeout(() => {
                  window.location.href = rootURL + "/dashboard";
                }, 600);
              }}
            >
              Profile
            </div>
          </RippleButton>
          <RippleButton effectClass={"homeMemLogRippleBtnContainer"}>
            <div
              className="signOut"
              onClick={() => {
                setTimeout(() => {
                  firebase
                    .auth()
                    .signOut()
                    .then(() => {
                      window.location.href = rootURL;
                    });
                }, 600);
              }}
            >
              Log Out
            </div>
          </RippleButton>
        </div>
      </div>
    );
  }
}

class MenuPop extends React.Component {
  render() {
    return (
      <div>
        <span className="trianglePopMenu"></span>
        <div className="menuPop">
          <RippleButton effectClass={"menuPopFirstRippleBtnContainer"}>
            <div
              onClick={() => {
                setTimeout(() => {
                  window.location.href = rootURL + "/wordbooks";
                }, 600);
              }}
            >
              Wordbook
            </div>
          </RippleButton>
          <RippleButton effectClass={"menuPopSecondRippleBtnContainer"}>
            <div
              onClick={() => {
                setTimeout(() => {
                  window.location.href = rootURL + "/quiz";
                }, 600);
              }}
            >
              Quiz
            </div>
          </RippleButton>
        </div>
      </div>
    );
  }
}

class RouteNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuPop: false,
      memberPop: false,
    };
    this.convertName = this.convertName.bind(this);
    this.convertImg = this.convertImg.bind(this);
  }

  convertName() {
    if (this.props.memberData.name?.length < 19) {
      name = this.props.memberData.name;
    } else {
      name = this.props.memberData.name?.slice(0, 18);
      name = name + "...";
    }
    return <div className="memberImgWord">{name}</div>;
  }

  convertImg() {
    if (this.props.memberData.image?.length < 5) {
      return (
        <div className="memberImg">
          {this.props.memberData.name?.slice(0, 1)}
        </div>
      );
    } else {
      return (
        <img
          className="memberImg memberImgY"
          src={this.props.memberData.image}
          alt=""
        ></img>
      );
    }
  }

  memberSwitch() {
    if (this.props.logIn) {
      return (
        <div className="memberFrame" onClick={this.toggleMemberPop.bind(this)}>
          <div className="memberImgFrame">
            {this.props.memberData.length !== 0 &&
            this.props.memberData.email.length > 0 ? (
              <div className="memberImgFrame">
                {this.convertName()}
                {this.convertImg()}
              </div>
            ) : (
              <div className="memberImgFrame">
                <div className="memberImgWord">
                  <Loading loadingMini={true} />
                </div>
                <div
                  className="memberImg"
                  style={{ backgroundColor: "white" }}
                ></div>
              </div>
            )}
          </div>
          <div
            className="triangle"
            onClick={this.toggleMemberPop.bind(this)}
          ></div>
          {this.state.memberPop ? <MemberPop /> : null}
        </div>
      );
    } else {
      return (
        <div className="memLoginFrame">
          <a href={rootURL + "/login"}>
            <img src="images/head.png" alt="" className="memberLogImg"></img>
          </a>
          <a href={rootURL + "/login"}>
            <div className="triangle"></div>
          </a>
          <a href={rootURL + "/login"} className="memberLogin">
            Log In / Sign Up
            <div className="decolineLog"></div>
          </a>
        </div>
      );
    }
  }

  toggleMenuPop() {
    if (this.state.memberPop) {
      this.setState({ memberPop: false });
      this.setState({ menuPop: !this.state.menuPop });
    }
    this.setState({ menuPop: !this.state.menuPop });
  }

  redirectToLogin() {
    window.location.replace(rootURL + "/login");
  }

  toggleMemberPop() {
    if (this.state.menuPop) {
      this.setState({ menuPop: false });
      this.setState({ memberPop: !this.state.memberPop });
    }
    this.setState({ memberPop: !this.state.memberPop });
  }

  render() {
    let logIn = this.props.logIn;
    return (
      <div>
        <div className="content">
          <div className="navBox">
            <nav className="nav">
              <ul className="menu">
                <img
                  src="images/menu.png"
                  alt=""
                  className="menuHam"
                  onClick={
                    logIn
                      ? this.toggleMenuPop.bind(this)
                      : this.redirectToLogin.bind(this)
                  }
                ></img>
                {this.state.menuPop ? <MenuPop /> : null}
                <RippleButton effectClass={"navRippleBtnContainer"}>
                  <div
                    className="menuItem"
                    onClick={() => {
                      logIn
                        ? setTimeout(() => {
                            window.location.href = rootURL + "/wordbooks";
                          }, 600)
                        : setTimeout(() => {
                            window.location.href = rootURL + "/login";
                          }, 600);
                    }}
                  >
                    Wordbook
                  </div>
                </RippleButton>
                <RippleButton effectClass={"navRippleBtnContainer"}>
                  <div
                    className="menuItem"
                    onClick={() => {
                      logIn
                        ? setTimeout(() => {
                            window.location.href = rootURL + "/quiz";
                          }, 600)
                        : setTimeout(() => {
                            window.location.href = rootURL + "/login";
                          }, 600);
                    }}
                  >
                    Quiz
                  </div>
                </RippleButton>
              </ul>
              <a href={rootURL} className="logo">
                KiWords
              </a>
              <ul className="member">{this.memberSwitch()}</ul>
            </nav>
          </div>
          <RoutePage
            //login page
            handleSignUp={this.props.handleSignUp}
            handleSignIn={this.props.handleSignIn}
            storeToUser={this.props.storeToUser}
            passingName={this.props.passingName}
            passingEmail={this.props.passingEmail}
            passingPassword={this.props.passingPassword}
            logIn={this.props.logIn}
            manageUserData={this.props.manageUserData}
            email={this.props.email}
            password={this.props.password}
            //for all page
            userData={this.props.userData}
            showBook={this.props.showBook}
            memberData={this.props.memberData}
            //dashboard page
            uploadImg={this.props.uploadImg}
            popImageUpload={this.props.popImageUpload}
            closeImageUpload={this.props.closeImageUpload}
            imgUploadPop={this.props.imgUploadPop}
            popTitleUpload={this.props.popTitleUpload}
            closeTitleUpload={this.props.closeTitleUpload}
            uploadName={this.props.uploadName}
            changeName={this.props.changeName}
            titleUploadPop={this.props.titleUploadPop}
            titleContent={this.props.titleContent}
            isLoading={this.props.isLoading}
            //wordbooks page
            storeBookData={this.props.storeBookData}
            addBookPop={this.props.addBookPop}
            addBookSucceed={this.props.addBookSucceed}
            popAddBook={this.props.popAddBook}
            closeAddBook={this.props.closeAddBook}
          />
        </div>
        <footer className="footer"></footer>
      </div>
    );
  }
}

export default RouteNav;
