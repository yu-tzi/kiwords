import React from "react";

class AddWords extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchWord:""
    };
    this.searchSend = this.searchSend.bind(this)
    this.searchDic = this.searchDic.bind(this)
    this.sendWord = this.sendWord.bind(this)
  }

  searchSend(e) {
    this.setState({ searchWord: e.target.value })
    /* this.searchDic() */
  }

  searchDic() {
    event.preventDefault()
    console.log(this.state.searchWord)
    let URL = "https://api.datamuse.com/sug?s=" + this.state.searchWord +"&max=7"
    fetch(URL)
      .then(res => res.json())
      .then(
        (result) => {
          console.log('API called')
          console.log(result)
        },
        (error) => {
          console.log(error)
        })
  }


  render() {
    return (
      <div>
        <form action="" onSubmit={this.sendWord}>搜尋單字
          <input type="text" onChange={(e)=>{this.searchSend(e)}}></input>
          <input type="submit"></input>
        </form>
      </div>
    )
  }
}

export default AddWords