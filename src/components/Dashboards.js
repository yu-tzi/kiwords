import { db } from "../utility/firebaseConfig";
import "../style/Dashboards.scss";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { select } from "d3";
import moment from "moment";
import Loading from "./Loading.js";
import { RippleButton } from "./Effect.js";

class Dashboards extends React.Component {
  constructor(props) {
    super(props);
    this.renderConvertedName = this.renderConvertedName.bind(this);
    this.renderConvertedImg = this.renderConvertedImg.bind(this);
  }

  renderConvertedImg() {
    let imageUrl = this.props.memberData.image;
    if (imageUrl?.length < 5) {
      return (
        <div className="profileImg">
          {this.props.memberData.name?.slice(0, 1)}
        </div>
      );
    } else {
      return (
        <img className="profileImg profileImgY" src={imageUrl} alt=""></img>
      );
    }
  }

  renderConvertedName() {
    let origiName = this.props.memberData.name;
    let newName;
    if (origiName?.length < 19) {
      newName = origiName;
    } else {
      newName = origiName?.slice(0, 18);
      newName = newName + "...";
    }
    return <div className="profileTitle">{newName}</div>;
  }

  render() {
    return (
      <div className="dashContainer">
        {this.props.memberData.name?.length > 0 ? (
          <div className="profileBox">
            <div className="profileImgBox">{this.renderConvertedImg()}</div>
            <div className="profileInforBox">
              {this.renderConvertedName()}
              <div className="profileInfor">{this.props.memberData.email}</div>
            </div>
          </div>
        ) : (
          <div className="profileBox">
            <Loading loadingMini={false} />
          </div>
        )}

        <div className="uploadBtnBox">
          <RippleButton effectClass={"editTitleRippleBtnContainer"}>
            <div
              className="editTitleBox"
              onClick={(e) => {
                setTimeout(() => {
                  this.props.popTitleUpload(e);
                }, 300);
              }}
            >
              Change Your Name
            </div>
          </RippleButton>
          <RippleButton effectClass={"editTitleRippleBtnContainer"}>
            <div
              className="editImgBox"
              onClick={(e) => {
                setTimeout(() => {
                  this.props.popImageUpload(e);
                }, 300);
              }}
            >
              Upload New Photo
            </div>
          </RippleButton>
        </div>
        {/* end of uploadBtnBox */}

        <div
          className="imageUploadPop"
          style={{ display: this.props.imgUploadPop ? "block" : "none" }}
        >
          <div className="imageUploadPopbox">
            <div
              className="imageUploadclose"
              onClick={(e) => {
                this.props.closeImageUpload(e);
              }}
            >
              ✕
            </div>
            <input
              type="file"
              lang="en"
              name="file"
              className="uploadPicture"
              placeholder="Upload file and wait for a sec"
              accept="image/*"
              onChange={this.props.uploadImg}
              style={{ display: this.props.isLoading ? "none" : "block" }}
            ></input>
            <div
              className="uploadPictureLoad"
              style={{ display: this.props.isLoading ? "flex" : "none" }}
            >
              <Loading loadingMini={true} />
            </div>
          </div>
        </div>
        {/* end of imageUploadPop */}

        <div
          className="titleUploadPop"
          style={{ display: this.props.titleUploadPop ? "block" : "none" }}
        >
          <div className="titleUploadPopbox">
            <div
              className="titleUploadclose"
              onClick={(e) => {
                this.props.closeTitleUpload(e);
              }}
            >
              ✕
            </div>
            <form className="uploadTitleForm" onSubmit={this.props.changeName}>
              <input
                type="text"
                id="fname"
                name="fname"
                className="uploadTitle"
                placeholder="NEW NAME"
                onChange={(e) => {
                  this.props.uploadName(e);
                }}
              ></input>
              <input type="submit"></input>
            </form>
          </div>
        </div>
        {/* end of titleUploadPop */}

        <Statistics userData={this.props.userData} />
      </div>
    );
  }
}

//======== statistic using hook & d3.js =========

const Statistics = (props) => {
  const [nowData, setData] = useState("");
  const [weekWords, setWeekWords] = useState(0);
  const [load, setLoad] = useState(true);

  const [userID, setUserID] = useState("");
  useEffect(() => {
    if (userID !== "") {
      let date = moment();
      setNowDate(date);
    }
  }, [userID]);

  const [nowDate, setNowDate] = useState("");
  useEffect(() => {
    let originalCount = 0;
    let data = [];
    let firstData = [];
    if (nowDate !== "") {
      db.collection("users")
        .doc(userID)
        .get()
        .then((doc) => {
          if (doc.exists) {
            let date = moment(nowDate);
            let sunday = date.weekday(0).startOf("day").valueOf();
            let saturday = date.weekday(6).endOf("day").valueOf();

            //turn DB quiz data to specific format
            for (let i = 0; i < doc.data().userExp.length; i++) {
              let dataTimeCode = doc.data().userExp[i].nowTime;

              if (saturday >= dataTimeCode && dataTimeCode >= sunday) {
                let nowDataLength = data.length;
                let isDifferentData = true;

                for (let j = 0; j < nowDataLength; j++) {
                  let isDataTimeRepeated =
                    moment(dataTimeCode).day() + 1 === data[j].day &&
                    moment(dataTimeCode).hour() === data[j].hour;
                  if (isDataTimeRepeated) {
                    data[j].count += doc.data().userExp[i].topicCount;
                    originalCount += doc.data().userExp[i].topicCount;
                    isDifferentData = false;
                  }
                }

                if (isDifferentData) {
                  data.push({
                    day: moment(dataTimeCode).day() + 1,
                    hour: moment(dataTimeCode).hour(),
                    count: doc.data().userExp[i].topicCount,
                  });
                  originalCount += doc.data().userExp[i].topicCount;
                }
              }
            }

            //fill the other data
            for (let i = 1; i < 8; i++) {
              for (let j = 0; j < 24; j++) {
                let needData = true;
                let nowDataLength = data.length;
                for (let k = 0; k < nowDataLength; k++) {
                  if (data[k].day === i && data[k].hour === j) {
                    needData = false;
                    firstData.push(data[k]);
                  }
                }
                if (needData) {
                  firstData.push({ day: i, hour: j, count: 0 });
                }
              }
            }
            setData(firstData);
            setWeekWords(originalCount);
          } else {
            console.log("No such document!");
          }
        })
        .catch((err) => {
          alert(err);
        });
    }
  }, [nowDate]);

  if (props.userData.length > 0 && load) {
    setUserID(props.userData[0].uid);
    setLoad(false);
  }

  let sunday = moment(nowDate)
    .weekday(0)
    .startOf("day")
    .format("MMMM Do YYYY")
    .toString();
  let sataurday = moment(nowDate)
    .weekday(6)
    .endOf("day")
    .format("MMMM Do YYYY")
    .toString();
  return (
    <div className="statistics">
      <div className="timeSelector">
        <RippleButton effectClass={"homeStaRippleBtnContainer"}>
          <div
            className="minus"
            onClick={() => {
              setNowDate(moment(nowDate).subtract(7, "days"));
            }}
          >
            ◀︎
          </div>
        </RippleButton>

        {sunday === "Invalid date" || sataurday === "Invalid date" ? (
          <div className="timeBlock">
            <Loading loadingMini={true} />
          </div>
        ) : (
          <div className="timeBlock">
            <div>{sunday}</div>
            <div>～</div>
            <div>{sataurday}</div>
          </div>
        )}

        <RippleButton effectClass={"homeStaRippleBtnContainer"}>
          <div
            className="plus"
            onClick={() => {
              setNowDate(moment(nowDate).add(7, "days"));
            }}
          >
            ▶︎
          </div>
        </RippleButton>
      </div>

      <div className="statisTitle">
        You Reviewed {weekWords} Words in This Week
      </div>

      <Svg nowData={nowData} />
      <div className="colorBar">
        <div className="colorStart">Less</div>
        <div className="color"></div>
        <div className="colorEnd">More</div>
      </div>

      <div className="bottomPart">
        <div className="takeQuizTitle">Review more words, take quizzes !</div>
        <RippleButton effectClass={"dashQuizRippleBtnContainer"}>
          <div
            className="takeQuizBtn"
            onClick={() => {
              setTimeout(() => {
                window.location.href = "https://kiwords-c058b.web.app/quiz";
              }, 500);
            }}
          >
            Take a quiz
          </div>
        </RippleButton>
      </div>
      <div className="bottomBlank"></div>
    </div>
  );
};

const Svg = (props) => {
  let firstData = [];

  for (let i = 1; i < 8; i++) {
    for (let j = 1; j < 24; j++) {
      firstData.push({ day: i, hour: j, count: 0 });
    }
  }

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hours = d3.range(24);
  const marginTop = 35;
  const marginLeft = 35;
  let width = Math.max(Math.min(window.innerWidth, 800), 300) - marginLeft;
  let block = Math.floor(width / hours.length);
  let height = block * days.length;

  const svgRef = useRef();
  const [firstLoad, setfirstLoad] = useState(true);
  const [data, setData] = useState(firstData);

  let isDataRenewCompleted =
    JSON.stringify(props.nowData) === JSON.stringify(data);
  if (!isDataRenewCompleted && props.nowData.length > 0) {
    setData(props.nowData);
  }

  useEffect(() => {
    let isFirstData = JSON.stringify(firstData) === JSON.stringify(data);
    if (isFirstData && firstLoad) {
      //svg canvas
      const svg = select(svgRef.current);
      svg
        .append("svg")
        .attr("width", width + marginLeft)
        .attr("height", height + marginTop)
        .append("g")
        .attr("class", "g")
        .attr("transform", `translate(${marginTop},${marginLeft})`);
    }

    //block color based on word count
    const colorTranslator = d3
      .scaleLinear()
      .domain([0, 20])
      .range(["#24293c", "#ffffff"]);

    //heatmap block
    const g = select(".g");
    g.selectAll(".blocks")
      .data(data)
      .enter()
      .append("rect")
      .attr("width", block)
      .attr("height", block)
      .attr("x", (d) => {
        return d.hour * block;
      })
      .attr("y", (d) => {
        return (d.day - 1) * block;
      })
      .attr("rx", 8)
      .attr("ry", 8)
      .attr("class", "hour block")
      .style("fill", (d) => {
        return colorTranslator(d.count);
      })
      .style("stroke", "#0d0e13")
      .style("stroke-width", "5px");

    //day list
    g.selectAll(".blocks")
      .data(days)
      .enter()
      .append("text")
      .text((d) => {
        return d;
      })
      .style("fill", "white")
      .attr("x", 0)
      .attr("y", (d, i) => {
        return i * block;
      })
      .style("text-anchor", "end")
      .style("font-weight", "lighter")
      .attr("transform", `translate(-2,${block / 1.5})`);

    //hour list
    g.selectAll("blocks")
      .data(hours)
      .enter()
      .append("text")
      .text((d) => {
        return d;
      })
      .style("font-weight", "lighter")
      .style("fill", "white")
      .attr("y", 0)
      .attr("x", (d, i) => {
        return i * block;
      })
      .style("text-anchor", "middle")
      .attr("transform", `translate(${block / 2},-2)`);

    setfirstLoad(false);
  }, [data]);

  return (
    <div className="svgContainer">
      <div
        ref={svgRef}
        style={{
          display:
            JSON.stringify(firstData) !== JSON.stringify(data)
              ? "flex"
              : "none",
        }}
      ></div>
      <div
        className="dashboardLoadContainer"
        style={{
          display:
            JSON.stringify(firstData) !== JSON.stringify(data)
              ? "none"
              : "flex",
        }}
      >
        <Loading loadingMini={false} />
      </div>
    </div>
  );
};

export default Dashboards;
