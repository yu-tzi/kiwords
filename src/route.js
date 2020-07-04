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





class RouteNav extends React.Component{
  
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  render() {

    if (this.props.logIn) {
      return (
        <Router>

          <Link to="/">Home</Link>
          <Link to="/login">login</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/addwords">Add</Link>
          <Link to="/wordbooks">Books</Link>
          <Link to="/quiz">quiz</Link>
          <Link to="/statistics">Statistics</Link>

          <Switch>
            <Route exact path="/">
              <Home />
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

    } else {
      return(
      <Router>

        <Link to="/">Home</Link>
        <Link to="/login">login</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/addwords">Add</Link>
        <Link to="/wordbooks">Books</Link>
        <Link to="/quiz">quiz</Link>
        <Link to="/statistics">Statistics</Link>

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
  }
    
  }

  
};




export default RouteNav 