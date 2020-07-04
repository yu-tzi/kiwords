import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import AddWords from "./addWords"
import Dashboard from "./dashboard"
import QuizSpell from "./quiz-spell"
import Statistics from "./statistics"
import WordBook from "./wordBooks"



class Home extends React.Component {
  render() {
    return (
      <div>Home</div>
    )
  }
}

class Main extends React.Component{
  
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

  render() {
    return (
      <Router>
        
      <Link to="/">Home</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/addwords">Add</Link>
      <Link to="/wordbooks">Books</Link>
      <Link to="/statistics">Statistics</Link> 
      <Link to="/quiz">quiz</Link>

      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
          <Route path="/dashboard">
          <Dashboard />
        </Route>
          <Route path="/wordbooks">
            <WordBook />
          </Route>
          <Route path="/addwords">
            <AddWords />
          </Route>
          <Route path="/statistics">
            <Statistics />
          </Route>
          <Route path="/quiz">
            <QuizSpell />
          </Route>
      </Switch>

    </Router>
    )
  }

  
};




export default Main