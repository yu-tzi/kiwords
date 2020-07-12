import React from "react";
import { db,firebase } from "./firebaseConfig"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { render } from "react-dom";


class WordBook extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      bookID: []
    };

  }

  render() {
    return (
      <div>

        <div>你建立的單字本</div>
        <div><MyBook userData={this.props.userData} memberEmail={this.props.memberEmail} showBook={this.props.showBook} /></div>

        <div>你儲存的單字本</div>
        <div><SaveBook userData={this.props.userData} saveBook={this.props.saveBook}/></div>

        <div>熱門推薦</div>
        <div><PopularBook userData={this.props.userData} popularBook={this.props.popularBook}/></div>

      
      </div>
    )
  }
}


class PopularBook extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showPop: true,
      searchWord: "",
      searchData: "",
      starCheck: [false, false, false, false, false]
    };

    this.getPopData = this.getPopData.bind(this)
    this.renderPopBook = this.renderPopBook.bind(this)
    this.getSearchData = this.getSearchData.bind(this)
    this.sendSearchData = this.sendSearchData.bind(this)
    this.renderSearchData = this.renderSearchData.bind(this)
    this.formSearchData = this.formSearchData.bind(this)
    this.clickStars = this.clickStars.bind(this)
    this.saveBook = this.saveBook.bind(this)
  }

  //getTop3
  getPopData() {
    if (this.props.popularBook.length > 0) {
      let all = []
      for (let i = 0; i < 3; i++) {
        all.push(this.renderPopBook(this.props.popularBook[i], i))
      }
    
      return (
        <div style={{ display: this.state.showPop ? "block" : "none" }}>
          {all}
        </div>
      )
    }
  }
  
  renderPopBook(data, i) {
    let uid

    if (this.props.userData.length > 0) {
      uid = this.props.userData[0].uid
    } else {
      uid = 0
    }

    return (
      <div className="popBook bookformat" key={i}>
        <div className="bookTitle">{data.bookName}</div>
        <div className="bookStar">{data.averageEvaluation}</div>
        <div className="bookAuthor">{data.created === uid ? "這是你的作品！":data.author}</div>
        {/* 評分按鈕-借放 */}
        <div style={{ display: data.created === uid ? "none" : "block" }}>
          <div className={data.bookID + " 1"} onClick={(e) => this.clickStars(e)} style={{ color: this.state.starCheck[0] ? "yellow" : "grey" }}>★</div>
          <div className={data.bookID + " 2"} onClick={(e) => this.clickStars(e)} style={{ color: this.state.starCheck[1] ? "yellow" : "grey" }}>★</div>
          <div className={data.bookID + " 3"} onClick={(e) => this.clickStars(e)} style={{ color: this.state.starCheck[2] ? "yellow" : "grey" }}>★</div>
          <div className={data.bookID + " 4"} onClick={(e) => this.clickStars(e)} style={{ color: this.state.starCheck[3] ? "yellow" : "grey" }}>★</div>
          <div className={data.bookID + " 5"} onClick={(e) => this.clickStars(e)} style={{ color: this.state.starCheck[4] ? "yellow" : "grey" }}>★</div>
        </div>
        {/* 評分按鈕-借放 */}
        {/* 收藏按鈕-借放 */}
        <div className={data.bookID + " saveBook"} onClick={(e) => this.saveBook(e)} style={{ display: data.created === uid ? "none":"block"}} >收藏</div>
        {/* 收藏按鈕-借放 */}
        <div className="bookBtn">{data.created === uid ? "編輯單字" : "查看單字"}</div>
      </div>
    )
  }

  saveBook(e) {
    if (this.props.userData.length > 0) {
      console.log(e.target.className.split(' ')[0])
      console.log(this.props.userData[0].uid)
      
      db.collection("users").doc(this.props.userData[0].uid).update({
        "savedBook": firebase.firestore.FieldValue.arrayUnion(e.target.className.split(' ')[0])
      })
        .then(function () {
          console.log("Document successfully updated!");
        });
   
    }
  }

  getSearchData(e) {
    this.setState({searchWord: e.target.value.toLowerCase()})
  }


  sendSearchData() {
    event.preventDefault()
    this.setState({showPop:false})

    if (this.props.userData.length > 0) {
      let uid = this.props.userData[0].uid
      let data = []

      db.collection("books").where("searchKey", "array-contains", this.state.searchWord).get().then((doc) => {
      
        if (doc) {
          doc.forEach((doc) => {
            if (doc.data().created !== uid) {
              data.push(doc.data())
            }
          })
          this.setState({ searchData: data })
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }).catch(function (error) {
        console.log("Error getting document:", error);
      });

    }
  }

  renderSearchData() {
    let dataAll = []

    if (this.state.searchData === "") {
      return (
        <div>undefined</div>
      )
    } else if (this.state.searchData.length === 0){
      return (
        <div>no result Q_Q</div>
      )
    } else if (this.state.searchData.length > 0){
      for (let i = 0; i < this.state.searchData.length; i++) {
        dataAll.push(this.formSearchData(this.state.searchData[i],i))
      }
      return (
        <div style={{ display: this.state.showPop ? "none" : "block" }}>
          {dataAll}
        </div>
      )
    }
 
  }
  
  formSearchData(data, i) {
    return (
      <div className="searchBook bookformat" key={i}>
        <div className="searchTitle">{data.bookName}</div>
        <div className="searchStar">{data.averageEvaluation}</div>
        <div className="searchAuthor">{data.author}</div>
        {/* 評分按鈕-借放 */}
        {/* <div className={data.bookID + " 1"} onClick={(e) => this.clickStars(e)} style={{color: this.state.starCheck[0]? "yellow":"grey"}}>★</div>
        <div className={data.bookID + " 2"} onClick={(e) => this.clickStars(e)} style={{ color: this.state.starCheck[1] ? "yellow" : "grey" }}>★</div>
        <div className={data.bookID + " 3"} onClick={(e) => this.clickStars(e)} style={{ color: this.state.starCheck[2] ? "yellow" : "grey" }}>★</div>
        <div className={data.bookID + " 4"} onClick={(e) => this.clickStars(e)} style={{ color: this.state.starCheck[3] ? "yellow" : "grey" }}>★</div>
        <div className={data.bookID + " 5"} onClick={(e) => this.clickStars(e)} style={{ color: this.state.starCheck[4] ? "yellow" : "grey" }}>★</div> */}
        {/* 評分按鈕-借放 */}
        <div className="bookBtn">查看單字</div>
      </div>
    )
  }

  clickStars(e) {
    let score = parseInt(e.target.className.split(" ")[1])
    let bookid = e.target.className.split(" ")[0]
    let prevScore = []
    let avgScore = 0
    let uid = this.props.userData[0].uid

    //change score

    db.collection("books").doc(bookid).get().then((doc) => {
      let data =[]
      if (typeof(doc.data().evaluation) === "number") {
        data.push(doc.data().evaluation)
        console.log(data)
        data.push(score)
      } else if (typeof (doc.data().evaluation) === "string" || typeof (doc.data().evaluation)=== "object") { 
        data = doc.data().evaluation
        console.log(data)
        data.push(score)
      } else {
        console.log(typeof (doc.data().evaluation))
        data.push(score)
      }
      db.collection("books").doc(bookid).update({
        "evaluation": data
      }) 
        .then(function () {
          console.log("Document successfully updated!");
          //change avg
          db.collection("books").doc(bookid).get().then((doc) => {
            console.log("document data:", doc.data());
            prevScore = doc.data().evaluation
            console.log(prevScore)
            for (let i = 0; i < prevScore.length; i++) {
              console.log(prevScore[i])
              avgScore += prevScore[i]
            }
            avgScore = avgScore / prevScore.length
            console.log(avgScore)
            db.collection("books").doc(bookid).update({
              "averageEvaluation": avgScore
            }).then(() => {
              console.log(avgScore)
            })
          }).catch(function (error) {
            console.log("Error getting cached document:", error);
          });
        })
        .catch((err) => console.log(err))
      
    }).catch((err)=>console.log(err))
    
    
    //store to user


    db.collection("users").doc(uid).update({
      "userExp.likeBook": firebase.firestore.FieldValue.arrayUnion(bookid)
    }).then(() => {
      console.log(uid)
    }).catch((err) => { console.log(err) })


    
    //change color
    for (let i = 0; i < score; i++){
      let arr = this.state.starCheck
      arr[i] = true
      this.setState({ starCheck:arr})
    }    
  }

  

  render() {
    return (
      <div >
        {/* search */}
        <div className="searchTitle">試試看以下關鍵字:TOEIC,GRE,Intermediate...</div>
        <form onSubmit={this.sendSearchData} className="bookSearchFrame">
          <input className="bookSearch" type="text" onChange={(e) => this.getSearchData(e)}></input>
          <input className="bookSearchSend" type="submit" value=" 搜尋單字本 "></input>
        </form>
        {/* pop data */}
        {this.getPopData()}
        {/* search data */}
        {this.renderSearchData()}
      </div>
    )
  } 
}



class SaveBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };

    this.renderSaveBook = this.renderSaveBook.bind(this)
    this.drawSavedBook = this.drawSavedBook.bind(this)
  }

  
  renderSaveBook() {
    console.log(this.props)
    console.log(this.props.saveBook.length)
    if (this.props.saveBook.length > 0) {
      
      console.log("saveBook>0")
      let all = []
      for (let i = 0; i < this.props.saveBook.length; i++) {
        all.push(this.drawSavedBook(this.props.saveBook[i], i))
      }

      return (
        <div>
          {all}
      </div>
      )
    }
  }

  drawSavedBook(data,i) {
    return (
      <div className="saveBook bookformat" key={i}>
        <div className="bookTitle">{data.bookName}</div>
            <div className="bookAuthor">{data.author}</div>
            <div className="bookScore">{data.averageEvaluation}</div>
            <div className="bookBtn">查看單字</div>
      </div>

    )
  }
  
    render() {
      return (
        <div>
          {this.renderSaveBook()}
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
      this.setState({ bookID: time + this.props.userData[0].uid })

      db.collection("users").doc(this.props.userData[0].uid).get().then((doc)=> {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          this.setState({ displayName: doc.data().name })
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }).catch(function (error) {
        console.log("Error getting document:", error);
      });

      
      
    }
  }

  manageBookData() {
    alert("manageBookData")

    let searchWords = []
    let searchArray = this.state.bookName.split("").filter(function (c) {
      return c != ".";
    }).join("").split(" ")
    for (let i = 0; i < searchArray.length; i++){
      event.preventDefault()
      searchWords.push(searchArray[i].toLowerCase())
    }

    console.log(searchWords)

    let bookInfo = {
      bookName: this.state.bookName,
      searchKey: searchWords,
      created: this.state.uid,
      author: this.state.displayName,
      averageEvaluation: 0,
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

              return (
                <div className="addBookShow bookformat" key={index}>
                  <div className={"bookTitle "+ obj.bookID}>{obj.bookName}</div>
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