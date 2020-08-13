import React from "react";
import { db } from "../utility/firebaseConfig"
import '../style/BookDetail.scss';
import Loading from './Loading.js';


class BookDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      allCards:[],
      cards: "",
      wordDetail: false,
      nowWord: "",
      wordRenew: false,
      page: 0,
      lastValue: 0
    };
    this.renderWords = this.renderWords.bind(this)
    this.renderCards = this.renderCards.bind(this)
    this.popWord = this.popWord.bind(this)
    this.renderPage = this.renderPage.bind(this)
    this.renderPageDetail = this.renderPageDetail.bind(this)
    this.changePage = this.changePage.bind(this)
    this.convertWordString = this.convertWordString.bind(this)
    this.renewWordList = this.renewWordList.bind(this)
  }

  componentDidMount() {
    let url = /* "https://kiwords-c058b.web.app/details/159592106485385aFFbQvKxZmidyhpfaKGrl2uPL2?SAT%202500" */window.location.href

    let bookID
    let bookName
    for (let i = 0; i < url.split("/").length; i++) {
      let target = url.split("/")[i]
      bookID = target.split("?")[0]
      bookName = decodeURI(target.split("?")[1])
    }

    let cards = []
    let verifyCount = 0

    if (bookID.length > 0) {
      db.collection("books")
        .doc(bookID)
        .get()
        .then((doc) => {
          if (doc.exists) {
            this.setState({ allCards: doc.data().cards })
            this.setState({ bookOwner: doc.data().created })
          } else {
            console.log("No such document!");
          }
        })
        .then(() => {
          if (this.state.allCards.length > 0) {
            //get page number
            if (this.state.allCards.length % 8 === 0) {
              this.setState({ page: Math.floor(this.state.allCards.length / 8) })
            } else {
              this.setState({ page: Math.floor(this.state.allCards.length / 8) + 1 })
            }
            //get first page words
            let lastNum
            if (8 > this.state.allCards.length) {
              lastNum = this.state.allCards.length % 8
            } else {
              lastNum = 8
            }
            for (let i = 0; i < lastNum; i++) {
              cards.push(this.renderCards(this.state.allCards[i], i))
              verifyCount++
            }
            if (verifyCount = this.state.allCards.length) {
              this.setState({ cards: cards })
            }
          } else {
            this.setState({ cards: [] })
            console.log("No cards :(")
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        })
    }
  }

  componentDidUpdate() {

    let verifyCount = 0
    let isContentChange = this.state.cards.length >= 1 && this.state.wordRenew
    if (isContentChange) {
      let cards = []
      let lastNum
      let isLastPage = this.state.lastValue + 8 > this.state.allCards.length
      let isNoWords = this.state.lastValue < 1 && this.state.allCards.length < 1
    

      if (this.state.allCards.length % 8 === 0) {
        this.setState({ page: Math.floor(this.state.allCards.length / 8) })
      } else {
        this.setState({ page: Math.floor(this.state.allCards.length / 8) + 1 })
      }

      if (isLastPage && this.state.allCards.length > 0) {
        lastNum = this.state.lastValue + this.state.allCards.length % 8
      } else if (isLastPage && isNoWords) {
        cards = []
        this.setState({ cards: cards })
        this.setState({ wordRenew: false })
        } else {
        lastNum = this.state.lastValue + 8
      }
      
      for (let i = this.state.lastValue; i < lastNum; i++) {
        cards.push(this.renderCards(this.state.allCards[i], i))
        verifyCount++
      }
      if (verifyCount = this.state.allCards.length) {
        this.setState({ cards: cards })
        this.setState({ bookOwner: this.state.bookOwner })
        this.setState({ wordRenew: false })
      }
    }
  }

  renderCards(data, i) {

    let synonyms = this.convertWordString(data.synonyms)
    let antonym = this.convertWordString(data.antonym)
    let isNowWord = parseInt(this.state.nowWord) === i

    return (

      <div key={i}>
        
        <div id="wordBlock"
          onClick={(e) => {
            this.popWord(e)
          }} className={i}>
          <div className={i}>{data.word}
          </div>
          <img src="images/trash.png" id="trashCan" className={i}
            onClick={(e) => {
              this.deleteWord(e)
            }}>
          </img>
        </div>

        <div id="popWordDetail" className={i}
          style={{
            display: this.state.wordDetail && isNowWord ? "block" : "none"
          }}>
          <div className="popWordDetailTitle">Meaning
          </div>
          <div className="popWordDetailContent">
            {data.meaning}
          </div>
          <div className="popWordDetailTitle">Synonyms
          </div>
          <div className="popWordDetailContent">
            {data.synonyms.length > 0 ? synonyms : "No synonyms"}
          </div>
          <div className="popWordDetailTitle">Antonym
          </div>
          <div className="popWordDetailContent">
            {data.antonym.length > 0 ? antonym : "No antonym"}</div>
        </div>

      </div>
    )
  }

  convertWordString = (str) => {
    let result = ""
    if (typeof (str) === "object") {
      for (let i = 0; i < str.length; i++) {
        if (i === 0) {
          result += str[i]
        } else {
          result += " ," + str[i]
        }
      }
    } else {
      result = str
    }
    return result
  }

  renderWords() {
    return (
      <div className="wordCardBox">
        {this.state.cards}
      </div>
    )
  }

  popWord(e) {
    e.stopPropagation()
    this.setState({ wordDetail: !this.state.wordDetail })
    this.setState({ nowWord: e.target.className })
    this.setState({wordRenew: true})
  }

  deleteWord(e) {

    let all = []
    let className = e.target.className
    e.stopPropagation()

    for (let i = 0; i < this.state.allCards.length; i++) {
      if (parseInt(className) === i) {
      } else {
        all.push(this.state.allCards[i])
      }
    }
    this.renewWordList(all)
  }

  renewWordList(data) {

    let url = /* "https://kiwords-c058b.web.app/details/159592106485385aFFbQvKxZmidyhpfaKGrl2uPL2?SAT%202500" */ window.location.href
    let bookID

    for (let i = 0; i < url.split("/").length; i++) {
      let target = url.split("/")[i]
      bookID = target.split("?")[0]
    }
    db.collection("books").doc(bookID)
      .update({
      cards: data
      })
      .then(() => {
        if (data.length <= this.state.lastValue && this.state.lastValue > 0) {
          this.setState({ lastValue: this.state.lastValue - 8 })
        } 
      })
      .then(() => {
        this.setState({ allCards: data })
        this.setState({ wordRenew: true })
      })
      .catch((err) => {
        console.log(err)
      })
  }


  renderPage() {
    let All = []
    for (let i = 0; i < this.state.page; i++) {
      All.push(this.renderPageDetail(i))
    }
    return (
      <div className="pageLeaf">
        {All}
      </div>
    )
  }

  renderPageDetail(i) {
    return (
      <div className="page" key={i} onClick={() => { this.changePage(i) }}>
        {i + 1}
      </div>
    )
  }

  changePage(i) {
    let num = parseInt(i) * 8
    this.setState({ lastValue: num })
    this.setState({ wordRenew: true })
  }

  



  render() {

    let rootURL = window.location.href.substr(0, window.location.href.indexOf("/", 9))
    let url = /* "https://kiwords-c058b.web.app/details/159592106485385aFFbQvKxZmidyhpfaKGrl2uPL2?SAT%202500"  */window.location.href
    let bookID
    let bookName

    for (let i = 0; i < url.split("/").length; i++) {
      let target = url.split("/")[i]
      bookID = target.split("?")[0]
      bookName = decodeURI(target.split("?")[1])
    }

    return (
      <div className="bookDetailBody">
        
        <div className="upperPart">
          <div className="bookDetailTitle">
            {bookName}
          </div>
          <div className="upperbtn">
            <div className="viewAllBookBtn"
              onClick={() => {
                window.location.href = (rootURL + '/wordbooks')
              }}>View other wordbooks
            </div>
            <div className="addWordsBtn"
              onClick={(event) => {
                event.stopPropagation(),
                window.location.href = ('https://kiwords-c058b.web.app/addwords?' + bookID + "&" + bookName)
              }}>Add more words
            </div>
          </div>
        </div>

        <div className="wordSub"
          style={{
            display: this.state.cards.length > 3 ? "block" : "none"
          }}>Words in this book
        </div>

        {
          this.state.cards.length > 0 ?
          <div className="wordCardBox">
              {this.state.cards}
          </div>
           : 
          <div>
              {
                typeof (this.state.cards) === "object" ? 
                  <div className="noWordsBlock">
                    <div className="noWordsTitle">There's no words in this wordbook
                    </div>
                    <div className="noWordSubTitle">Try adding some words ! Add words with more then 2 synonyms and antonyms to unlock quiz function.
                    </div>
                    <div className="noWordBtn"
                      onClick={() => {
                        window.location.href = ('https://kiwords-c058b.web.app/addwords?' + bookID + "&" + bookName)
                      }}>Add words
                    </div>
                  </div>
                  :
                  <div className="noWordsBlock">
                    <Loading loadingMini={false} />
                  </div>
              }
          </div>
        }

        {this.renderPage()}

        <div className="bottomPart"
          style={{
            display: this.state.cards.length > 1 ? "flex" : "none"
          }}>
          <div className="takeQuizTitle">Familiar with all these words ?
          </div>
          <div className="takeQuizBtn"
            onClick={(event) => {
              event.stopPropagation(),
              window.location.href = ('https://kiwords-c058b.web.app/quiz?' + bookID + "&" + bookName)
            }}>Take a quiz
          </div>
        </div>

        <div className="bottomBlank">
        </div>

      </div>
    )
  }
}




export default BookDetail