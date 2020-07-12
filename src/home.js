import React from "react";
import './style/home.scss';
import P5Wrapper from 'react-p5-wrapper';
import sketch from './p5.js';


class Home extends React.Component {
  render() {
    return (
    <div>
        <Head />
        <Carousel />
        <Bottom/>
    </div>
    )
  }
}

class Head extends React.Component { 
  render() {
    return (
      <div className="mktArea">
       {/*  <div className="p5">
          <P5Wrapper sketch={sketch} />
        </div>  */}

        <div className="head">
          

          <img src="https://i.imgur.com/xV8JpBB.png" alt="" className="logoH"></img>
          <div className="subtitle">一款專門為英文學習打造的閃卡測驗網站。</div>
          <div className="start">START</div>
        </div>
        
        <div className="middle">
          <div className="share">評分最高的單字本：</div>
          <div className="tri"></div>
        </div>
      </div>
    )
  }

}

class Bottom extends React.Component {
  render() {
    return (
      <div className="bottomArea">
        <div className="bottom">
          {/* <div className="p5two">
            <P5Wrapper sketch={sketch} />
          </div>  */}
          <div className="journey">START YOUR JOURNEY</div>
        </div>
      </div>
    )
  }

}


let items = ["apple", "banannna", "cherry", "doge","elephant","fish","gold","hello"]
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
    if (newIndex - 1 < 0) {
      newIndex = items.length - 1
      /* console.log("too small : " + this.state.nowIndex) */
      this.setState({ nowIndex: newIndex })
    } else if (newIndex - 1 >= 0) {
      this.setState({ nowIndex: newIndex - 1 });//把數字的調整放到這裡？
      /* console.log("big enough: " + this.state.nowIndex) */
    }

  }

  toRight() {
  let newIndex = this.state.nowIndex
  if (newIndex + 1 >= items.length) {
    newIndex = 0
    /* console.log("too big : " + this.state.nowIndex) */
    this.setState({ nowIndex: newIndex })
  } else if (newIndex + 1 < items.length) {
    this.setState({ nowIndex: newIndex + 1 });
    /* console.log("small enough : " + this.state.nowIndex) */
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
      //console.log("index : "+ index)
      cards.push(<div key={index} className={"card card" + index}>
        {items[index]}
      </div>)
    }
    return cards
  }

  render() {
    return (
      <div className="container"> 
      <div className="carouselContainer">
          <div className="arrowLeft" onClick={this.toleft}></div>
        <div className="cardContainer">
          <div className="flexContainer">
            {this.itemRender()}
          </div>
        </div>
          <div className="arrowRigth" onClick={this.toRight}></div>
      </div>
    </div>

    )
  }
}






export default Home