import React from "react";
import "../style/Home.scss";
import P5Wrapper from "react-p5-wrapper";
import Sketch from "./Sketch.js";
import { RippleButton } from "./Effect.js";

const rootURL = window.location.href.substr(
  0,
  window.location.href.indexOf("/", 9)
);

class Home extends React.Component {
  render() {
    return (
      <div>
        <Head logIn={this.props.logIn} />
      </div>
    );
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
          <div className="logoH">KiWords</div>
          <div className="subtitle">
            KiWords is a simple learning tool that help you study English. Start
            learning today with flashcards & quizzes !
          </div>

          <RippleButton effectClass={"homeRippleBtnContainer"}>
            <div
              onClick={() => {
                this.props.logIn
                  ? setTimeout(() => {
                      window.location.href = rootURL + "/wordbooks";
                    }, 600)
                  : setTimeout(() => {
                      window.location.href = rootURL + "/login";
                    }, 600);
              }}
            >
              <div className="start">START</div>
            </div>
          </RippleButton>
        </div>
      </div>
    );
  }
}

export default Home;
