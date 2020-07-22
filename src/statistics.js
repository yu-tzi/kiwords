import React, { useEffect,useRef,useState } from "react";
import './style/statistic.scss';
import * as d3 from "d3";
import { select } from "d3";

class Statistics extends React.Component {
  render() {
    return (
      <div className="statistics">Statistics
        <Svg/>
      </div>
    )
  }
}

export default Statistics

const Svg = () => {

  //setting data
  let fakeData = [
    { day: 1, hour: 1, count: 0 },
    { day: 2, hour: 1, count: 0 },
    { day: 3, hour: 1, count: 1 },
    { day: 4, hour: 1, count: 0 },
    { day: 5, hour: 1, count: 5 },
    { day: 6, hour: 1, count: 10 },
    { day: 7, hour: 1, count: 3 },
    { day: 1, hour: 2, count: 0 },
    { day: 2, hour: 2, count: 0 },
    { day: 3, hour: 2, count: 1 },
    { day: 4, hour: 2, count: 5 },
    { day: 5, hour: 2, count: 0 },
    { day: 6, hour: 2, count: 0 },
    { day: 7, hour: 2, count: 0 },
    { day: 1, hour: 3, count: 7 },
    { day: 2, hour: 3, count: 0 },
    { day: 3, hour: 3, count: 2 },
    { day: 4, hour: 3, count: 3 },
    { day: 5, hour: 3, count: 4 },
    { day: 6, hour: 3, count: 0 },
    { day: 7, hour: 3, count: 9 },
    { day: 1, hour: 4, count: 0 },
    { day: 2, hour: 4, count: 0 },
    { day: 3, hour: 4, count: 1 },
    { day: 4, hour: 4, count: 10 },
    { day: 5, hour: 4, count: 5 },
    { day: 6, hour: 4, count: 0 },
    { day: 7, hour: 4, count: 0 },
    { day: 1, hour: 5, count: 0 },
    { day: 2, hour: 5, count: 4 },
    { day: 3, hour: 5, count: 5 },
    { day: 4, hour: 5, count: 9 },
    { day: 5, hour: 5, count: 0 },
    { day: 6, hour: 5, count: 2 },
    { day: 7, hour: 5, count: 0 },
    { day: 1, hour: 6, count: 0 },
    { day: 2, hour: 6, count: 3 },
    { day: 3, hour: 6, count: 4 },
    { day: 4, hour: 6, count: 1 },
    { day: 5, hour: 6, count: 0 },
    { day: 6, hour: 6, count: 1 },
    { day: 7, hour: 6, count: 0 },
    { day: 1, hour: 7, count: 0 },
    { day: 2, hour: 7, count: 4 },
    { day: 3, hour: 7, count: 0 },
    { day: 4, hour: 7, count: 0 },
    { day: 5, hour: 7, count: 1 },
    { day: 6, hour: 7, count: 2 },
    { day: 7, hour: 7, count: 3 },
    { day: 1, hour: 8, count: 0 },
    { day: 2, hour: 8, count: 0 },
    { day: 3, hour: 8, count: 3 },
    { day: 4, hour: 8, count: 1 },
    { day: 5, hour: 8, count: 3 },
    { day: 6, hour: 8, count: 2 },
    { day: 7, hour: 8, count: 0 },
    { day: 1, hour: 9, count: 9 },
    { day: 2, hour: 9, count: 0 },
    { day: 3, hour: 9, count: 1 },
    { day: 4, hour: 9, count: 2 },
    { day: 5, hour: 9, count: 10 },
    { day: 6, hour: 9, count: 0 },
    { day: 7, hour: 9, count: 0 },
    { day: 1, hour: 10, count: 0 },
    { day: 2, hour: 10, count: 0 },
    { day: 3, hour: 10, count: 1 },
    { day: 4, hour: 10, count: 5 },
    { day: 5, hour: 10, count: 0 },
    { day: 6, hour: 10, count: 0 },
    { day: 7, hour: 10, count: 1 },
    { day: 1, hour: 11, count: 2 },
    { day: 2, hour: 11, count: 5 },
    { day: 3, hour: 11, count: 8 },
    { day: 4, hour: 11, count: 0 },
    { day: 5, hour: 11, count: 1 },
    { day: 6, hour: 11, count: 0 },
    { day: 7, hour: 11, count: 0 },
    { day: 1, hour: 12, count: 2 },
    { day: 2, hour: 12, count: 5 },
    { day: 3, hour: 12, count: 8 },
    { day: 4, hour: 12, count: 0 },
    { day: 5, hour: 12, count: 1 },
    { day: 6, hour: 12, count: 0 },
    { day: 7, hour: 12, count: 0 },
    { day: 1, hour: 13, count: 2 },
    { day: 2, hour: 13, count: 5 },
    { day: 3, hour: 13, count: 8 },
    { day: 4, hour: 13, count: 0 },
    { day: 5, hour: 13, count: 1 },
    { day: 6, hour: 13, count: 0 },
    { day: 7, hour: 13, count: 0 },
    { day: 1, hour: 14, count: 2 },
    { day: 2, hour: 14, count: 5 },
    { day: 3, hour: 14, count: 8 },
    { day: 4, hour: 14, count: 0 },
    { day: 5, hour: 14, count: 1 },
    { day: 6, hour: 14, count: 0 },
    { day: 7, hour: 14, count: 0 },
    { day: 1, hour: 15, count: 2 },
    { day: 2, hour: 15, count: 5 },
    { day: 3, hour: 15, count: 8 },
    { day: 4, hour: 15, count: 0 },
    { day: 5, hour: 15, count: 1 },
    { day: 6, hour: 15, count: 0 },
    { day: 7, hour: 15, count: 0 },
    { day: 1, hour: 16, count: 2 },
    { day: 2, hour: 16, count: 5 },
    { day: 3, hour: 16, count: 8 },
    { day: 4, hour: 16, count: 0 },
    { day: 5, hour: 16, count: 1 },
    { day: 6, hour: 16, count: 0 },
    { day: 7, hour: 16, count: 0 },
    { day: 1, hour: 17, count: 2 },
    { day: 2, hour: 17, count: 5 },
    { day: 3, hour: 17, count: 8 },
    { day: 4, hour: 17, count: 0 },
    { day: 5, hour: 17, count: 1 },
    { day: 6, hour: 17, count: 0 },
    { day: 7, hour: 17, count: 0 },
    { day: 1, hour: 18, count: 2 },
    { day: 2, hour: 18, count: 5 },
    { day: 3, hour: 18, count: 8 },
    { day: 4, hour: 18, count: 0 },
    { day: 5, hour: 18, count: 1 },
    { day: 6, hour: 18, count: 0 },
    { day: 7, hour: 18, count: 0 },
    { day: 1, hour: 19, count: 2 },
    { day: 2, hour: 19, count: 5 },
    { day: 3, hour: 19, count: 8 },
    { day: 4, hour: 19, count: 0 },
    { day: 5, hour: 19, count: 1 },
    { day: 6, hour: 19, count: 0 },
    { day: 7, hour: 19, count: 0 },
    { day: 1, hour: 20, count: 2 },
    { day: 2, hour: 20, count: 5 },
    { day: 3, hour: 20, count: 8 },
    { day: 4, hour: 20, count: 0 },
    { day: 5, hour: 20, count: 1 },
    { day: 6, hour: 20, count: 0 },
    { day: 7, hour: 20, count: 0 },
    { day: 1, hour: 21, count: 2 },
    { day: 2, hour: 21, count: 5 },
    { day: 3, hour: 21, count: 8 },
    { day: 4, hour: 21, count: 0 },
    { day: 5, hour: 21, count: 1 },
    { day: 6, hour: 21, count: 0 },
    { day: 7, hour: 21, count: 0 },
    { day: 1, hour: 22, count: 2 },
    { day: 2, hour: 22, count: 5 },
    { day: 3, hour: 22, count: 8 },
    { day: 4, hour: 22, count: 0 },
    { day: 5, hour: 22, count: 1 },
    { day: 6, hour: 22, count: 0 },
    { day: 7, hour: 22, count: 0 },
    { day: 1, hour: 23, count: 2 },
    { day: 2, hour: 23, count: 5 },
    { day: 3, hour: 23, count: 8 },
    { day: 4, hour: 23, count: 0 },
    { day: 5, hour: 23, count: 1 },
    { day: 6, hour: 23, count: 0 },
    { day: 7, hour: 23, count: 0 },
    { day: 1, hour: 24, count: 2 },
    { day: 2, hour: 24, count: 5 },
    { day: 3, hour: 24, count: 8 },
    { day: 4, hour: 24, count: 0 },
    { day: 5, hour: 24, count: 1 },
    { day: 6, hour: 24, count: 0 },
    { day: 7, hour: 24, count: 0 },
  ]
  //setting x,y information
  let days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
  let hours = d3.range(24)
  //heatmap block sizes
  let marginTop = 50
  let marginLeft = 50
  let width = Math.max(Math.min(window.innerWidth,800),300) - marginLeft
  let block = Math.floor(width/hours.length)
  let height = block*(days.length)
  

  const svgRef = useRef()
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
        .domain([0, 10, 50])
        .range(["#f4f4e6", "#ED973B", "#DA0707"])
    
    //heatmap block
    const g = select(".g")
    g.selectAll(".blocks") 
      .data(fakeData)
      .enter()
      .append("rect")
      .attr("width", block)
      .attr('height',block)
      .attr("x", (d) => {
        return (d.hour - 1)*block
      })
      .attr("y", (d) => {
        return(d.day -1)*block
      })
      .attr("class","hour block")
      .style("fill", (d) => { return colorTranslator(d.count) })
      .style("stroke", "white")
      .style("stroke-opacity", 0.5)
    
    //day list 
    g.selectAll(".blocks") 
      .data(days)
      .enter()
      .append("text")
      .text((d) => { return d })
      .attr("x", 0)
      .attr("y", (d, i) => {
        return i*block
      })
      .style("text-anchor", "end")
      .attr("transform",`translate(-2,${block/1.5})`)
    
    //hour list
    g.selectAll("blocks")
      .data(hours)
      .enter()
      .append("text")
      .text((d)=>{ return d })
      .attr("y", 0)
      .attr("x", (d, i) => {
        return i*block
      })
      .style("text-anchor", "middle")
      .attr("transform", `translate(${block / 2},-2)`)
    
    
    
    
    
    
    
  }, [data])


  

  
  return (
    <div>
      <div ref={svgRef}>Hi there</div>
    </div>
  )



}

