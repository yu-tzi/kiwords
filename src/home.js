import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import './style/home.scss';

class Home extends React.Component {
  render() {
    return (
    <div>
        <div>Home</div>
        <Carousel/>
    </div>
    )
  }
}

let items = ["apple", "banannna", "cherry", "doge"]


class Carousel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      nowIndex: 0 
    }
    this.toleft = this.toleft.bind(this)
    this.toRight = this.toRight.bind(this)
  }

  toleft() {
    let newIndex = this.state.nowIndex
    if (newIndex +1 >= items.length) {
      newIndex = 0
      /* console.log("too big : " + this.state.nowIndex) */
      this.setState({ nowIndex: newIndex})
    } else if (newIndex + 1 < items.length) {
      this.setState({ nowIndex: newIndex + 1 });
      /* console.log("small enough : " + this.state.nowIndex) */
    }
 
  }

  toRight() {
    let newIndex = this.state.nowIndex
    if (newIndex - 1 < 0) {
      newIndex = items.length - 1
      /* console.log("too small : " + this.state.nowIndex) */
      this.setState({ nowIndex: newIndex })
    } else if (newIndex - 1 >= 0) {
      this.setState({ nowIndex: newIndex - 1 });//把數字的調整放到這裡？
      /* console.log("big enough: " + this.state.nowIndex) */
    }

  }


  itemRender() {
    console.log('item reminader')
    let cards = []
    let index
    for (let i = this.state.nowIndex; i < this.state.nowIndex + items.length; i++){
      if (i >= items.length) {
        index = i - items.length
      } else {
        index = i
      }
      console.log("index : "+ index)//然而 render 出來的還是 4 個
      cards.push(<div key={index} className={"card card" + index}>
        {items[index]}
      </div>)
    }
    return cards
  }

  render() {
    return (
      <div className="carouselContainer">
        <div onClick={this.toleft}>◀︎</div>
        <div className="cardContainer">
          <div className="flexContainer">
            {this.itemRender()}
          </div>
        </div>
        <div onClick={this.toRight}>►</div>
      </div>
    )
  }
}






export default Home