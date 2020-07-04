import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import QuizSpell from "./quiz-spell";
import QuizMatch from "./quiz-match"

class Quiz extends React.Component {
  render() {
    return (
    <div>
      <div>quiz</div>

      <Router>
        <Link to="/quiz/spell">spell</Link>
        <Link to="/quiz/match">match</Link>

          <Switch>
            <Route exact path="/quiz/spell">
              <QuizSpell />
            </Route>
            <Route path="/quiz/match">
              <QuizMatch />
            </Route>
          </Switch>
        </Router>
    </div>
    )
  }
}

export default Quiz