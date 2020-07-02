import React from "react";
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
      <div>Home page</div>
    )
  }
}

class Main extends React.Component{

  render() {
    return (
      <Router>
        <Link to="/"></Link>
        <Link to="/dashboard"></Link>
        <Link to="/statistic"></Link>
        <Link to="/addcard"></Link>
        <Link to="/wordbooks"></Link>
        <Link to="/quiz"></Link>

        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/statistic">
            <Statistics />
          </Route>
          <Route path="/addcard">
            <AddWords />
          </Route>
          <Route path="/wordbooks">
            <WordBook />
          </Route>
          <Route path="/quiz">
            <QuizSpell />
          </Route>
        </Switch>
      </Router>
    )
  }
}

//home to all other page => auth redirect (redirect to home with login box)
//quiz-spell page add route to quiz-match
//wordbbok page adding recursive route (using fake book ID list)



export default Main