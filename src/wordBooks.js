import React from "react";
import BookDtail from "./wordBook-detail"
import { db } from "./firebaseConfig"
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


    //要怎麼在 auth 反應過來登入等等狀態後，才換這一個 didMount ? 
    //還是應該要在 auth 那一層都先把資料準備好傳下來 ？
    
  

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
        <div><MyBook userData={this.props.userData} memberEmail={this.props.memberEmail}/></div>

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
  }

//bookID-建立日期
  
  getBookData(e) {
    if (this.props.userData.length > 0) {
      let time = new Date().getTime()
      this.setState({ bookName: e.target.value })
      this.setState({ uid: this.props.userData[0].uid })
      this.setState({ bookID: this.props.userData[0].uid + time })
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

  storeBookData(bookInfo) {
    alert("storeBookData")

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
    
  }
  

  render() {
    return (
      <div>
        
        <form onSubmit={this.manageBookData}>
          <input type="text" onChange={(e)=>this.getBookData(e)}></input>
          <input type="submit" value=" 新增單字本 "></input>
        </form>

      </div>
  )
}



}


export default WordBook