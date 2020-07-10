import React from "react";

class AddWords extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchWord: "",
      relatedWord: []
    };
    this.searchSend = this.searchSend.bind(this)
    this.searchDic = this.searchDic.bind(this)
    this.sendWord = this.sendWord.bind(this)
    this.renderSearch = this.renderSearch.bind(this)
    this.renderCard = this.renderCard.bind(this)
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
    console.log(e.target.textContent)
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
   /*  if (this.state.relatedWord.length>0?) */
    return (
      <div className="cardBox">
        <div className="cardContainer">
          <div className="word">
            <div>word</div>
            <input type="text"></input>
          </div>
          <div className="meaning">
            <div>meaning</div>
            <input type="text"></input>
          </div>
          <div className="sentence">
            <div>sentence</div>
            <input type="text"></input>
          </div>
          <div className="synonyms">
            <div>synonyms</div>
            <input type="text"></input>
          </div>
          <div className="antonym">
            <div>antonym</div>
            <input type="text"></input>
          </div>
        </div>
      </div>
      
    )
  }
  

  render() {
    return (
      <div>
        <form action="" onSubmit={this.sendWord}>搜尋單字
          <input type="text" onChange={(e) => { this.searchSend(e) }}></input>
          {/* 提示選單 */}
          {this.renderSearch()}
          {/* 單字欄位 */}
          {this.renderCard()}
          <input type="submit"></input>
        </form>
      </div>
    )
  }
}


export default AddWords