import React from "react";
import BookDtail from "./wordBook-detail"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

class WordBook extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      bookID: ["1234", "1123", "3649"]
    };
  }

  renderLink() {
    return this.state.bookID.map((bookID) => {
      let bookUrl = "/wordBooks/"+bookID
      return(
        <Link to={bookUrl} key={bookID} id={bookID}>bookID:{bookID}</Link>
      )
    })
  }

  renderRoute() {
    return this.state.bookID.map((bookID) => {
      let bookUrl = "/wordBooks/" + bookID
      return (
        <Route exact path={bookUrl} key={bookID} id={bookID}>
          <BookDtail />
        </Route>
      )
    })
  }



  render() {
    return (

      <div>
        <Router>
          {this.renderLink()}
          <Switch>
            {this.renderRoute()}
          </Switch>
        </Router>
      </div>
    )
  }
}

export default WordBook