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
  }


  renderLink() {

    let books = []
    for (let i = 0; i < this.props.showBook.length; i++) {
      if (!books.includes(this.props.showBook[i].bookID)) {
        books.push(this.props.showBook[i].bookID)
      }
    }
    for (let i = 0; i < this.props.saveBook.length; i++) {
      if (!books.includes(this.props.saveBook[i].bookID)) {
        books.push(this.props.saveBook[i].bookID)
      }
    }
    /* if (this.props.popularBook.length > 0) {
      for (let i = 0; i < 3; i++) {
        if (!books.includes(this.props.popularBook[i].bookID)) {
          books.push(this.props.popularBook[i].bookID)
        }
      }
    } */
    return books.map((bookID) => {
      let bookUrl = "/details/" + bookID
      return (
        <Link to={bookUrl} key={bookID} id={bookID}></Link>
      )
    })
  }

  renderRoute() {

    let books = []
    for (let i = 0; i < this.props.showBook.length; i++) {
      if (!books.includes(this.props.showBook[i].bookID)) {
        books.push(this.props.showBook[i].bookID)
      }
    }
 

    for (let i = 0; i < this.props.saveBook.length; i++) {
      if (!books.includes(this.props.saveBook[i].bookID)) {
        books.push(this.props.saveBook[i].bookID)
      }
    }
  

    /* if (this.props.popularBook.length > 0) {
      for (let i = 0; i < 3 ; i++) {
        if (!books.includes(this.props.popularBook[i].bookID)) {
          books.push(this.props.popularBook[i].bookID)
        }
      }
    } */
    
    
    return books.map((bookID) => {
      
      let bookUrl = "/details/" + bookID
      return (
        <Route exact path={bookUrl} key={bookID} id={bookID}>
          <div><BookDetail bookID={bookID} showBook={this.props.showBook} popularBook={this.props.popularBook} saveBook={this.props.saveBook} userData={this.props.userData}/></div>
        </Route>
      )
    })
  }



  render() {
    return (
      <div>
        {/* 以下 router */}
        <div>
          <Router>
            {this.renderLink()}
            <Switch>
              {this.renderRoute()}
            </Switch>
          </Router>
        </div>
      </div>
    )
  }
}


//export default BookDetail