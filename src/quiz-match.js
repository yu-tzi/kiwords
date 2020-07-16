import React from "react";
import { useState, createContext, useContext, useEffect } from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useDrag } from 'react-dnd'
import { useDrop } from 'react-dnd'
import { db } from "./firebaseConfig"
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';
import './style/quizMatch.scss';

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
        className="quizOption"
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
      className="optionDrop"
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
    <div>
      {console.log(props.topic)}
      <div className="title">Meaning : {props.topic[0].meaning}</div>
      <div className="title-antonym">Antonym : {props.topic[0].meaning}</div>
      <div className="title-synonyms">Synonyms : {props.topic[0].meaning}</div>

      <div
        ref={drop}
        style={{
          backgroundColor: isOver ? "grey" : "yellow"
        }}
        className="answerDrop"
      >
        {props.children}
      </div>
    </div>
    )
}


//====create context====

const QuizContext = createContext({
  chooseItem: null,
  unChooseItem:null
});

const QuizContainer = (props) => {

  const [checked, setChecked] = useState([true])
  const [bookID, setBookID] = useState([""])
  useEffect(() => {
    let str = bookID
    console.log(str.length)
    if (str.length > 5) {
      setPage(1)
      setScore(0)
      setChecked(true)
      db.collection("books").doc(bookID).get().then((doc) => {
        console.log(doc.data().cards[0].word)
        let options = []
        if (doc.data().cards.length < 3) {
          alert('你的單字本字量不夠，請先新增更多單字:(')
          /*  redirect to add card page */
        } else {
          for (let i = 0; i < 3; i++) {
            let option = {
              id: i,
              value: doc.data().cards[i].word,
              status: "unchoose",
              color: "black"
            }
            options.push(option)
          }
          let j = Math.floor((Math.random() * 3))
          let answer = {
            id: j,
            value: doc.data().cards[j].word,
            status: "unchoose",
            color: "black"
          }

          let topicContent = []
          topicContent.push({ meaning: doc.data().cards[j].meaning })



          if (doc.data().cards[j].antonym.length > 0) {
            let ant = ""
            for (let i = 0; i < doc.data().cards[j].antonym.length; i++) {
              ant = doc.data().cards[j].antonym
            }
            ant = ant.toString()
            topicContent.push({ antonym: ant })
          } else {
            topicContent.push({ antonym: "no antonym"})
          }

          if (doc.data().cards[j].synonyms.length > 0) {
            let syn = ""
            for (let i = 0; i < doc.data().cards[j].synonyms.length; i++) {
              syn = doc.data().cards[j].synonyms
            }
            syn = syn.toString()
            topicContent.push({ synonyms: syn })
          } else {
            topicContent.push({ synonyms: "no synonyms" })
          }
          console.log(doc.data().cards[j].synonyms.length)
          setTopic(topicContent)
      
        
          setAnswer(answer)
          setOptionList(options)
        }
      }
      ).catch((error) => {
        alert(error)
      })
    }
  }, [bookID]);
  const [start, setStart] = useState([false])
  const [page, setPage] = useState(1)
  useEffect(() => {
    let str = bookID
    console.log(str.length)
    if (str.length > 5) {
      console.log(page)
      db.collection("books").doc(bookID).get().then((doc) => {
        console.log(doc.data().cards[0].word)
        if (doc.data().cards.length <= page + 2) {
          alert('單字用罄，結束測驗，分數是： '+score)
        } else {
          let options = []
          for (let i = 0; i < 3; i++) {
            let count = parseInt(page)
            let option = {
              id: count + i,
              value: doc.data().cards[count + i].word,
              status: "unchoose",
              color: "black"
            }
            options.push(option)
          }
          let count = parseInt(page)
          let j = Math.floor((Math.random() * 3))
          let answer = {
            id: count + j,
            value: doc.data().cards[count + j].word,
            status: "unchoose",
            color: "black"
          }

          let topicContent = []
          topicContent.push({ meaning: doc.data().cards[count + j].meaning })
          


          if (doc.data().cards[count + j].antonym.length > 0) {
            let ant = ""
            for (let i = 0; i < doc.data().cards[count + j].antonym.length; i++){
              ant = doc.data().cards[count + j].antonym
            }
              ant = ant.toString()
              topicContent.push({ antonym: ant })
          }

          if (doc.data().cards[count + j].synonyms.length > 0) {
            let syn = ""
            for (let i = 0; i < doc.data().cards[count + j].synonyms.length; i++) {
              syn = doc.data().cards[count + j].synonyms
            }
              syn = syn.toString()
              topicContent.push({ synonyms: syn })
          }
          console.log(doc.data().cards[count + j].synonyms.length)
          setTopic(topicContent)
          console.log(topic)

          setAnswer(answer)
          setOptionList(options)
          setChecked(true)
        }
      }
      ).catch((error) => {
        alert(error)
      })
    }
  }, [page])
  const [score, setScore] = useState(0)
  useEffect(()=>{
    console.log("score : "+score)
  },[score])


  const [optionList, setOptionList] = useState([""])
  useEffect(() => { 
    console.log(optionList)
  }, [optionList])
  /* 
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
     */

  const [answer, setAnswer] = useState([""])
  useEffect(() => {
    console.log(answer)
  }, [answer])
  /* 
    {
      id: 0,
      value: "valuable",
      status: "unchoose",
      color: "black"
    }
     */
  
  const [topic, setTopic] = useState([""])
  useEffect(() => {
    console.log(topic)
  }, [topic])

  
  const checkAns = () => {
    let correct = false
    let chooseAns = ""
    let ans = 0
    for (let i = 0; i < optionList.length; i++){
      if (optionList[i].status === "chosen") {

        if (optionList[i].value === answer.value) {
          correct = true
          setChecked(false)
          chooseAns = -1
          setScore(score+1)
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
      if (optionList[i].id === answer.id) {
        blue = optionList[i]
        blue.color = "blue"
        newList.push(blue)
      }
      if (optionList[i].id === chooseID) {
        red = optionList[i]
        red.color = "red"
        newList.push(red)
      }
      if (optionList[i].id !== answer.id && optionList[i].id !== chooseID) {
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
            <select onChange={(e) => { getBookID(e) }} className="bookSelect">
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
      <div style={{ display: start ? "none" : "block" }} className="quizContainer">
        <div className="score">計分</div>

        <QuizContext.Provider value={{ chooseItem, unChooseItem }}>
        
        <QuizArea topic={topic}>
          {
          optionList
            .map((option, i) => {
              if (option.status === "chosen") {
                return (
                  <QuizOption key={i} i={i} word={option.value} id={option.id} color={option.color} checked={checked} />
                )
              }
            })
          }
          </QuizArea>
          
          <AnsArea>
            {
              optionList
                .map((option, i) => {
                  if (option.status === "unchoose") {
                    return (
                      <QuizOption key={i} i={i} word={option.value} id={option.id} color={option.color} checked={checked} />
                    )
                  }
                })
            }
          </AnsArea>

        </QuizContext.Provider>

        <div onClick={checkAns}>送出</div>
        <div onClick={() => {setPage(page + 2)}}>下一題</div>
        <div onClick={() => { alert('單字用罄，結束測驗，分數是： ' + score)}}>結束測驗</div>
      
      </div>
    </div>
    
  )
}








export default QuizMatch