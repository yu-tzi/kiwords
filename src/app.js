import React from "react";
import ReactDOM from "react-dom";
import {App} from "./main"


window.addEventListener("load", () => {
  ReactDOM.render(<App />, document.querySelector("#root"));
})
