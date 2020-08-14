import React from "react";
import '../style/Home.scss';
import P5Wrapper from 'react-p5-wrapper';
import Sketch from './Sketch.js';

let rootURL = window.location.href.substr(0, window.location.href.indexOf("/", 9))

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Head logIn={this.props.logIn} />
      </div>
    )
  }
}

class Head extends React.Component { 
  render() {
    return (
      <div className="mktArea">
        
        <div className="p5">
          <P5Wrapper sketch={Sketch} />
        </div> 

        <div className="head">
          <div className="logoH">KiWords
          </div>
          <div className="subtitle">KiWords is a simple learning tool that help you study English. Start learning today with flashcards & quizzes !
          </div>
          <a href={this.props.logIn ? rootURL + "/wordbooks" : rootURL + "/login"} >
            <div className="start">START
            </div>
          </a>
        </div>

      </div>
    )
  }
}


export default Home