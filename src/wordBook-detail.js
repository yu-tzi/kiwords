import React from "react";
import { db, firebase } from "./firebaseConfig"
import './style/wordbook-detail.scss';



class Dtail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      bookOwner: "",
      starCheck: [false, false, false, false, false],
      wordDetail: false,
      nowWord: "",
      wordRenew: false,
      page: 0,
      lastValue: 0
    };
    this.renderWords = this.renderWords.bind(this)
    this.renderCards = this.renderCards.bind(this)
    this.clickStars = this.clickStars.bind(this)
    this.saveBook = this.saveBook.bind(this)
    this.renderStar = this.renderStar.bind(this)
    this.popWord = this.popWord.bind(this)
    this.renderPage = this.renderPage.bind(this)
    this.renderPageDetail = this.renderPageDetail.bind(this)
    this.changePage = this.changePage.bind(this)
  }

  

  componentDidiMount() {
    console.log('componentDidMount')
  }


  
  componentDidUpdate() {
    console.log('componentDidUpdate')
    let url = "https://kiwords-c058b.web.app/details/159592106485385aFFbQvKxZmidyhpfaKGrl2uPL2?SAT%202500"
    /* let url = window.location.href */

    let target = ""
    for (let i = 0; i < url.split("/").length; i++) {
      target = url.split("/")[i]
    }
   
    
    let count = 0
    console.log(this.state.cards.length)
    if (target.split("?")[0].length > 0 && this.state.cards.length < 1) {
      console.log(target.split("?")[0])

      let cards = []
      db.collection("books").doc(target.split("?")[0]).get().then((doc) => {

        if (doc.exists) {


          if (doc.data().cards.length > 0) {
            console.log(doc.data().cards)
            console.log(doc.data().cards.length % 8)

            if (doc.data().cards.length % 8 === 0) {
              this.setState({ page: Math.floor(doc.data().cards.length / 8)})
            } else {
              this.setState({ page: Math.floor(doc.data().cards.length / 8)+1})
            }
          

            let lastNum
            if (8 > doc.data().cards.length) {
              lastNum = doc.data().cards.length % 8
            } else {
              lastNum = 8
            }
            /* console.log("Document data:", doc.data().cards); */
            for (let i = 0; i < lastNum; i++) {
              console.log(doc.data().cards[i])
              //只剩一個時會刪不掉
              //第二頁刪到剩第一頁的時候，第一頁會無法刪
              cards.push(this.renderCards(doc.data().cards[i], i))
              count++
              console.log("renderCards in update")
            }
            if (count = doc.data().cards.length) {
            
              console.log('cards state change')
              this.setState({ cards: cards })
              this.setState({ bookOwner: doc.data().created })
            }

          } else {
            console.log("No cards :(")
          }
          //end of if doc exist
        } else {
          console.log("No such document!");
        }
      }).catch(function (error) {
        console.log("Error getting document:", error);
      })

    } else if (target.split("?")[0].length > 0 && this.state.cards.length >= 1 && this.state.wordRenew) {
      let cards = []
      
      db.collection("books").doc(target.split("?")[0]).get().then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data().cards)

          if (doc.data().cards.length > 0) {
            console.log(doc.data().cards)
            console.log(doc.data().cards.length % 8)

            if (doc.data().cards.length % 8 === 0) {
              this.setState({ page: Math.floor(doc.data().cards.length / 8) })
            } else {
              this.setState({ page: Math.floor(doc.data().cards.length / 8) + 1 })
            }
          }


          let lastNum 
          if (this.state.lastValue + 8 > doc.data().cards.length && doc.data().cards.length > 0) {
            lastNum = this.state.lastValue + doc.data().cards.length % 8
          } else if (this.state.lastValue + 8 > doc.data().cards.length && this.state.lastValue < 1 && doc.data().cards.length < 1) {
            cards = []
            console.log('yo')
            this.setState({ cards: cards })
            this.setState({ wordRenew: false })
          }else {
            lastNum = this.state.lastValue + 8
          }

          for (let i = this.state.lastValue; i < lastNum; i++) {
            cards.push(this.renderCards(doc.data().cards[i], i))
            count++
          }
          
          if (count = doc.data().cards.length) {
            /* console.log(cards) */
            console.log('cards state change')
            this.setState({ cards: cards })
            this.setState({ bookOwner: doc.data().created })
            this.setState({ wordRenew: false})
          }
        } else {
          console.log("No such document!");
        }
      }).catch(function (error) {
        console.log("Error getting document:", error);
      })
    }


  }



  renderWords() {
    /* console.log('render words') */
      return (
        <div className="wordCardBox">
        {this.state.cards}
        </div>
      )
  }

  popWord(e) {
    /* console.log(e.target)
    console.log(e.target.className) */
    e.stopPropagation()
    this.setState({ wordDetail: !this.state.wordDetail })
    this.setState({ nowWord: e.target.className })
    this.setState({ wordRenew: true })
    /* console.log(typeof (this.state.wordDetail))
    console.log(this.state.wordDetail)
    if (this.state.wordDetail){console.log('say hi')} */
    
  }

  deleteWord(e) {

  /* let url = window.location.href */
    
    e.stopPropagation()


    let url = "https://kiwords-c058b.web.app/details/159592106485385aFFbQvKxZmidyhpfaKGrl2uPL2?SAT%202500"
    let target = ""
    for (let i = 0; i < url.split("/").length; i++) {
      target = url.split("/")[i]
    }

    let all = []
    let className
    className = e.target.className
    console.log(e.target.className)
    db.collection("books").doc(target.split("?")[0]).get().then((doc) => {
      console.log(doc.data().cards)
        
      for (let i = 0; i < doc.data().cards.length; i++){
          if (parseInt(className) === i) {
            console.log("catch"+i)
          } else {
            all.push(doc.data().cards[i])
          }
      }
      console.log(all)
           
    }).then(() => {
      console.log(all)
      db.collection("books").doc(target.split("?")[0]).update({
        cards : all
      }).then(() => {
        this.setState({ wordRenew: true })
        
        if (all.length <= this.state.lastValue && this.state.lastValue>0) {
          this.setState({ lastValue: this.state.lastValue-8})
        }
      })
    }).catch(function (error) {
      console.log("Error getting document:", error);
    })
  }

  
  renderCards(data, i) {
    console.log(data)

    let synonyms = ""
    if (typeof (data.synonyms) === "object") {
      for (let i = 0; i < data.synonyms.length; i++){
        if (i === 0) {
          synonyms += data.synonyms[i]
        } else {
          synonyms += " ," + data.synonyms[i]
       }
      }
    } else {
      synonyms = data.synonyms
    }

    let antonym = ""
    if (typeof (data.antonym) === "object") {
      for (let i = 0; i < data.antonym.length; i++) {
        if (i === 0) {
          antonym += data.antonym[i]
        } else {
          antonym += " ," + data.antonym[i]
        }
      }
    } else {
      antonym = data.antonym
    }

    
    return (
      <div key={i}>
        <div id="wordBlock" onClick={(e) => { this.popWord(e) }} className={i}>
          <div onClick={(e) => { this.popWord(e) }} className={i} >{data.word}</div>
          {/* <div className={i} onClick={(e) => { this.deleteWord(e) }}>Delete</div> */}
          <img src="https://i.imgur.com/OT847Iy.png" id="trashCan" className={i} onClick={(e) => { this.deleteWord(e) }}></img>
      </div>
        <div id="popWordDetail" className={i} style={{ display: this.state.wordDetail && parseInt(this.state.nowWord) === i ? "block" : "none" }}>
          <div className="popWordDetailTitle">Meaning</div>
          <div className="popWordDetailContent">{data.meaning}</div>
          <div className="popWordDetailTitle">Synonyms</div>  
          <div className="popWordDetailContent">{data.synonyms.length > 0 ? synonyms : "No synonyms"}</div>
          <div className="popWordDetailTitle">Antonym</div>
          <div className="popWordDetailContent">{data.antonym.length > 0 ? antonym :"No antonym"}</div>
        </div>
        
      </div>
      
    )
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



  saveBook(e) {
    if (this.props.userData.length > 0) {
      /* console.log(e.target.className.split(' ')[0])
      console.log(this.props.userData[0].uid) */

      db.collection("users").doc(this.props.userData[0].uid).update({
        "savedBook": firebase.firestore.FieldValue.arrayUnion(e.target.className.split(' ')[0])
      })
        .then(function () {
          console.log("Document successfully updated!");
        });

    }
  }

  clickStars(e) {
    let score = parseInt(e.target.className.split(" ")[1])
    let bookid = e.target.className.split(" ")[0]
    let prevScore = []
    let avgScore = 0
    let uid = this.props.userData[0].uid

    //change score

    db.collection("books").doc(bookid).get().then((doc) => {
      let data = []
      if (typeof (doc.data().evaluation) === "number") {
        data.push(doc.data().evaluation)
        /* console.log(data) */
        data.push(score)
      } else if (typeof (doc.data().evaluation) === "string" || typeof (doc.data().evaluation) === "object") {
        data = doc.data().evaluation
        /* console.log(data) */
        data.push(score)
      } else {
        /* console.log(typeof (doc.data().evaluation)) */
        data.push(score)
      }
      db.collection("books").doc(bookid).update({
        "evaluation": data
      })
        .then(function () {
          console.log("Document successfully updated!");
          //change avg
          db.collection("books").doc(bookid).get().then((doc) => {
            /* console.log("document data:", doc.data()); */
            prevScore = doc.data().evaluation
            /* console.log(prevScore) */
            for (let i = 0; i < prevScore.length; i++) {
              /* console.log(prevScore[i]) */
              avgScore += prevScore[i]
            }
            avgScore = avgScore / prevScore.length
            /* console.log(avgScore) */
            db.collection("books").doc(bookid).update({
              "averageEvaluation": avgScore
            }).then(() => {
              /* console.log(avgScore) */
            })
          }).catch(function (error) {
            console.log("Error getting cached document:", error);
          });
        })
        .catch((err) => console.log(err))

    }).catch((err) => console.log(err))


    //store to user


    db.collection("users").doc(uid).update({
      "userExp.likeBook": firebase.firestore.FieldValue.arrayUnion(bookid)
    }).then(() => {
      /* console.log(uid) */
    }).catch((err) => { console.log(err) })



    //change color
    for (let i = 0; i < score; i++) {
      let arr = this.state.starCheck
      arr[i] = true
      this.setState({ starCheck: arr })
    }
  }

  renderPage() {

    let All = []
    for (let i = 0; i < this.state.page; i++){
      All.push(this.renderPageDetail(i))
    }
    return (
      <div className="pageLeaf">
        {All}
      </div>
    )
  }

  changePage(i) {
    console.log(i)
    let num = parseInt(i) * 8
    console.log(num)
    this.setState({ lastValue: num })
    this.setState({wordRenew:true})
  }

  renderPageDetail(i) {
    return (
      <div className="page" key={i} onClick={() => { this.changePage(i) }}>
        {i+1}
      </div>
    )
  }



  render() {

     /* let url = window.location.href */

    
    let url = "https://kiwords-c058b.web.app/details/159592106485385aFFbQvKxZmidyhpfaKGrl2uPL2?SAT%202500"
    let target = ""
    for (let i = 0; i < url.split("/").length; i++) {
      target = url.split("/")[i]
    }

    let uid = ""
    if (this.props.userData.length > 0) {
      uid = this.props.userData[0].uid
    } else {
      uid = 0
    }
    let rootURL = window.location.href.substr(0, window.location.href.indexOf("/", 9))

    return (
      <div className="bookDetailBody">
        {/* render 單字本 */}
        <div className="upperPart">
          <div className="bookDetailTitle">{decodeURI(target.split("?")[1])}</div>
          <div className="upperbtn">
          <div className="viewAllBookBtn" onClick={() => {
            window.location.href = (rootURL + '/wordbooks')
          }}>View other wordbooks</div>
            <div className="addWordsBtn" onClick={(event) => { event.stopPropagation(), window.location.href = ('https://kiwords-c058b.web.app/addwords?' + target.split("?")[0]) + "&" + decodeURI(target.split("?")[1]) }}>Add more words</div>
          </div>
        </div>
          
        <div className="wordSub" style={{ display: this.state.cards.length > 3 ? "block" : "none" }}>Words in this book</div>
          


        {/* render單字 */}
        {this.state.cards.length > 0 ? this.renderWords() :
          <div className="noWordsBlock">
            <div className="noWordsTitle">There's no words in this wordbook</div>
            <div className="noWordSubTitle">Try adding some words !</div>
            <div className="noWordsSubtitle" onClick={() => {
              window.location.href = ('https://kiwords-c058b.web.app/addwords?' + target.split("?")[0]) + "&" + decodeURI(target.split("?")[1])
            }}>Add words</div>
          </div>
        }
        {/* render頁碼 */}
        {this.renderPage()}
        
        <div className="bottomPart" style={{ display: this.state.cards.length>3 ? "flex":"none"}}>
          <div className="takeQuizTitle">Familiar with all these words ? </div>
          <div className="takeQuizBtn" onClick={(event) => { event.stopPropagation(), window.location.href = ('https://kiwords-c058b.web.app/quiz?' + target.split("?")[0]) + "&" + decodeURI(target.split("?")[1]) }}>Take a quiz</div>
        </div>
      </div>
    )
  }
}




export default Dtail