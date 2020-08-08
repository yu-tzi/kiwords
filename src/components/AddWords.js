import React from "react";
import { db, firebase } from "../utility/firebaseConfig"
import '../style/AddWords.scss';

class AddWords extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      nowBook: "",
      renderBookOpt: false,
      nowBookText: ""
    };
    
    this.renderBookID = this.renderBookID.bind(this)
    this.showBookID = this.showBookID.bind(this)
    this.getBookID = this.getBookID.bind(this)
  }

  componentDidMount() {
    if (window.location.href.split("?")[1] !== undefined) {
      let bookID = window.location.href.split("?")[1].split("&")[0]
      let bookName = decodeURI(window.location.href.split("?")[1].split("&")[1])
      this.setState({ nowBookText: bookName })
      this.setState({ nowBook: bookID })
    }
  }

  renderBookID() {
    let showBook = this.props.showBook
    if (showBook.length > 0) {
      let all = []
      let count = 0
      for (let i = 0; i < showBook.length; i++) {
        all.push(this.showBookID(showBook[i],i))
        count++ 
      }
      if (count == showBook.length) {
        return (
          <div className="selectBlock"
            style={{
              display: this.state.renderBookOpt ? "block" : "none"
            }} >
            <select className="bookSelectOpt"
              onChange={(e) => {
                this.getBookID(e)
              }}>
              <option key={showBook.length + 1} value=" " >———— Choose One Wordbook ————
              </option>
              {all}
            </select>
            <div className="selectBlockSend" onClick={() => {
              this.setState({ renderBookOpt: false })
            }}>OK
            </div>
          </div>
        )
      }
    } 
  }

  showBookID(data,i) {
    return (
      <option key={i} value={data.bookID}>
        {data.bookName}
      </option>
    )
  }

  getBookID(e) {
    let showBook = this.props.showBook
    this.setState({ nowBook: e.target.value })
    let bookName 
    for (let i = 0; i < showBook.length; i++){
      if (e.target.value === showBook[i].bookID) {
        bookName = showBook[i].bookName
      }
    }
    this.setState({ nowBookText: bookName })
  }
  
  render() {
    return (
      <div className="addWordBlock">
        <div className="addCardBox">
          
          <div className="addBookSubTitle">Select a Word Book
          </div>
          {this.renderBookID()}
          <div className="nowBookBlock"
            onClick={() => {
              this.setState({ renderBookOpt: true })
            }}>
            {this.state.nowBook.replace(/\s+/g, "").length > 0 ?
              this.state.nowBookText
               :
              "Please select one of your wordbook"}
          </div>

          <div className="addBookSubTitle">Add words to the book
          </div>

          <WordBlock nowBook={this.state.nowBook} />

          <div className="viewCard"
            onClick={() => {
              window.location.href = ("https://kiwords-c058b.web.app/details/" + this.state.nowBook + "?" + this.state.nowBookText)
            }}>View Word Cards
          </div>

          <div className="cited">
            Dictionary Citing : <br></br>Merriam-Webster's Intermediate Thesaurus (1999). <br></br>Merriam-Webster Incorporated.
          </div>

        </div>
      </div>
    )
  }
}

class WordBlock extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchWord: "", 
      relatedWord: [],
      word: "",
      meaning: "",
      synonyms: "",
      antonym: "",
      menuPop: false,
      docSend: false,
      newWord: 1,
      menuPopIndex: ""
    }
    this.wordsBlock = this.wordsBlock.bind(this)
    this.newWordsBlock = this.newWordsBlock.bind(this)
    this.renderSearch = this.renderSearch.bind(this)
    this.changeCardInput = this.changeCardInput.bind(this)
    this.addNewWords = this.addNewWords.bind(this)
    this.submitCard = this.submitCard.bind(this)
    this.searchSend = this.searchSend.bind(this)
    this.searchDic = this.searchDic.bind(this)
    this.searchWordApi = this.searchWordApi.bind(this)
    this.createWordBlank = this.createWordBlank.bind(this)
    this.findValueViaKey = this.findValueViaKey.bind(this)
    this.cardInputFilled = this.cardInputFilled.bind(this)
    this.convertApiObj = this.convertApiObj.bind(this)
  }

  wordsBlock() {
    let All = []
    for (let i = 0; i < this.state.newWord; i++) {
      All.push(this.newWordsBlock(i))
    }
    return (
      <div>
        {All}
      </div>
    )
  }

  addNewWords() {
    this.setState(prevState => ({ newWord: prevState.newWord + 1 }))
  }

  findValueViaKey(state, keyvalue) {
    for (let j = 0; j < state.length; j++){
      if (state[j].hasOwnProperty(keyvalue)) {
        if (state[j][keyvalue]!==undefined) {
          return state[j][keyvalue]||""
        }
      }
    }
  }

  newWordsBlock(i) {
    let keyvalue = "key" + i.toString()

    return (
      <div key={i} className={"addWordBlocks" + " key" + i}>
        
        {this.renderSearch(i)}
        
        <div className="upper">
          <div className="word">
            <input type="text" placeholder="First ,let's enter any word !"
              className={i + " " + keyvalue}
              value={this.findValueViaKey(this.state.word, keyvalue)||""}
              onChange={(e) =>
                this.changeCardInput(e)
              }>
            </input>
            <div>WORD
            </div>
          </div>
          {this.createWordBlank("meaning", i, keyvalue, this.state.meaning)}
        </div>

        <div className="mid">
          {this.createWordBlank("synonyms", i, keyvalue, this.state.synonyms)}
          {this.createWordBlank("antonym", i, keyvalue, this.state.antonym)}
        </div>

      </div>
    )
  }

  createWordBlank(wording, i, keyvalue, state) {
    return (
      <div className={wording}>
        <textarea rows="3" cols="50" placeholder={wording}
          className={i + " " + keyvalue}
          value={this.findValueViaKey(state, keyvalue) || ""}
          onChange={(e) =>
            this.changeCardInput(e)
          }>
        </textarea>
        <div>{wording.toUpperCase()}
        </div>
      </div>
    )
  }

  cardInputFilled(state, key, wording, value) {
    let formerData = [...state]

    for (let i = 0; i < formerData.length; i++) {
      if (formerData[i].hasOwnProperty(key)) {
        formerData.splice(i, 1);
      }
    }
    let newobj = {}
    newobj[key] = value
    formerData.push(newobj)
    this.setState({ [wording]: formerData })
    this.setState({ menuPop: false })
  }

  changeCardInput(e) {
    let key = e.target.className.split(" ")[1]
    if (e.target.parentElement.className === "word") {
      this.setState({ menuPopIndex: key })
      this.cardInputFilled(this.state.word, key, "word", e.target.value)
      this.searchSend(e)
    } else if (e.target.parentElement.className === "meaning") {
      this.cardInputFilled(this.state.meaning, key, "meaning", e.target.value)
    } else if (e.target.parentElement.className === "synonyms") {
      this.cardInputFilled(this.state.synonyms, key, "synonyms", e.target.value)
    } else if (e.target.parentElement.className === "antonym") {
      this.cardInputFilled(this.state.antonym, key, "antonym", e.target.value)
    }
  }

  searchSend(e) {
    this.setState({ searchWord: e.target.value })
    this.searchDic()
    this.setState({ menuPop: true })
  }

  searchDic() {
    event.preventDefault()
    if (this.state.searchWord.replace(/\s+/g, "").length > 0) {
      let URL = "https://api.datamuse.com/sug?s=" + this.state.searchWord + "&max=5"
      fetch(URL)
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({ relatedWord: result })
          },
          (error) => {
            console.log(error)
          })
    }
  }

  renderSearch(index) {
    let all = []
    let isCurrentWordBox = this.state.menuPop && this.state.menuPopIndex === "key" + index
    for (let i = 0; i < this.state.relatedWord.length; i++) {
      all.push(
        <li key={i}
          style={{
            display: isCurrentWordBox ? "block" : "none"
          }}
          onClick={(e) => {
            this.searchWordApi(e, index)
          }}>{this.state.relatedWord[i].word}
        </li>
      )
    }
    return (
      <ul className="searchPopMenu">
        <li className="popMenuX"
          style={{
            display: isCurrentWordBox ? "block" : "none"
          }}
          onClick={() => {
            this.setState({ menuPop: false })
          }}>✕
        </li>
        {all}
      </ul>
    )
  }

  convertApiObj(state, key, wording, result) {
    let value = []
    if (result.length > 1) {
      for (let i = 0; i < result[0].length; i++) {
        if (i < 1) {
          value += result[0][i]
        } else {
          value += (" , " + result[0][i])
        }
      }
    } else {
      if (result[0] === undefined) {
        value = ""
      } else {
        value = result[0]
      }
    }
    this.cardInputFilled(state, key, wording, value)
  }

  searchWordApi(e, index) {
    let word = e.target.textContent
    this.setState({ searchWord: "" })
    fetch("https://dictionaryapi.com/api/v3/references/ithesaurus/json/" + word + "?key=68dac210-bb56-4bfb-bc92-b86dfcbda9d6")
      .then(res => res.json())
      .then(
        (result) => {
          let def = []
          let newKey = index
          newKey = "key" + newKey.toString()

          if (result[0].meta === undefined) {
            let word = ""
            for (let i = 0; i < result.length; i++) {
              if (i < 1) {
                word += result[i]
              } else {
                word += ("," + result[i])
              }
            }
            alert('Cannot find matched result, try again with these keywords ? \n' + word)
          } else {
            if (result[0].shortdef.length > 0) {
              for (let i = 0; i < result[0].shortdef.length; i++) {
                if (i < 1) {
                  def += result[0].shortdef[i]
                } else {
                  def += (" , " + result[0].shortdef[i])
                }
              }
            }
            this.convertApiObj(this.state.synonyms, newKey, "synonyms", result[0].meta.syns)
            this.convertApiObj(this.state.antonym, newKey, "antonym", result[0].meta.ants)
            this.cardInputFilled(this.state.word, newKey, "word", word)
            this.cardInputFilled(this.state.meaning, newKey, "meaning", def)
          }
        },
        (error) => {
          console.log(error)
        })
  }

  submitCard() {
    event.preventDefault()
    let load = 0
    if (this.state.word.length < 1) {
      alert('Please make sure you fill in every word blank.')
    }
    for (let i = 0; i < this.state.word.length; i++) {
      if (this.state.word[i].length < 1) {
        alert('Please make sure you fill the blank.')
      }
      let cards =
      {
        word: Object.values(this.state.word[i])[0],
        meaning: Object.values(this.state.meaning[i])[0],
        synonyms: Object.values(this.state.synonyms[i])[0],
        antonym: Object.values(this.state.antonym[i])[0]
      }
  
      db.collection("books").doc(this.props.nowBook).update({
        cards: firebase.firestore.FieldValue.arrayUnion(cards)
      })
        .then(() => {
          this.setState({ docSend: true })
          if (load = this.state.word.length + 1) {
            setTimeout(() => {
              this.setState({ word: "" })
              this.setState({ meaning: "" })
              this.setState({ synonyms: "" })
              this.setState({ antonym: "" })
              this.setState({ newWord: 1 })
              this.setState({ docSend: false })
            }, 2000);
          }
        })
        .catch((error)=>{
          console.error("Error updating document: ", error);
        });
    }
  }

  render() {
    return (
      <div>
        
        {this.wordsBlock()}
        <div className="moreWordsBlock"
          onClick={this.addNewWords}>
          <div className="moreWords">✚　Add more word cards
          </div>
        </div>

        <form className="sendBox"
          onSubmit={(event) => {
            {
              this.props.nowBook.replace(/\s+/g, "").length > 0 ?
                this.submitCard(event)
                :
                alert('Please select one of your wordbook.'), event.preventDefault()
            }
          }}
          style={{
            backgroundColor: this.state.docSend ? "#77dddd" : "#e0ac49"
          }}>
          <input type="submit" className="sendCard"
            value={
              this.state.docSend ? "Word Added !" : "Save"
            }>
          </input>
        </form>

      </div>
    )
  }
}

export default AddWords