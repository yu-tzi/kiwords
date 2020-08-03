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
      nowBook:  "",
      menuPop: true,
      renderBookOpt: false,
      nowBookText:  "",
      docSend: false,
      newWord: 1,
      menuPopIndex:""
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
    this.addNewWords = this.addNewWords.bind(this)
    this.newWordsBlock = this.newWordsBlock.bind(this)
    this.wordsBlock = this.wordsBlock.bind(this)
  }


  componentDidMount() {

    if (window.location.href.split("?")[1] !== undefined) {

      this.setState({ nowBookText: decodeURI(window.location.href.split("?")[1].split("&")[1]) })
      this.setState({ nowBook: window.location.href.split("?")[1].split("&")[0] })
         
      
    }
  }

  searchSend(e) {
    this.setState({ searchWord: e.target.value })
    this.searchDic()
    this.setState({ menuPop: true })
  }

  /* sample url https://kiwords-c058b.web.app/addwords?1594451117472uZKW3V1cCDUYWmitdYpwoNp764j1&Merriam-Webster%20Learner%27s%20Core%20Vocabulary */

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

  newWordsBlock(i) {
    let keyvalue = "key" + i.toString()

    let index 
    for (let i = 0; i < this.state.meaning.length; i++){
      if (this.state.meaning[i].hasOwnProperty(keyvalue)) {

        index = i
      }
    }
    
    return (
        <div key={i} className={"addWordBlocks"+" key"+i}>
          {this.renderSearch(i)}
        <div className="upper">
          <div className="word">
            <input type="text" className={index + " " + keyvalue} value={this.state.word[index]?.[keyvalue] || this.state.searchWord} onChange={(e) => this.changeCardInput(e)} placeholder="First ,let's enter any word !"></input>
            <div>WORD</div>
          </div>

          <div className="meaning">
            
            <textarea rows="3" className={index + " " + keyvalue} cols="50" value={this.state.meaning[index]?.[keyvalue] || ""} onChange={(e) => this.changeCardInput(e)} placeholder="Meaning"></textarea>
            <div>MEANING</div>
          </div>
        </div>

        <div className="mid">
          <div className="synonyms">
            {/* <div>synonyms</div> */}
            <textarea rows="3" className={index + " " + keyvalue} cols="50" value={this.state.synonyms[index]?.[keyvalue] || ""} onChange={(e) => this.changeCardInput(e)} placeholder="synonyms"></textarea>
            <div>SYNONYMS</div>
          </div>

          <div className="antonym">
            {/* <div>antonym</div> */}
            
            <textarea rows="3" className={index + " " + keyvalue} cols="50" value={this.state.antonym[index]?.[keyvalue] || ""} onChange={(e) => this.changeCardInput(e)} placeholder="antonym"></textarea>
            <div>ANTONYM</div>

          </div>
        </div>
      </div>
    )
  }

  addNewWords() {
    this.setState(prevState => ({ newWord: prevState.newWord + 1 }))
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

  sendWord(e,index) {
    let word = e.target.textContent
    this.setState({ searchWord: "" })

    console.log(e.target.textContent)
    //meaning
    fetch("https://dictionaryapi.com/api/v3/references/ithesaurus/json/" + e.target.textContent + "?key=68dac210-bb56-4bfb-bc92-b86dfcbda9d6")
      .then(res => res.json())
      .then(
        (result) => {
          let def = []
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
            
            if (result[0].shortdef.length > 0) {
              for (let i = 0; i < result[0].shortdef.length; i++){
                if (i < 1) {
                  def += result[0].shortdef[i]
                } else {
                  def += (" , " + result[0].shortdef[i])
                }
              }
            }
            console.log(def)
            //syn
            if (result[0].meta.syns.length > 1) {
              
              for (let i = 0; i < result[0].meta.syns[0].length; i++) {
                  if (i < 1) {
                    syns += result[0].meta.syns[0][i]
                  } else {
                    syns += (" , " + result[0].meta.syns[0][i])
                  }
                }
              
            } else {
              
              if (result[0].meta.syns[0] === undefined) {
                syns = ""
                console.log("result[0].meta.syns[0] === undefined")
              } else {
                syns = result[0].meta.syns[0]
              }
            }
            //ant
            if (result[0].meta.ants.length > 1) {
              
              for (let i = 0; i < result[0].meta.ants[0].length; i++) {
                if (i < 1) {
                  ant += result[0].meta.ants[0][i]
                } else {
                  ant += (" , " + result[0].meta.ants[0][i])
                }
              }
            } else {
              
              if (result[0].meta.ants[0] === undefined) {
                console.log("result[0].meta.ants[0] === undefined")
                ant = ""
              } else {
                ant = result[0].meta.ants[0]
              }
             
            }
          }

          console.log('index : ' + index)
          let newKey = index
          console.log(newKey.toString())
          newKey = "key" + newKey.toString()
          console.log(newKey)
  
          
          let wordJoind = [...this.state.word]
          for (let i = 0; i < wordJoind.length; i++) {
            if (wordJoind[i].hasOwnProperty(newKey)) {

              wordJoind.splice(i, 1);

            }
          }
          let wordobj = {}
          wordobj[newKey] = word
          wordJoind.push(wordobj)
          this.setState({ word: wordJoind })


          let defJoind = [...this.state.meaning]
          
          for (let i = 0; i < defJoind.length; i++){
            if (defJoind[i].hasOwnProperty(newKey)) {
              
              defJoind.splice(i, 1);
              
            }
          }
          let defobj = {}
          defobj[newKey] = def
          defJoind.push(defobj)
          

          this.setState({ meaning: defJoind })


          
          let synsJoind = [...this.state.synonyms]
          for (let i = 0; i < synsJoind.length; i++) {
            if (synsJoind[i].hasOwnProperty(newKey)) {
              
              synsJoind.splice(i, 1);
              
            }
          }
          let synsobj = {}
          synsobj[newKey] = syns
          synsJoind.push(synsobj)
          this.setState({ synonyms: synsJoind })



          
          let antJoind = [...this.state.antonym]
          for (let i = 0; i < antJoind.length; i++) {
            if (antJoind[i].hasOwnProperty(newKey)) {
              
              antJoind.splice(i, 1);
              
            }
          }
          let antobj = {}
          antobj[newKey] = ant
          antJoind.push(antobj)
          this.setState({ antonym: antJoind })


          this.setState({ menuPop:false})
          

        },
        (error) => {
          console.log(error)
        })

  }

  renderSearch(index) {
    let all = []
    console.log(this.state.menuPopIndex==="key"+index)
    for (let i = 0; i < this.state.relatedWord.length; i++) {
      all.push(<li key={i} style={{ display: this.state.menuPop && this.state.menuPopIndex === "key" + index ? "block":"none"}} onClick={(e) => {this.sendWord(e,index)}}>{this.state.relatedWord[i].word}</li>)
    }
    return (
      <ul className="searchPopMenu">
        {all}
      </ul>
      )
  }
  
  renderCard() {

    

    return (
      <div className="addCardBox">
         
        <div className="addBookSubTitle">Select a Word Book</div>
        
        {this.renderBookID()}
       
        
        <div className="nowBookBlock" onClick={() => { this.setState({ renderBookOpt: true }) }}>{this.state.nowBook.replace(/\s+/g, "").length > 0 ? this.state.nowBookText : "Please select one of your wordbook"} </div>

        <div className="addBookSubTitle">Add words to the book</div>
        {/*
      <div className="addWordBlocks">
        

        {this.renderSearch()}
          

          <div className="upper">
            <div className="word">
              
              <input type="text" value={this.state.word || ""} onChange={(e) => this.changeCardInput(e)} placeholder="Enter word"></input>
            </div> 

            <div className="meaning">
              
              <textarea rows="3" cols="50" value={this.state.meaning || ""} onChange={(e) => this.changeCardInput(e)} placeholder="Meaning"></textarea>
            </div>
          </div>

          <div className="mid">
            <div className="synonyms">
              
              <textarea rows="3" cols="50" value={this.state.synonyms || ""} onChange={(e) => this.changeCardInput(e)} placeholder="synonyms"></textarea>
            </div>

            <div className="antonym">
              
              <textarea rows="3" cols="50" value={this.state.antonym || ""} onChange={(e) => this.changeCardInput(e)} placeholder="antonym"></textarea>
            </div>
          </div>
        </div> */}
        {this.wordsBlock()}

        <div className="moreWordsBlock" onClick={this.addNewWords}>
          <div className="moreWords">✚　Add more word cards </div>
        </div>
        


        <form className="sendBox" onSubmit={(event) => { { this.state.nowBook.replace(/\s+/g, "").length > 0 ? this.submitCard(event) : alert('Please select one of your wordbook.'), event.preventDefault() } }} style={{ backgroundColor: this.state.docSend ? "#77dddd" : "#e0ac49" }}>
          <input type="submit" className="sendCard" value={this.state.docSend ? "Word Added !" : "Save"} ></input>
        </form>
        <div className="viewCard" onClick={() => { window.location.href = ("https://kiwords-c058b.web.app/details/" + this.state.nowBook + "?" + this.state.nowBookText) }}>View Word Cards</div>
        <div className="cited">Dictionary Citing : <br></br>Merriam-Webster's Intermediate Thesaurus (1999). <br></br>Merriam-Webster Incorporated.</div>


        </div>

    )

  }

  changeCardInput(e) {
    console.log(e.target.parentElement.className)
    if (e.target.parentElement.className === "word") {
      /* this.setState({ word: e.target.value }) */
      this.searchSend(e)
      let All = this.state.word
      console.log(e.target.className.split(" "))
      let index = e.target.className.split(" ")[0]
      let key = e.target.className.split(" ")[1]
      this.setState({ menuPopIndex: key })
      if (All[index] !== undefined) {
        All[index][key] = e.target.value
        console.log(All)
        this.setState({ word: All })
      }


    } else if (e.target.parentElement.className === "meaning") {
      let All = this.state.meaning
      console.log(e.target.className.split(" "))
      let index = e.target.className.split(" ")[0]
      let key = e.target.className.split(" ")[1]
      All[index][key] = e.target.value
      console.log(All)
      this.setState({ meaning: All })


    } else if (e.target.parentElement.className === "synonyms") {
      let All = this.state.synonyms
      console.log(e.target.className.split(" "))
      let index = e.target.className.split(" ")[0]
      let key = e.target.className.split(" ")[1]
      All[index][key] = e.target.value
      console.log(All)
      this.setState({ synonyms: All })


    } else if (e.target.parentElement.className === "antonym") {
      
      let All = this.state.antonym
      console.log(e.target.className.split(" "))
      let index = e.target.className.split(" ")[0]
      let key = e.target.className.split(" ")[1]
      All[index][key] = e.target.value
      console.log(All)
      this.setState({ antonym: All })

    }
  }

  submitCard() {
    event.preventDefault()
    console.log('submit')
    let load = 0

    if (this.state.word.length < 1) {
      alert('Please make sure you fill in every word blank.')
    }

    for (let i = 0; i < this.state.word.length; i++){
      

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
        console.log(cards);
        db.collection("books").doc(this.state.nowBook).update({
          cards: firebase.firestore.FieldValue.arrayUnion(cards)
        })
          .then(() => {
            
            console.log("Document successfully updated!");
            this.setState({ docSend: true })

            if (load = this.state.word.length + 1) {
              setTimeout(() => {
                this.setState({ word: "" })
                this.setState({ meaning: "" })
                this.setState({ synonyms: "" })
                this.setState({ antonym: "" })
                this.setState({ newWord: 1})
                this.setState({ docSend: false })
              }, 2000);
            }
          })
          .catch(function (error) {
            console.error("Error updating document: ", error);
          });
    }
    
    
    /* } */
  }

  renderBookID() {
    if (this.props.showBook.length > 0) {

      let all = []
      let count = 0
      let j = 1

      
      /* if (window.location.href.split("?").length > 1) {
        this.setState({ nowBook: window.location.href.split("?")[1] })
        for (let i = 0; i < this.props.showBook.length; i++) {
          console.log(this.props.showBook[i])
          if (this.props.showBook[i].bookID === window.location.href.split("?")[1]) {
            this.setState({ nowBookText: this.props.showBook[i].bookName })
          }
        }
      } */
        
      
      for (let i = 0; i < this.props.showBook.length; i++) {
        all.push(this.showBookID(this.props.showBook[i],i))
        count++ 
        j++
      }
      
      if (count == this.props.showBook.length) {
        /* style={{ display: this.state.renderBookOpt ? "block" : "block" }}  */
        
        return (
          <div className="selectBlock" style={{ display: this.state.renderBookOpt ? "block" : "none" }} >
            {/* <div className="selectBlockX" onClick={()=>{this.setState({renderBookOpt:false})}}>X</div> */}
          <select className="bookSelectOpt"  onChange={(e) => { this.getBookID(e) }}>
            <option key={this.props.showBook.length + 1} value=" " >———— Choose One Wordbook ————</option>
            {all}
            </select>
            <div className="selectBlockSend" onClick={() => { this.setState({ renderBookOpt: false }) }}>OK</div>
          </div>
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
    let bookName = ""
    for (let i = 0; i < this.props.showBook.length; i++){
      if (e.target.value === this.props.showBook[i].bookID) {
        bookName = this.props.showBook[i].bookName
      }
    }
    this.setState({ nowBookText: bookName})
  }
  

  render() {
    return (
      <div className="addWordBlock">
        {/* 下拉式選單 */}
        
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