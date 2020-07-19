import React from "react";
import { db, firebase } from "./firebaseConfig"
import './style/addWords.scss';


class AddWords extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchWord: "",
      relatedWord: [],
      word:"",
      meaning: "",
      synonyms: "",
      antonym: "",
      nowBook : ""
    };
    this.searchSend = this.searchSend.bind(this)
    this.searchDic = this.searchDic.bind(this)
    this.sendWord = this.sendWord.bind(this)
    this.renderSearch = this.renderSearch.bind(this)
    this.renderCard = this.renderCard.bind(this)
    this.submitCard = this.submitCard.bind(this)
    this.changeCardInput = this.changeCardInput.bind(this)
    this.renderBookID = this.renderBookID.bind(this)
    this.showBookID = this.showBookID.bind(this)
    this.getBookID = this.getBookID.bind(this)
  }

  searchSend(e) {
    this.setState({ searchWord: e.target.value })
    this.searchDic()
  }

  searchDic() {
    event.preventDefault()
    console.log(this.state.searchWord)
    if (this.state.searchWord.replace(/\s+/g, "").length > 0) {
      let URL = "https://api.datamuse.com/sug?s=" + this.state.searchWord + "&max=5"

      fetch(URL)
        .then(res => res.json())
        .then(
          (result) => {
            console.log('API called')
            this.setState({ relatedWord: result })
          },
          (error) => {
            console.log(error)
          })
    }
  }

  sendWord(e) {
    let word = e.target.textContent
    console.log(e.target.textContent)
    //meaning
    fetch("https://dictionaryapi.com/api/v3/references/ithesaurus/json/" + e.target.textContent + "?key=68dac210-bb56-4bfb-bc92-b86dfcbda9d6")
      .then(res => res.json())
      .then(
        (result) => {
          let def = []
          let syn = []
          let ant = []
          let syns = []
          
          console.log('API called')
          console.log(result)
          if (result[0].meta === undefined) {
            let word = ""
            for (let i = 0; i < result.length; i++) {
              if (i < 1) {
                word += result[i]
              } else {
                word += ("," + result[i])
              }
            }
            alert('查無此字，請再試一次，試試看這些相近的字吧：\n'+word)
          } else {
            //def
            console.log(result[0].shortdef)
            if (result[0].shortdef.length > 0) {
              for (let i = 0; i < result[0].shortdef.length; i++){
                if (i < 1) {
                  def += result[0].shortdef[i]
                } else {
                  def += (" , " + result[0].shortdef[i])
                }
              }
            }
            //syn
            if (result[0].meta.syns.length > 1) {
              console.log(result[0].meta.syns[0])
              for (let i = 0; i < result[0].meta.syns[0].length; i++) {
                  if (i < 1) {
                    syns += result[0].meta.syns[0][i]
                  } else {
                    syns += (" , " + result[0].meta.syns[0][i])
                  }
                }
              
            } else {
              console.log(result[0].meta.syns)
              if (result[0].meta.syns[0] === undefined) {
                syns = ""
                console.log("result[0].meta.syns[0] === undefined")
              } else {
                syns = result[0].meta.syns[0]
              }
            }
            //ant
            if (result[0].meta.ants.length > 1) {
              console.log(result[0].meta.ants[0])
              for (let i = 0; i < result[0].meta.ants[0].length; i++) {
                if (i < 1) {
                  ant += result[0].meta.ants[0][i]
                } else {
                  ant += (" , " + result[0].meta.ants[0][i])
                }
              }
            } else {
              console.log(result[0].meta.ants)
              if (result[0].meta.ants[0] === undefined) {
                console.log("result[0].meta.ants[0] === undefined")
                ant = ""
              } else {
                ant = result[0].meta.ants[0]
              }
             
            }
          }

          this.setState({ word: word })
          this.setState({ meaning: def })
          this.setState({ synonyms: syns })
          this.setState({ antonym: ant })
          

        },
        (error) => {
          console.log(error)
        })

  }

  renderSearch() {
    let all = []
    for (let i = 0; i < this.state.relatedWord.length; i++) {
      all.push(<li key={i} onClick={(e) => {this.sendWord(e)}}>{this.state.relatedWord[i].word}</li>)
    }
    return (
      <ul className="popMenu">
        {all}
      </ul>
      )
  }
  
  renderCard() {

    return (
      <div className="addCardBox">
        
        <div className="nowBookBlock">4000 Essential English Words</div>
        
        <form className="searchForm" action="" onSubmit={this.sendWord}><br></br>
          <input type="text" placeholder="Enter your search term ..." onChange={(e) => { this.searchSend(e) }}></input>
          <div className="explain">{"( "+ "or fill in the blank yourself"+" )"}</div>
          
          </form>

        {this.renderSearch()}
          
          <div className="word">
            <div>word</div>
            <input type="text" value={this.state.word || ""} onChange={(e) => this.changeCardInput(e)}></input>
          </div>

          <div className="meaning">
            <div>meaning</div>
          <textarea rows="3" cols="50" value={this.state.meaning || ""} onChange={(e) => this.changeCardInput(e)}></textarea>
          </div>

          <div className="synonyms">
            <div>synonyms</div>
          <textarea rows="3" cols="50" value={this.state.synonyms || ""} onChange={(e) => this.changeCardInput(e)}></textarea>
          </div>

          <div className="antonym">
            <div>antonym</div>
          <textarea rows="3" cols="50" value={this.state.antonym || ""} onChange={(e) => this.changeCardInput(e)}></textarea>
        </div>
        
        <form className="sendBox" onSubmit={(event) => { { this.state.nowBook.replace(/\s+/g, "").length > 0 ? this.submitCard(event) : alert('Please select one of your wordbook.') } }}>
          <input type="submit" className="sendCard" value={this.state.nowBook.replace(/\s+/g, "").length > 0 ? "SEND" : "Please select one of your wordbook"} ></input>
        </form>
        <div className="cited">Merriam-Webster's Intermediate Thesaurus (1999).<br></br> Merriam-Webster Incorporated.</div>


        </div>

    )

  }

  changeCardInput(e) {
    console.log(e.target.parentElement.className)
    if (e.target.parentElement.className === "word") {
      this.setState({ word: e.target.value })
    } else if (e.target.parentElement.className === "meaning") {
      this.setState({ meaning: e.target.value })
    } else if (e.target.parentElement.className === "synonyms") {
      this.setState({ synonyms: e.target.value })
    } else if (e.target.parentElement.className === "antonym") {
      this.setState({ antonym: e.target.value })

    }
  }

  submitCard() {
    event.preventDefault()
    console.log('submit')

    let confirm = false

    if (this.state.word.replace(/\s+/g, "").length < 1) {
      alert('請填寫內容')
    } else {
      confirm = true
      if (this.state.meaning.length > 1 && this.state.synonyms.length > 1 && this.state.antonym.length > 1) {
        
        if (this.state.meaning.toString().replace(/\s+/g, "").length < 1 || this.state.synonyms.toString().replace(/\s+/g, "").length < 1 || this.state.antonym.toString().replace(/\s+/g, "").length < 1) {

          if (!window.confirm("資料不完全，可能影響測驗成效，繼續送出嗎？")) {
            console.log('跳出')
            confirm = false
          }
        }
      } else if (this.state.meaning.length < 1 || this.state.synonyms.length < 1 || this.state.antonym.length < 1) {
        if (!window.confirm("資料不完全，可能影響測驗成效，繼續送出嗎？")) {
          console.log('跳出')
          confirm = false
        }
      }

      if (confirm === true) {
        let cards =
        {
          word: this.state.word,
          meaning: this.state.meaning,
          synonyms: this.state.synonyms,
          antonym: this.state.antonym
        }
    
        db.collection("books").doc(this.state.nowBook).update({
          cards: firebase.firestore.FieldValue.arrayUnion(cards)
        })
          .then(function () {
            console.log("Document successfully updated!");
          })
          .catch(function (error) {
            console.error("Error updating document: ", error);
          });
      }
    }
  }

  renderBookID() {
    if (this.props.showBook.length > 0) {

      let all = []
      let count = 0
      let j = 1
      for (let i = 0; i < this.props.showBook.length; i++) {
        all.push(this.showBookID(this.props.showBook[i],i))
        count++ 
        j++
      }
      
      if (count == this.props.showBook.length) {
        
        return (
          <select style={{display:"none"}} className="bookSelect" onChange={(e) => { this.getBookID(e) }}>
            <option key={this.props.showBook.length + 1} value=" " >———— 請選擇單字本 ————</option>
            {all}
          </select>
        )
      }
    } 
  }

  showBookID(data,i) {
    
    return (
      <option key={i} value={data.bookID} >{data.bookName}</option>
    )
  }

  getBookID(e) {
      this.setState({ nowBook: e.target.value })
  }
  

  render() {
    return (
      <div className="addWordBlock">
          {/* 下拉式選單 */}
        {this.renderBookID()}
        
        {this.renderCard()}
          {/* <form className="searchForm" action="" onSubmit={this.sendWord}>搜尋單字自動填入<br></br>
            <input type="text" placeholder="輸入你想查詢的單字" onChange={(e) => { this.searchSend(e) }}></input><br></br>
            或者直接輸入...
          </form>

            {this.renderSearch()} 
            
            {this.renderCard()}
      
          <form onSubmit={(event) => { { this.state.nowBook.replace(/\s+/g, "").length > 0 ? this.submitCard(event) : alert('請選擇單字本')} }}>
            <input type="submit" className="sendCard" value={this.state.nowBook.replace(/\s+/g, "").length > 0 ? "送出字卡" : "尚未選擇單字本"} ></input>
          </form>
          <div className="cited">Merriam-Webster's Intermediate Thesaurus (1999).<br></br> Merriam-Webster Incorporated.</div>*/}
          
      </div>
    )
  }
}


export default AddWords