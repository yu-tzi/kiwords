import React from "react";
import { useState, createContext, useContext } from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useDrag } from 'react-dnd'
import { useDrop } from 'react-dnd'

class QuizMatch extends React.Component {
//DB word data (passing as props)
//answer state (passing func)
//send buttom
// O or X (passing color)
//freeze and show color
//counting score
  
  render() {
    return (
      <DndProvider backend={HTML5Backend}>
        <QuizContainer />
      </DndProvider>
    )
  }
}

const ItemTypes = {
  Option: 'option'
}


const QuizOption=(props)=>{

    const [{ isDragging }, drag] = useDrag({
      item: {
        type: ItemTypes.Option,
        value: props.word,
        id: props.id
      },
      collect: monitor => ({
        isDragging: !!monitor.isDragging(),
      }),
    })

    return (
      <div
        ref={drag}
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: 'move'
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

const QuizContainer=()=>{
  
  const [optionList, setOptionList] = useState([
    {
      id: 0,
      value: "valuable",
      status: "unchoose"
    }, {
      id:1,
      value: "vulnerable",
      status: "unchoose"
    }, {
      id:2,
      value: "capacity",
      status: "unchoose"
    }
  ])

  const chooseItem = (id) => {
    console.log("chooseItem trigger!" + id)
    let newList = []
    let chosenStuff =""
    
    for (let i = 0; i < optionList.length; i++){

      if (optionList[i].id === id) {
        console.log(optionList[i])
        chosenStuff = optionList[i]
        chosenStuff.status = "chosen"
        newList.push(chosenStuff)
      }
      
      if (optionList[i].id !== id) {
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

  return (

    <div>
      <QuizContext.Provider value={{ chooseItem, unChooseItem }}>
      
      <AnsArea>
      {
        optionList
        .map((option,i) => {
          if (option.status === "unchoose") {
            return (  
              <QuizOption key={i} i={i} word={option.value} id={option.id}/>
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
                <QuizOption key={i} i={i} word={option.value} id={option.id}/>
              )
            }
          })
        }
      </QuizArea>

    </QuizContext.Provider>
    </div>
    
  )








}








export default QuizMatch