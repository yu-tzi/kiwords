import React from "react";
import { db, firebase } from "./firebaseConfig"



class Dtail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      bookOwner: "",
      starCheck: [false, false, false, false, false]
    };
    this.renderWords = this.renderWords.bind(this)
    this.renderCards = this.renderCards.bind(this)
    this.clickStars = this.clickStars.bind(this)
    this.saveBook = this.saveBook.bind(this)
    this.renderStar = this.renderStar.bind(this)
  }



  componentDidUpdate() {

   let url = window.location.href

    /* let url = "https://kiwords-c058b.web.app/details/1594285544251vevyGeH2tHhy61LPAwNv59AkiZm2" */
    let target = ""
    for (let i = 0; i < url.split("/").length; i++) {
      target = url.split("/")[i]
    }
    
    let count = 0
    if (target.length > 0 && this.state.cards.length<1) {
      let cards = []
      db.collection("books").doc(target).get().then((doc) => {
        if (doc.exists) {
          /* console.log("Document data:", doc.data().cards); */
          for (let i = 0; i < doc.data().cards.length; i++) {
            cards.push(this.renderCards(doc.data().cards[i], i))
            count++
          }
          if (count = doc.data().cards.length) {
            console.log(cards)
            this.setState({ cards: cards })
            this.setState({ bookOwner: doc.data().created})
          }
        } else {
          console.log("No such document!");
        }
      }).catch(function (error) {
        console.log("Error getting document:", error);
      });

    }


  }



  renderWords() {
      return (
        <div>
        {this.state.cards}
        </div>
      )
  }


  
  renderCards(data, i) {
    let newStr = ""
    if (data.meaning.length > 65) {
      newStr = data.meaning.slice(0, 60) + "..." 
    } else {
      newStr = data.meaning
    }
    return (
      <div key={i}>{data.word + " : " + newStr }</div>
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
        console.log(data)
        data.push(score)
      } else if (typeof (doc.data().evaluation) === "string" || typeof (doc.data().evaluation) === "object") {
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

    }).catch((err) => console.log(err))


    //store to user


    db.collection("users").doc(uid).update({
      "userExp.likeBook": firebase.firestore.FieldValue.arrayUnion(bookid)
    }).then(() => {
      console.log(uid)
    }).catch((err) => { console.log(err) })



    //change color
    for (let i = 0; i < score; i++) {
      let arr = this.state.starCheck
      arr[i] = true
      this.setState({ starCheck: arr })
    }
  }



  render() {
     let url = window.location.href

    /* let url = "https://kiwords-c058b.web.app/details/1594285544251vevyGeH2tHhy61LPAwNv59AkiZm2" */
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

    return (
      <div>
        {/* render單字 */}
        {this.renderWords()}
        {/* 評分按鈕 */}
        <div style={{ display: this.state.bookOwner === uid ? "none" : "block" }}>
          <div className={target + " 1"} onClick={(e) => this.clickStars(e)} style={{ color: this.state.starCheck[0] ? "yellow" : "grey" }}>★</div>
          <div className={target + " 2"} onClick={(e) => this.clickStars(e)} style={{ color: this.state.starCheck[1] ? "yellow" : "grey" }}>★</div>
          <div className={target + " 3"} onClick={(e) => this.clickStars(e)} style={{ color: this.state.starCheck[2] ? "yellow" : "grey" }}>★</div>
          <div className={target + " 4"} onClick={(e) => this.clickStars(e)} style={{ color: this.state.starCheck[3] ? "yellow" : "grey" }}>★</div>
          <div className={target + " 5"} onClick={(e) => this.clickStars(e)} style={{ color: this.state.starCheck[4] ? "yellow" : "grey" }}>★</div>
        </div> 
        {/* 收藏按鈕 */}
        <div className={target} onClick={(e) => this.saveBook(e)} style={{ display: this.state.bookOwner === uid ? "none" : "block" }} >收藏</div> 
      </div>
    )
  }
}




export default Dtail