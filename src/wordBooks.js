import React from "react";
import BookDtail from "./wordBook-detail"
import { db,firebase } from "./firebaseConfig"
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
          <div>book id : {bookID} <BookDtail /></div>
        </Route>
      )
    })
  }


  render() {
    return (
      <div>

        <div>你建立的單字本</div>
        <div><MyBook userData={this.props.userData} memberEmail={this.props.memberEmail} showBook={this.props.showBook} popularBook={this.props.popularBook} popularBookScore={this.props.popularBookScore}/></div>

        <div>你儲存的單字本</div>
        <div>render area</div>

        <div>熱門推薦</div>
        <div>render area</div>

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


class MyBook extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      bookName: "",
      uid: "",
      bookID: ""
    };
    this.getBookData = this.getBookData.bind(this)
    this.manageBookData = this.manageBookData.bind(this)
    this.storeBookData = this.storeBookData.bind(this)
    this.setState = this.setState.bind(this)
    this.showBook = this.showBook.bind(this)
    
  }


//bookID-建立日期
  
  getBookData(e) {
    if (this.props.userData.length > 0) {
      let time = new Date().getTime()
      this.setState({ bookName: e.target.value })
      this.setState({ uid: this.props.userData[0].uid })
      this.setState({ bookID: time + this.props.userData[0].uid })
    }
  }

  manageBookData() {
    alert("manageBookData")
    let bookInfo = {
      bookName: this.state.bookName,
      created: this.state.uid,
      evaluation: [],
      bookID: this.state.bookID,
      cards: [
/*         {
          word: "",
          meaning: "",
          sentences: "",
          synonyms: "",
          antonym:""
        }, {
          word: "",
          meaning: "",
          sentences: "",
          synonyms: "",
          antonym: ""
        } */
      ]
    }
    this.storeBookData(bookInfo)
  }

  // 存進 userData 的 ownBook

  storeBookData(bookInfo) {
    alert("storeBookData")
    event.preventDefault()

    db.collection("books").doc(bookInfo.bookID).set(bookInfo)
      .then(() => {
        event.preventDefault()
        alert("bookInfo: " + this.state.uid + " is setted!")
      })
      .catch(function (err) {
        event.preventDefault()
        console.error("Error adding document: ", error);
        alert(err.message);
      });
    
    
    db.collection("users").doc(this.state.uid).update({
      ownedBook: firebase.firestore.FieldValue.arrayUnion(bookInfo.bookID)
    }).then(() => {
      alert("user book data : " + bookInfo.bookID + " is setted!")
    })
      .catch(function (err) {
        event.preventDefault()
        console.error("Error adding document: ", error);
        alert(err.message);
      });

  }

  showBook() {

    if (this.props.showBook.length > 0) {

      return (
        <div>
        
          {
            this.props.showBook.map((obj, index) => {

              {/* console.log(index)
              console.log(obj) */}

              return (
                <div className="addBookShow bookformat" key={index}>
                  <div className="bookTitle">{obj}</div>
                  <div className="bookBtn">新增單字</div>
                </div>)
          
            })
          
          }
        </div>
      )
    }
  }


  

  render() {
    return (
      <div>
        {/* render books you have */}
        {this.showBook()}

        {/* adding books frame */}
      <div className="addBookShow bookformat">
        <div className="bookTitle">建立屬於你的學習素材！</div>
        <div className="bookBtn">新增單字本</div>
      </div>

      <div className="addBookHide bookformat">
        <form onSubmit={this.manageBookData} className="bookEnterFrame">
          <input className="bookEnter" type="text" onChange={(e)=>this.getBookData(e)}></input>
          <input className="bookSend" type="submit" value=" 新增單字本 "></input>
          </form>
        </div>

      </div>
  )
}



}


export default WordBook