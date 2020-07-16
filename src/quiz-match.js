import React from "react";
import { useState, createContext, useContext, useEffect } from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useDrag } from 'react-dnd'
import { useDrop } from 'react-dnd'
import { db } from "./firebaseConfig"
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';

class QuizMatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  
  render() {
    return (
      <DndProvider backend={MultiBackend} options={HTML5toTouch}>
        <QuizContainer showBook={this.props.showBook}/>
      </DndProvider>
    )
  }
}

const ItemTypes = {
  Option: 'option'
}


const QuizOption=(props)=>{

  const [{ isDragging,canDrag }, drag] = useDrag({
      item: {
        type: ItemTypes.Option,
        value: props.word,
        id: props.id
    },
      canDrag: props.checked,
      collect: monitor => ({
        isDragging: !!monitor.isDragging()
      }),
    })

    return (
      <div
        ref={drag}
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: 'move',
          color: props.color
        }}
        key={props.i}
      >{props.word}</div>
    )
}

const AnsArea = (props) => {

  const { unChooseItem } = useContext(QuizContext);

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.Option,
    drop: (item, monitor) => { unChooseItem(item.id) },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    })
  })

  return (
    <div
      ref={drop}
      style={{
        backgroundColor: isOver ? "blue" : "green"
      }}
    >
      <div>here is your option:</div>
      {props.children}
    </div>
  )
}


const QuizArea = (props) => {
  
  const { chooseItem } = useContext(QuizContext);

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.Option,
    drop: (item, monitor) => {chooseItem(item.id)} ,
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    })
  })
  
    return (
      <div
        ref={drop}
        style={{
          backgroundColor: isOver ? "grey" : "yellow"
        }}
      >
        <div>drop your ans here:</div>
        {props.children}
      </div>
    )
}


//====create context====

const QuizContext = createContext({
  chooseItem: null,
  unChooseItem:null
});

const QuizContainer = (props) => {
  
  
  const [optionList, setOptionList] = useState([
    {
      id: 0,
      value: "valuable",
      status: "unchoose",
      color: "black"
    }, {
      id: 1,
      value: "vulnerable",
      status: "unchoose",
      color: "black"
    }, {
      id: 2,
      value: "capacity",
      status: "unchoose",
      color: "black"
    }
  ])

  const [answer, setAnswer] = useState([
    {
      id: 0,
      value: "valuable",
      status: "unchoose",
      color: "black"
    }
  ])

  const [checked, setChecked] = useState([true])
  const [bookID, setBookID] = useState([""])
  const [start, setStart] = useState([false])

  

  const checkAns = () => {
    let correct = false
    let chooseAns = ""
    let ans = 0
    for (let i = 0; i < optionList.length; i++){
      if (optionList[i].status === "chosen") {

        if (optionList[i].value === answer[0].value) {
          correct = true
          setChecked(false)
          chooseAns = -1
          alert('正確答案')
        } else {
          chooseAns = optionList[i].id
          setChecked(false)
          alert('不是正確答案')
        }
      } else {
        ans += 1
      }

      if (ans > 2) {
        alert('尚未選擇答案')
      } else {
        SendItem(chooseAns)
      }
    
    }
  }
  
  const chooseItem = (id) => {
    console.log("chooseItem trigger!" + id)
    let newList = []
    let chosenStuff = ""
    let unChooseStuff = ""
    
    for (let i = 0; i < optionList.length; i++){

      if (optionList[i].id === id) {
        console.log(optionList[i])
        chosenStuff = optionList[i]
        chosenStuff.status = "chosen"
        newList.push(chosenStuff)
      }
      
      if (optionList[i].id !== id) {
        unChooseStuff = optionList[i]
        unChooseStuff.status = "unchoose"
        newList.push(optionList[i])
      }
    
    }
    console.log(newList)
    
    setOptionList(newList)
  }


  const unChooseItem = (id) => {
    console.log("unChooseItem trigger!" + id)
    let newList = []
    let unChooseStuff = ""

    for (let i = 0; i < optionList.length; i++) {

      if (optionList[i].id === id) {
        console.log(optionList[i])
        unChooseStuff = optionList[i]
        unChooseStuff.status = "unchoose"
        newList.push(unChooseStuff)
      }

      if (optionList[i].id !== id) {
        newList.push(optionList[i])
      }

    }
    console.log(newList)
    setOptionList(newList)
  }

  const SendItem = (chooseID) => {
    let newList = []

    for (let i = 0; i < optionList.length; i++) {
      let blue
      let red
      let black
      if (optionList[i].id === answer[0].id) {
        blue = optionList[i]
        blue.color = "blue"
        newList.push(blue)
      }
      if (optionList[i].id === chooseID) {
        red = optionList[i]
        red.color = "red"
        newList.push(red)
      }
      if (optionList[i].id !== answer[0].id && optionList[i].id !== chooseID) {
        black = optionList[i]
        newList.push(black)
      }
    }
    console.log(newList)
    setOptionList(newList)
  }


  const getBookID = (e) => {
    console.log(e.target.value)
    if (e.target.value !== " ") {
      setBookID(e.target.value)
      setStart(false)
    } else {
      setBookID(" ")
      setStart(true)
    }

  }

  const showBookID =(data, i)=>{
    return (
      <option key={i} value={data.bookID} >{data.bookName}</option>
    )
  }

  
  const renderBookID = () => {
    
      if (props.showBook.length > 0) {

        let all = []
        let count = 0
        let j = 1
        for (let i = 0; i < props.showBook.length; i++) {
          all.push(showBookID(props.showBook[i], i))
          count++
          j++
        }

        if (count == props.showBook.length) {

          return (
            <select onChange={(e) => { getBookID(e) }}>
              <option key={props.showBook.length + 1} value=" " >———— 請選擇單字本 ————</option>
              {all}
            </select>
          )
        }
      }
  }



  return (
    <div>
      {renderBookID()}
      <div style={{ display: start ? "none":"block"}}>

        <QuizContext.Provider value={{ chooseItem, unChooseItem }}>
        
        <AnsArea>
        {
          optionList
          .map((option,i) => {
            if (option.status === "unchoose") {
              return (  
                <QuizOption key={i} i={i} word={option.value} id={option.id} color={option.color} checked={checked}/>
              )
            }
          })
        }
        </AnsArea>
        
        <QuizArea>
        {
          optionList
            .map((option, i) => {
              if (option.status === "chosen") {
                return (
                  <QuizOption key={i} i={i} word={option.value} id={option.id} color={option.color} checked={checked}/>
                )
              }
            })
          }
        </QuizArea>

        </QuizContext.Provider>

        <div onClick={checkAns}>送出答案</div>
        <div>下一題</div>
        <div>結束測驗</div>
        <div>計分</div>
      
      </div>
    </div>
    
  )








}








export default QuizMatch