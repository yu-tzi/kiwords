import { db, storage } from "../utility/firebaseConfig"
import '../style/Dashboards.scss';
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { select } from "d3";
import moment from 'moment';


let rootURL = window.location.href.substr(0, window.location.href.indexOf("/", 9))

class Dashboards extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
    this.renderConvertedName = this.renderConvertedName.bind(this)
    this.renderConvertedImg = this.renderConvertedImg.bind(this)
  }

  renderConvertedImg() {
    let imageUrl = this.props.memberData.image
    if (imageUrl?.length < 5) {
      return (
        <div className="profileImg">
          {this.props.memberData.name?.slice(0, 1)}
        </div>
      )
    } else {
      return (
        <img className="profileImg profileImgY" src={imageUrl} alt=""
        >
        </img>
      )
    }
  }

  renderConvertedName() {
    let origiName = this.props.memberData.name
    let newName
    if (origiName?.length < 19) {
      newName = origiName
    } else {
      newName = origiName?.slice(0, 18)
      newName = newName + "..."
    }
    return (
      <div className="profileTitle">
        {newName}
      </div>
    )
  }

  render() {
    
    return (
      <div className="dashContainer"> 
        
        <div className="profileBox">
          <div className="profileImgBox">
            {this.renderConvertedImg()}
          </div>
          <div className="profileInforBox">
            {this.renderConvertedName()}
            <div className="profileInfor">
              {this.props.memberData.email}
            </div>
          </div>
        </div>{/* end of profileBox */}

        <div className="uploadBtnBox">
          <div
            className="editTitleBox"
            onClick={(e) => { this.props.popTitleUpload(e) }}>
            Change Your Name
          </div>
          <div className="editImgBox"
            onClick={this.props.popImageUpload}>
            Upload New Photo
          </div>
        </div>{/* end of uploadBtnBox */}
                
        <div className="imageUploadPop"
          style={{ display: this.props.imgUploadPop ? "block" : "none" }}>
          <div className="imageUploadPopbox">
            <div className="imageUploadclose"
              onClick={(e) => { this.props.closeImageUpload(e) }}>
              ✕
            </div>
            <input type="file" lang="en" name="file" className="uploadPicture" placeholder="Upload file and wait for a sec" accept="image/*"
            onChange={this.props.uploadImg} >
            </input>
          </div>
        </div>{/* end of imageUploadPop */}
            
        <div className="titleUploadPop"
          style={{ display: this.props.titleUploadPop ? "block" : "none" }}>
          <div className="titleUploadPopbox">
            <div className="titleUploadclose"
              onClick={(e) => {this.props.closeTitleUpload(e)}}>
              ✕
            </div>
            <form className="uploadTitleForm"
              onSubmit={this.props.changeName}>
              <input type="text" id="fname" name="fname" className="uploadTitle" placeholder="NEW NAME"
                onChange={(e) => { this.props.uploadName(e) }} >
              </input>
              <input type="submit">
              </input>
            </form>
          </div>
        </div>{/* end of titleUploadPop */}

        <Statistics userData={this.props.userData} />
        
      </div>
    )
  }
}


//======== statistic ========= 
const Statistics = (props) => {

  let data = []
  let fakeData = []

  const [fkdata, setData] = useState("")
  useEffect(() => {
    
  }, [fkdata])

  const [weekWords, setWeekWords] = useState(0)
  useEffect(() => {
    
  }, [weekWords])

  const [nowDate, setNowDate] = useState("")
  useEffect(() => {

    let originalCount = 0

    if (nowDate !== "" && nowDate !== moment()) {

      db.collection("users").doc(userID).get().then((doc) => {
        if (doc.exists) {
          
          let date = moment(nowDate)


          //make data
          for (let i = 0; i < doc.data().userExp.length; i++) {
            let start = date.weekday(0).startOf('day').valueOf()
            let end = date.weekday(6).endOf('day').valueOf()

            if (end >= doc.data().userExp[i].nowTime && doc.data().userExp[i].nowTime >= start) {

              //如果有一樣的值要加上去

              let nowLength = data.length
              let same = true

              for (let j = 0; j < nowLength; j++) {
                if (moment(doc.data().userExp[i].nowTime).day() + 1 !== data[j].day || moment(doc.data().userExp[i].nowTime).hour() !== data[j].hour) {

                  
                } else {
                  
                  data[j].count += doc.data().userExp[i].topicCount
                  originalCount += doc.data().userExp[i].topicCount
                  same = false
                }
              }

              if (same) {
                data.push({ day: moment(doc.data().userExp[i].nowTime).day() + 1, hour: moment(doc.data().userExp[i].nowTime).hour(), count: doc.data().userExp[i].topicCount })
                originalCount += doc.data().userExp[i].topicCount
              }
              


            }

          }

          for (let i = 1; i < 8; i++) {
            for (let j = 0; j < 24; j++) {
              let needData = true
              for (let k = 0; k < data.length; k++) {
                if (data[k].day === i && data[k].hour === j) {
                  
                  needData = false
                  fakeData.push(data[k])
                }
              }
              if (needData) {
                fakeData.push({ day: i, hour: j, count: 0 })
              }
            }
          }


          setData(fakeData)
          setWeekWords(originalCount)


        } else {
          console.log("No such document!");
        }
      }).catch((err) => { alert(err) })
    }
  }, [nowDate])

  const [userID, setUserID] = useState("")
  useEffect(() => {
    let originalCount = 0

    
    if (userID !== "") {
      let date = moment()

      /* [date.weekday(0).startOf('day').format("MMMM Do YYYY").toString(), date.weekday(6).endOf('day').format("MMMM Do YYYY").toString()] */

      setNowDate(moment())

      db.collection("users").doc(userID).get().then((doc) => {
        if (doc.exists) {
          




          //make data
          for (let i = 0; i < doc.data().userExp.length; i++) {
            let start = date.weekday(0).startOf('day').valueOf()
            let end = date.weekday(6).endOf('day').valueOf()

            if (end >= doc.data().userExp[i].nowTime && doc.data().userExp[i].nowTime >= start) {

              //如果有一樣的值要加上去

              let nowLength = data.length
              let same = true

              for (let j = 0; j < nowLength; j++) {
                if (moment(doc.data().userExp[i].nowTime).day() + 1 !== data[j].day || moment(doc.data().userExp[i].nowTime).hour() !== data[j].hour) {

                  
                } else {
                  
                  data[j].count += doc.data().userExp[i].topicCount
                  originalCount += doc.data().userExp[i].topicCount
                  
                  same = false
                }
              }

              if (same) {
                data.push({ day: moment(doc.data().userExp[i].nowTime).day() + 1, hour: moment(doc.data().userExp[i].nowTime).hour(), count: doc.data().userExp[i].topicCount })
                originalCount += doc.data().userExp[i].topicCount
              }
             

            }

          }

          for (let i = 1; i < 8; i++) {
            for (let j = 0; j < 24; j++) {
              let needData = true
              for (let k = 0; k < data.length; k++) {
                if (data[k].day === i && data[k].hour === j) {
                  
                  needData = false
                  fakeData.push(data[k])
                }
              }
              if (needData) {
                fakeData.push({ day: i, hour: j, count: 0 })
              }
            }
          }


          setData(fakeData)
          setWeekWords(originalCount)


        } else {
          console.log("No such document!");
        }
      }).catch((err) => { alert(err) })
    }
  }, [userID])


  const [load, setLoad] = useState(true)

  if (props.userData.length > 0 && load) {
    
    setUserID(props.userData[0].uid)
    setLoad(false)
  }


  const sendDate = (fromDate) => {
    
  }




  return (
    <div className="statistics">
      
      

      <div className="timeSelector">
        <div className="minus" onClick={() => { setNowDate(moment(nowDate).subtract(7, 'days')) }}>◀︎</div>
        <div className="timeBlock">
          <div>{moment(nowDate).weekday(0).startOf('day').format("MMMM Do YYYY").toString()}</div>
          <div>～</div>
          <div>{moment(nowDate).weekday(6).endOf('day').format("MMMM Do YYYY").toString()}</div>
        </div>
        <div className="plus" onClick={() => { setNowDate(moment(nowDate).add(7, 'days')) }}>▶︎</div>
      </div>

      <div className="statisTitle">You Reviewed {weekWords} Words in This Week</div>

      <Svg fakeData={fkdata} />
      <div className="colorBar">
        <div className="colorStart">Less</div>
        <div className="color"></div>
        <div className="colorEnd">More</div>
      </div>

      <div className="bottomPart">
        <div className="takeQuizTitle">Review more words, take quizes !</div>
        <div className="takeQuizBtn" onClick={() => { window.location.href = ('https://kiwords-c058b.web.app/quiz')}}>Take a quiz</div>
      </div>
      <div className="bottomBlank"></div>

    </div>
  )

}



const Svg = (props) => {
  


  //setting data
  let fakeData = [
    { day: 1, hour: 1, count: 0 },
    { day: 2, hour: 1, count: 0 },
    { day: 3, hour: 1, count: 0 },
    { day: 4, hour: 1, count: 0 },
    { day: 5, hour: 1, count: 0 },
    { day: 6, hour: 1, count: 0 },
    { day: 7, hour: 1, count: 0 },
    { day: 1, hour: 2, count: 0 },
    { day: 2, hour: 2, count: 0 },
    { day: 3, hour: 2, count: 0 },
    { day: 4, hour: 2, count: 0 },
    { day: 5, hour: 2, count: 0 },
    { day: 6, hour: 2, count: 0 },
    { day: 7, hour: 2, count: 0 },
    { day: 1, hour: 3, count: 0 },
    { day: 2, hour: 3, count: 0 },
    { day: 3, hour: 3, count: 0 },
    { day: 4, hour: 3, count: 0 },
    { day: 5, hour: 3, count: 0 },
    { day: 6, hour: 3, count: 0 },
    { day: 7, hour: 3, count: 0 },
    { day: 1, hour: 4, count: 0 },
    { day: 2, hour: 4, count: 0 },
    { day: 3, hour: 4, count: 0 },
    { day: 4, hour: 4, count: 0 },
    { day: 5, hour: 4, count: 0 },
    { day: 6, hour: 4, count: 0 },
    { day: 7, hour: 4, count: 0 },
    { day: 1, hour: 5, count: 0 },
    { day: 2, hour: 5, count: 0 },
    { day: 3, hour: 5, count: 0 },
    { day: 4, hour: 5, count: 0 },
    { day: 5, hour: 5, count: 0 },
    { day: 6, hour: 5, count: 0 },
    { day: 7, hour: 5, count: 0 },
    { day: 1, hour: 6, count: 0 },
    { day: 2, hour: 6, count: 0 },
    { day: 3, hour: 6, count: 0 },
    { day: 4, hour: 6, count: 0 },
    { day: 5, hour: 6, count: 0 },
    { day: 6, hour: 6, count: 0 },
    { day: 7, hour: 6, count: 0 },
    { day: 1, hour: 7, count: 0 },
    { day: 2, hour: 7, count: 0 },
    { day: 3, hour: 7, count: 0 },
    { day: 4, hour: 7, count: 0 },
    { day: 5, hour: 7, count: 0 },
    { day: 6, hour: 7, count: 0 },
    { day: 7, hour: 7, count: 0 },
    { day: 1, hour: 8, count: 0 },
    { day: 2, hour: 8, count: 0 },
    { day: 3, hour: 8, count: 0 },
    { day: 4, hour: 8, count: 0 },
    { day: 5, hour: 8, count: 0 },
    { day: 6, hour: 8, count: 0 },
    { day: 7, hour: 8, count: 0 },
    { day: 1, hour: 9, count: 0 },
    { day: 2, hour: 9, count: 0 },
    { day: 3, hour: 9, count: 0 },
    { day: 4, hour: 9, count: 0 },
    { day: 5, hour: 9, count: 0 },
    { day: 6, hour: 9, count: 0 },
    { day: 7, hour: 9, count: 0 },
    { day: 1, hour: 10, count: 0 },
    { day: 2, hour: 10, count: 0 },
    { day: 3, hour: 10, count: 0 },
    { day: 4, hour: 10, count: 0 },
    { day: 5, hour: 10, count: 0 },
    { day: 6, hour: 10, count: 0 },
    { day: 7, hour: 10, count: 0 },
    { day: 1, hour: 11, count: 0 },
    { day: 2, hour: 11, count: 0 },
    { day: 3, hour: 11, count: 0 },
    { day: 4, hour: 11, count: 0 },
    { day: 5, hour: 11, count: 0 },
    { day: 6, hour: 11, count: 0 },
    { day: 7, hour: 11, count: 0 },
    { day: 1, hour: 12, count: 0 },
    { day: 2, hour: 12, count: 0 },
    { day: 3, hour: 12, count: 0 },
    { day: 4, hour: 12, count: 0 },
    { day: 5, hour: 12, count: 0 },
    { day: 6, hour: 12, count: 0 },
    { day: 7, hour: 12, count: 0 },
    { day: 1, hour: 13, count: 0 },
    { day: 2, hour: 13, count: 0 },
    { day: 3, hour: 13, count: 0 },
    { day: 4, hour: 13, count: 0 },
    { day: 5, hour: 13, count: 0 },
    { day: 6, hour: 13, count: 0 },
    { day: 7, hour: 13, count: 0 },
    { day: 1, hour: 14, count: 0 },
    { day: 2, hour: 14, count: 0 },
    { day: 3, hour: 14, count: 0 },
    { day: 4, hour: 14, count: 0 },
    { day: 5, hour: 14, count: 0 },
    { day: 6, hour: 14, count: 0 },
    { day: 7, hour: 14, count: 0 },
    { day: 1, hour: 15, count: 0 },
    { day: 2, hour: 15, count: 0 },
    { day: 3, hour: 15, count: 0 },
    { day: 4, hour: 15, count: 0 },
    { day: 5, hour: 15, count: 0 },
    { day: 6, hour: 15, count: 0 },
    { day: 7, hour: 15, count: 0 },
    { day: 1, hour: 16, count: 0 },
    { day: 2, hour: 16, count: 0 },
    { day: 3, hour: 16, count: 0 },
    { day: 4, hour: 16, count: 0 },
    { day: 5, hour: 16, count: 0 },
    { day: 6, hour: 16, count: 0 },
    { day: 7, hour: 16, count: 0 },
    { day: 1, hour: 17, count: 0 },
    { day: 2, hour: 17, count: 0 },
    { day: 3, hour: 17, count: 0 },
    { day: 4, hour: 17, count: 0 },
    { day: 5, hour: 17, count: 0 },
    { day: 6, hour: 17, count: 0 },
    { day: 7, hour: 17, count: 0 },
    { day: 1, hour: 18, count: 0 },
    { day: 2, hour: 18, count: 0 },
    { day: 3, hour: 18, count: 0 },
    { day: 4, hour: 18, count: 0 },
    { day: 5, hour: 18, count: 0 },
    { day: 6, hour: 18, count: 0 },
    { day: 7, hour: 18, count: 0 },
    { day: 1, hour: 19, count: 0 },
    { day: 2, hour: 19, count: 0 },
    { day: 3, hour: 19, count: 0 },
    { day: 4, hour: 19, count: 0 },
    { day: 5, hour: 19, count: 0 },
    { day: 6, hour: 19, count: 0 },
    { day: 7, hour: 19, count: 0 },
    { day: 1, hour: 20, count: 0 },
    { day: 2, hour: 20, count: 0 },
    { day: 3, hour: 20, count: 0 },
    { day: 4, hour: 20, count: 0 },
    { day: 5, hour: 20, count: 0 },
    { day: 6, hour: 20, count: 0 },
    { day: 7, hour: 20, count: 0 },
    { day: 1, hour: 21, count: 0 },
    { day: 2, hour: 21, count: 0 },
    { day: 3, hour: 21, count: 0 },
    { day: 4, hour: 21, count: 0 },
    { day: 5, hour: 21, count: 0 },
    { day: 6, hour: 21, count: 0 },
    { day: 7, hour: 21, count: 0 },
    { day: 1, hour: 22, count: 0 },
    { day: 2, hour: 22, count: 0 },
    { day: 3, hour: 22, count: 0 },
    { day: 4, hour: 22, count: 0 },
    { day: 5, hour: 22, count: 0 },
    { day: 6, hour: 22, count: 0 },
    { day: 7, hour: 22, count: 0 },
    { day: 1, hour: 23, count: 0 },
    { day: 2, hour: 23, count: 0 },
    { day: 3, hour: 23, count: 0 },
    { day: 4, hour: 23, count: 0 },
    { day: 5, hour: 23, count: 0 },
    { day: 6, hour: 23, count: 0 },
    { day: 7, hour: 23, count: 0 },
    { day: 1, hour: 0, count: 0 },
    { day: 2, hour: 0, count: 0 },
    { day: 3, hour: 0, count: 0 },
    { day: 4, hour: 0, count: 0 },
    { day: 5, hour: 0, count: 0 },
    { day: 6, hour: 0, count: 0 },
    { day: 7, hour: 0, count: 0 },
  ]
  //setting x,y information
  let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  let hours = d3.range(24)
  //heatmap block sizes
  let marginTop = 35
  let marginLeft = 35
  let width = Math.max(Math.min(window.innerWidth, 800), 300) - marginLeft
  let block = Math.floor(width / hours.length)
  let height = block * (days.length)




  const svgRef = useRef()
  const [firstRen, setFirstRen] = useState(true)

  const [data, setData] = useState(fakeData)
  useEffect(() => {
    //svg canvas
      const svg = select(svgRef.current)
      svg
        .append("svg")
        .attr("width", width + marginLeft)
        .attr("height", height + marginTop)
        .append("g")
        .attr("class", "g")
        .attr("transform", `translate(${marginTop},${marginLeft})`)


    //block color based on word count

    const colorTranslator =
      d3.scaleLinear()
        .domain([0, 20])
        .range(["#24293c", "#ffffff"])

    //heatmap block
    const g = select(".g")
    g.selectAll(".blocks")
      .data(data)
      .enter()
      .append("rect")
      .attr("width", block)
      .attr('height', block)
      .attr("x", (d) => {
        return (d.hour /* - 1 */) * block
      })
      .attr("y", (d) => {
        return (d.day - 1) * block
      })
      .attr("rx", 8)
      .attr("ry", 8)
      .attr("class", "hour block")
      .style("fill", (d) => { return colorTranslator(d.count) })
      .style("stroke", "#0d0e13")
      .style("stroke-width", "5px")
      //.style("stroke-opacity", 0.5)

    //day list 
    g.selectAll(".blocks")
      .data(days)
      .enter()
      .append("text")
      .text((d) => { return d })
      .style("fill","white")
      .attr("x", 0)
      .attr("y", (d, i) => {
        return i * block
      })
      .style("text-anchor", "end")
      .style("font-weight", "lighter")
      .attr("transform", `translate(-2,${block / 1.5})`)

    //hour list
    g.selectAll("blocks")
      .data(hours)
      .enter()
      .append("text")
      .text((d) => { return d })
      .style("font-weight", "lighter")
      .style("fill", "white")
      .attr("y", 0)
      .attr("x", (d, i) => {
        return i * block
      })
      .style("text-anchor", "middle")
      .attr("transform", `translate(${block / 2},-2)`)


  }, [data])

  const [load, setLoad] = useState(true)

  if (JSON.stringify(props.fakeData) !== JSON.stringify(data) && props.fakeData.length > 0) {
    setData(props.fakeData)
  }

  if (props.fakeData.length > 0 && load) {
    
    setData(props.fakeData)
    setLoad(false)
  }

  return (
    <div className="svgContainer">
      {/*<div className="statisBox">
         <div className="statisSubHour">{"(Hour)"}</div> 
        
      </div>*/}
      
      <div ref={svgRef}></div>
    </div>
  )

}



export default Dashboards