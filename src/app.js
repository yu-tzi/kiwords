import React from "react";
import ReactDOM from "react-dom";
import Auth from "./firebaseAuth"

class App extends React.Component {
  render() {
    return (
      <Auth />
    )
  }
}




//=========================
ReactDOM.render(
  <App />,
  document.querySelector("#root"));