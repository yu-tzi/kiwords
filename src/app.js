import React from "react";
import ReactDOM from "react-dom";
import Auth from "./firebaseAuth&DB"

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <Auth/>
    )
  }
}

//=========================
ReactDOM.render(
  <App />,
  document.querySelector("#root"));