import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import BookDetail from "./BookDetail"

export default class BookDetailRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.getbooks = this.getbooks.bind(this)
    this.renderRoute = this.renderRoute.bind(this)
    this.renderLink = this.renderLink.bind(this)
  }

  getbooks() {
    let books = []
    for (let i = 0; i < this.props.showBook.length; i++) {
      if (!books.includes(this.props.showBook[i].bookID)) {
        books.push(this.props.showBook[i].bookID)
      }
    }
    return books
  }

  renderLink() {
    return this.getbooks().map((bookID) => {
      let bookUrl = "/details/" + bookID
      return (
        <Link to={bookUrl} key={bookID} id={bookID}></Link>
      )
    })
  }

  renderRoute() {
    return this.getbooks().map((bookID) => {
      let bookUrl = "/details/" + bookID
      return (
        <Route exact path={bookUrl} key={bookID} id={bookID}>
          <div><BookDetail bookID={bookID} showBook={this.props.showBook} popularBook={this.props.popularBook} saveBook={this.props.saveBook} userData={this.props.userData} /></div>
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
