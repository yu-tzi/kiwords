import React from "react";
import { db,firebase } from "./firebaseConfig"
import './style/wordBooks.scss';

let rootURL = window.location.href.substr(0, window.location.href.indexOf("/", 9))

class WordBook extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      toggleCreate: true
    };

    this.convertName = this.convertName.bind(this)
    this.convertImg = this.convertImg.bind(this)

  }

  convertImg() {

    if (this.props.img?.length < 5) {
      return (
        <div className="wordbookImg" >{this.props.name?.slice(0, 1)}</div>
      )
    } else {
      return (
        <img className="wordbookImg" src={this.props.img} alt=""
        ></img>
      )

    }
  }

  convertName() {

    let name

    if (this.props.name?.length < 19) {
      name = this.props.name
    } else {
      name = this.props.name?.slice(0, 18)
      name = name + "..."
    }
    return (
      <div className="wordbookN">{name}
      </div>
    )
  }



  render() {
    const toggleCreate = this.state.toggleCreate
    return (
      <div>
          
          
        <div className="addbookTopArea">
              {this.convertImg()}
        

        <div className="nameBtn">
          <div>
            {this.convertName()}
          </div>
          
          <div className="toggleContainer">
              <div className="toggleOption" style={{ backgroundColor: toggleCreate ? "#7dd" : "#303545", color: toggleCreate ? "#303545" : "white"}} onClick={() => { this.setState({toggleCreate: true})}}>Created Books</div>
              <div className="toggleOption" onClick={() => { this.setState({ toggleCreate: false }) }} style={{ backgroundColor: toggleCreate ? "#303545" : "#7dd", color: toggleCreate ? "white" : "#303545"}}>Liked Books</div>
            </div>
            
          </div>
        </div>


          {/* <div style={{ display: toggleCreate ? "block":"none"}} className="mainTitle"></div> */}
        <div><MyBook style={{ display: toggleCreate ? "block" : "none" }} userData={this.props.userData} memberEmail={this.props.memberEmail} showBook={this.props.showBook} toggleCreate={this.state.toggleCreate} /></div>

        {/* <div style={{ display: toggleCreate ? "none" : "block"}}  className="mainTitle"></div> */}
        <div><PopularBook style={{ display: toggleCreate ? "none" : "block" }} userData={this.props.userData} popularBook={this.props.popularBook} toggleCreate={this.state.toggleCreate} saveBook={this.props.saveBook}/></div>

          {/* <div style={{ display: toggleCreate ? "none" : "block" }}  className="mainTitle"></div> */}
        <div><SaveBook style={{ display: toggleCreate ? "none" : "block" }} userData={this.props.userData} saveBook={this.props.saveBook} toggleCreate={this.state.toggleCreate}/></div>

          

        
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
    this.renderStar = this.renderStar.bind(this)
  }

  //getTop3
  getPopData() {
    if (this.props.popularBook.length > 0) {
      let all = []
      for (let i = 0; i < 3; i++) {
        all.push(this.renderPopBook(this.props.popularBook[i], i))
      }
    
      return (
        <div className="getPopData" style={{ display: this.state.showPop ? "grid" : "none" }}>
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
        <div className="bookAuthor">{data.created === uid ? "這是你的作品！" : "建立者： " + data.author}</div>
        {this.renderStar(data.averageEvaluation)}
        {/* 評分按鈕-借放 */}
        {/* <div style={{ display: data.created === uid ? "none" : "block" }}>
          <div className={data.bookID + " 1"} onClick={(e) => this.clickStars(e)} style={{ color: this.state.starCheck[0] ? "yellow" : "grey" }}>★</div>
          <div className={data.bookID + " 2"} onClick={(e) => this.clickStars(e)} style={{ color: this.state.starCheck[1] ? "yellow" : "grey" }}>★</div>
          <div className={data.bookID + " 3"} onClick={(e) => this.clickStars(e)} style={{ color: this.state.starCheck[2] ? "yellow" : "grey" }}>★</div>
          <div className={data.bookID + " 4"} onClick={(e) => this.clickStars(e)} style={{ color: this.state.starCheck[3] ? "yellow" : "grey" }}>★</div>
          <div className={data.bookID + " 5"} onClick={(e) => this.clickStars(e)} style={{ color: this.state.starCheck[4] ? "yellow" : "grey" }}>★</div>
        </div> */}
        {/* 評分按鈕-借放 */}
        {/* 收藏按鈕-借放 */}
        {/* <div className={data.bookID + " saveBook"} onClick={(e) => this.saveBook(e)} style={{ display: data.created === uid ? "none":"block"}} >收藏</div> */}
        {/* 收藏按鈕-借放 */}
        {/* <div className="bookBtn" onClick={() => { window.location.href = ('https://kiwords-c058b.web.app/details/' + data.bookID) }}>{data.created === uid ? "編輯單字" : "查看單字"}</div> */}
      </div>
    )
  }

  renderStar(score) {
    let star = Math.round(score)
    let all = ""
    for (let i = 0; i < star; i++){
      all += "★"
    }
    for (let i = 0; i < (5-star); i++) {
      all += "☆"
    }
    return (
      <div className="bookStar">
        <div>{all}</div>
        <div>{"(" + score.toFixed(1) + ")"}</div>
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
        <div></div>
      )
    } else if (this.state.searchData.length === 0){
      return (
        <div className="noSreachResult">no result, try: idioms, sentences</div>
      )
    } else if (this.state.searchData.length > 0){
      for (let i = 0; i < this.state.searchData.length; i++) {
        dataAll.push(this.formSearchData(this.state.searchData[i],i))
      }
      return (
        <div className="renderSearchData" style={{ display: this.state.showPop ? "none" : "grid" }}>
          {dataAll}
        </div>
      )
    }
 
  }
  
  formSearchData(data, i) {
    let uid

    if (this.props.userData.length > 0) {
      uid = this.props.userData[0].uid
    } else {
      uid = 0
    }

    return (
      <div className="searchBook bookformat" key={i}>
        <div className="searchResultTitle">{data.bookName}</div>
        <div className="searchAuthor">{"Author： " + data.author}</div>
        {this.renderStar(data.averageEvaluation)}
        {/* 評分按鈕-借放 */}
        {/* <div className={data.bookID + " 1"} onClick={(e) => this.clickStars(e)} style={{color: this.state.starCheck[0]? "yellow":"grey"}}>★</div>
        <div className={data.bookID + " 2"} onClick={(e) => this.clickStars(e)} style={{ color: this.state.starCheck[1] ? "yellow" : "grey" }}>★</div>
        <div className={data.bookID + " 3"} onClick={(e) => this.clickStars(e)} style={{ color: this.state.starCheck[2] ? "yellow" : "grey" }}>★</div>
        <div className={data.bookID + " 4"} onClick={(e) => this.clickStars(e)} style={{ color: this.state.starCheck[3] ? "yellow" : "grey" }}>★</div>
        <div className={data.bookID + " 5"} onClick={(e) => this.clickStars(e)} style={{ color: this.state.starCheck[4] ? "yellow" : "grey" }}>★</div> */}
        {/* 評分按鈕-借放 */}
        {/* <div className={data.bookID +" bookBtn " + " saveBookBtn"} onClick={(e) => this.saveBook(e)} style={{ display: data.created === uid ? "none" : "block" }} >收藏</div>*/}
        <div className={data.bookID + " viewBookBtn"} onClick={() => { window.location.href = ('https://kiwords-c058b.web.app/details/' + data.bookID)}} >View</div>
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
      <div className="popBookBlock" style={{ display: this.props.toggleCreate ? "none" : "block" }}>
        
        
        <div className="likedSubtitle" style={{ display: this.props.saveBook ? "block" : "none" }}>Find more study material created by others.</div>

        <div className="noLikedInfor" style={{ display: this.props.saveBook ? "none" : "flex" }}>

          <div className="noLikedTitle">You have no liked book yet</div>
          <div className="noLikedSubtitle">Find study material,try searching for a keyword.</div>
        </div>




        {/* search */}
        {/* <div className="searchTitle">試試這些關鍵字 : TOEIC , SAT , vocab...</div> */}
        <form /*onSubmit={this.sendSearchData}*/ className="bookSearchFrame">
          <input className="bookSearch" type="text"  onChange={(e) => this.getSearchData(e)} placeholder="Try these keywords : TOEIC, vocab, SAT..."></input>
          <img src="https://i.imgur.com/OzPl4pv.png" className="searchImg" onClick={this.sendSearchData}></img>
          {/* <input className="bookSearchSend" type="submit" value=" Search "></input> */}
        </form>
        {/* pop data */}
        {/* {this.getPopData()} */}
        {/* search data */}
        <div className="searchHintTitle" style={{ display: this.state.searchData.length > 0 ? "block" : "none" }}>Search Result</div>

        {this.renderSearchData()}

        <div className="searchHintTitle" style={{ display: this.props.saveBook ? "block" : "none" }}>Your Liked Books</div>

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
    this.renderStar = this.renderStar.bind(this)
  }

  renderStar(score) {
    let star = Math.round(score)
    let all = ""
    for (let i = 0; i < star; i++) {
      all += "★"
    }
    for (let i = 0; i < (5 - star); i++) {
      all += "☆"
    }
    return (
      <div className="bookStar">
        <div>{all}</div>
        <div>{"(" + score.toFixed(1) + ")"}</div>
      </div>
    )
  }
  
  renderSaveBook() {
    console.log(this.props)
    console.log(this.props.saveBook.length)
    if (this.props.saveBook.length > 0) {
      
      
      let all = []
      for (let i = 0; i < this.props.saveBook.length; i++) {
        all.push(this.drawSavedBook(this.props.saveBook[i], i))
      }

      return (
        <div className="saveBookRender" style={{ display: this.props.toggleCreate ? "none" : "grid" }}>
          {all}
      </div>
      )
    }
  }

  drawSavedBook(data, i) {
   
    return (
      <div className="saveBook bookformat" key={i}>
        <div className="bookTitle">{data.bookName}</div>
        <div className="searchAuthor">{"Author： "+data.author}</div>
          {this.renderStar(data.averageEvaluation)}
        <div className="viewBookBtn" onClick={() => { window.location.href = ('https://kiwords-c058b.web.app/details/' + data.bookID) }}>View</div>
      </div>

    )
  }
  
    render() {
      return (
        <div className="saveBookBlock">
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
      displayName: "",
      newBookPop:false
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
    /* alert("manageBookData") */

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
    /* alert("storeBookData") */
    event.preventDefault()

    db.collection("books").doc(bookInfo.bookID).set(bookInfo)
      .then(() => {
        event.preventDefault()
      /* alert("bookInfo: " + this.state.uid + " is setted!") */
        
        db.collection("users").doc(this.state.uid).update({
          ownedBook: firebase.firestore.FieldValue.arrayUnion(bookInfo.bookID)
        }).then(() => {
          /* alert("user book data : " + bookInfo.bookID + " is setted!") */
          this.setState({ newBookPop: false })
          window.location.href = (rootURL + '/wordbooks')
        })
          .catch(function (err) {
            event.preventDefault()
            console.error("Error adding document: ", error);
            alert(err.message);
          });
        
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
        <div className="myBookRender">
          
          {/* adding books frame */}
          <div className="newBookShow " style={{ display: this.state.newBookPop ? "none" : "block" }} onClick={() => { this.setState({ newBookPop: true }) }}>
            <div className="addbookDecor">
              <div className="addBookTitle">{"✚"+ "　"+"Create New Book"}</div>
            </div>
          </div>

          <div className="newBookHide" style={{ display: this.state.newBookPop ? "block" : "none" }}>
            <form onSubmit={this.manageBookData} className="bookEnterFrame">
              <input className="bookEnter" type="text" placeholder="Enter a title, like: TOEIC words 3000" onChange={(e) => this.getBookData(e)}></input>
              <input className="bookSend" type="submit" value="SEND"></input>
            </form>
          </div>
        
          {
            this.props.showBook.map((obj, index) => {

              return (
                <div className="addBookShow bookformat" key={index} onClick={(event) => { event.stopPropagation(),window.location.href = ('https://kiwords-c058b.web.app/details/' + obj.bookID) }}>
                  <div className={"bookTitle " + obj.bookID} >{obj.bookName}</div>
                  {/* <div className="bookBtn" onClick={() => { window.location.href=('https://kiwords-c058b.web.app/details/' + obj.bookID)}}>編輯單字</div> */}
                  <div className="bookBtnPlus" onClick={(event) => { event.stopPropagation(), window.location.href = ('https://kiwords-c058b.web.app/addwords?' + obj.bookID)+"&"+obj.bookName }}>Add Words</div>
                  {/* <div className="bookBtnView" onClick={() => { window.location.href = ('https://kiwords-c058b.web.app/details/' + obj.bookID) }}>View</div> */}
                </div>)
          
            })
          
          } 
          

        </div>
      )
    } else {
      return (
        
        <div className="noBookInfor" style={{ display: this.props.toggleCreate ? "flex" : "none" }}>
          
          <div className="noBookTitle">You have no Wordbook yet</div>
          <div className="noBookSubtitle">Create a new Wordbook to start adding flashcards.</div>
          <div className="noBookBtn" onClick={() => { this.setState({ newBookPop: true }) }}>Create Wordbook</div>


          {/* add book popup */}
          <div className="addbookpop" style={{ display: this.state.newBookPop ? "block" : "none" }}>
            <div className="addbookpopX" onClick={() => { this.setState({ newBookPop: false }) }}>✕</div>
            <form onSubmit={this.manageBookData} className="addbookpopFrame">
              <input className="addbookpopEnter" type="text" placeholder="Enter a title, like : 4000 Essential English Words " onChange={(e) => this.getBookData(e)}></input>
              <input className="addbookpopSend" type="submit" value="Create"></input>
            </form>
          </div>

        </div>

      )
    }
  }


  render() {
    return (
      <div className="myBookBlock" style={{ display: this.props.toggleCreate ? "block" : "none" }}>
        {/* render books you have */}
        {this.showBook()}

      </div>
  )
}



}


export default WordBook