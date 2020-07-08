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
        <div><MyBook userData={this.props.userData} memberEmail={this.props.memberEmail} showBook={this.props.showBook} /></div>

        <div>你儲存的單字本</div>
        <div><SaveBook/></div>

        <div>熱門推薦</div>
        <div><PopularBook popularBook={this.props.popularBook} popularBookScore={this.props.popularBookScore} topThreeName={this.props.topThreeName}/></div>

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


class PopularBook extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showPop: true,
      searchWord:""
    };

    this.getPopData = this.getPopData.bind(this)
    this.renderPopBook = this.renderPopBook.bind(this)
    this.getSearchData = this.getSearchData.bind(this)
    this.sendSearchData = this.sendSearchData.bind(this)
  }

  getPopData() {
    let popData = []

    for (let i = 0; i < this.props.topThreeName.length; i++) {
      popData.push(this.renderPopBook(i))
    }
    return (
      <div style={{ display: this.state.showPop ? "block":"none"}}>
      {popData}
      </div>
    )
  }
  
  renderPopBook(i) {
    return (
      <div className="popBook bookformat" key={i}>
        <div className="bookTitle">{this.props.topThreeName[i]}</div>
        <div className="bookStar">{this.props.popularBookScore[i]}</div>
        <div className="bookBtn">查看單字</div>
      </div>
    )
  }

  getSearchData(e) {
    this.setState({searchWord:e.target.value})
  }

  sendSearchData() {


    let data = []
    event.preventDefault()
    db.collection("books").get().then((querySnapshot)=>{
      querySnapshot.forEach((doc)=>{
        // doc.data() is never undefined for query doc snapshots
      /* console.log(doc.id, " => ", doc.data()); */
        let book = {
          bookName: doc.data().bookName
        }
        data.push(book)
        //塞資料塞到一半
        
      });
    });
    console.log(data)
    

    for (let i = 0; i < data.length; i++) {
      if (data[i].bookName.includes(this.state.searchWord)) {
        console.log(data[i].bookName)
        //搜尋應該沒問題，但還要要檢驗是否為該使用者的本子
        //也就是說要先把這裡的資料存起來
        //先在這裡把欄位的值都取好，傳到下一個 render 的 function
        //input值跟搜尋值得大小寫要調整一下
  
        
      }
    }
    /* if (this.state.logIn) {
            for (let k = 0; k < container.length; k++) {
              console.log("hi")
              for (let m = 0; m < this.state.showBook.length; m++) {
                console.log("book")
                let book = container[k].bookName
                if (book.includes(this.state.showBook[m])) {
                  container.splice(k, 1)
                }
              }

            }
          } */


  }
  
  

  render() {
    return (
      <div >
        {/* search */}
        <form onSubmit={this.sendSearchData} className="bookSearchFrame">
          <input className="bookSearch" type="text" onChange={(e) => this.getSearchData(e)}></input>
          <input className="bookSearchSend" type="submit" value=" 搜尋單字本 "></input>
        </form>
        {/* pop data */}
        {this.getPopData()}
      </div>
    )
  }



  
}



class SaveBook extends React.Component {

  render() {
    return (
      <div className="saveBook bookformat" >
        <div className="bookTitle">標題</div>
        <div className="bookAuthor">作者</div>
        <div className="bookBtn">查看單字</div>
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
      bookID: "",
      displayName:""
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
      this.setState({ displayName: this.props.userData[0].displayName })
      this.setState({ bookID: time + this.props.userData[0].uid })
    }
  }

  manageBookData() {
    alert("manageBookData")
    let bookInfo = {
      bookName: this.state.bookName,
      created: this.state.uid,
      author: this.state.displayName,
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