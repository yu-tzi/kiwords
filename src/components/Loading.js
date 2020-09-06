import "../style/Loading.scss";
import React from "react";

const Loading = (props) => {
  return (
    <ul
      className={props.loadingMini ? "loadingAnimate" : "loadingAnimateBigger"}
    >
      <li></li>
      <li></li>
      <li></li>
    </ul>
  );
};

export default Loading;
