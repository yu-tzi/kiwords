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
        <QuizContainer showBook={this.props.showBook} />
      </DndProvider>
    )
  }
}

const ItemTypes = {
  Option: 'option'
}


const QuizOption = (props) => {

  const [{ isDragging, canDrag }, drag] = useDrag({
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
        backgroundColor: isDragging ? "rgb(39, 98, 116)" : "rgb(43, 39, 39)",
        cursor: isDragging ? "grabbing" : 'grab',
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
        backgroundColor: isOver ? "lightgrey" : "whitesmoke"
      }}
      className="optionDrop"
    >
      <div></div>
      {props.children}
    </div>
  )
}


const QuizArea = (props) => {

  const { chooseItem } = useContext(QuizContext);

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.Option,
    drop: (item, monitor) => { chooseItem(item.id) },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    })
  })

  return (
    <div className="topic-container">

      <div>The Synonym of</div>
      <div>{" "+props.topic+" "}</div>
      <div>{" " + "is"}</div>
      <div
        ref={drop}
        style={{
          backgroundColor: isOver ? "lightgrey" : "whitesmoke"
        }}
        className="answerDrop"
      >
        {props.children}
      </div>

      {/* props.topic */}

    </div>
  )
}



//====create context====

const QuizContext = createContext({
  chooseItem: null,
  unChooseItem: null
});

const QuizContainer = (props) => {

  //detect wordbook when you come in 

  /* let url = "https://kiwords-c058b.web.app/quiz?159585446911785aFFbQvKxZmidyhpfaKGrl2uPL2&TOEIC%20essential%20words" */

  let url = window.location.href


  let defalutValue = " "
  let defalutBook = ""
  let hasDefaultOption = false
  if (url.split("?").length > 1) {
    let target = ""
    target = url.split("?")[1].split("&")
    defalutValue = target[0]
    defalutBook = decodeURI(target[1])
    hasDefaultOption = true
  }

  //tutor pop
  const [bookIDpop, setBookIDpop] = useState(true)
  useEffect(() => { console.log("bookIDpop:" + bookIDpop) }, [bookIDpop])

  const [tutorPop, setTutorPop] = useState(false)
  useEffect(() => { console.log("tutorPop:" + tutorPop) }, [tutorPop])

  const [bookName, setBookName] = useState(defalutBook)
  useEffect(() => { console.log("bookName:" + bookName) }, [bookName])

  const [checked, setChecked] = useState([true])

  const [hasOption, setHasOption] = useState(hasDefaultOption)
  useEffect(() => { console.log("hasOption:" + hasOption) }, [hasOption])

  const [validWords, setvalidWords] = useState(0)
  useEffect(() => { console.log(validWords) }, [validWords])


  //bookID select form
  const [bookID, setBookID] = useState(defalutValue)


  useEffect(() => {
    let str = bookID
    console.log(str.length)
    if (str.length > 5) {
      //what to do when firstly detect bookID chosen

      setPage(0)
      setScore(0)
      setTopicCount(0)
      setEnd(false)
      setChecked(true)

      console.log(bookID)

      db.collection("books").doc(bookID).get().then((doc) => {
        
        let options = []
        let validWords = []
        let answers = []
        console.log(doc.data())

        if (doc.data().cards.length > 0) {
          for (let i = 0; i < doc.data().cards.length; i++) {

            if (typeof (doc.data().cards[i].synonyms) === "object") {
              if (doc.data().cards[i].synonyms.length > 2) {
                if (typeof (doc.data().cards[i].antonym) === "object") {
                  if (doc.data().cards[i].antonym.length > 2) {
                    validWords.push(doc.data().cards[i])
                  }
                } else {
                  if (doc.data().cards[i].antonym.split(",").length > 2) {
                    validWords.push(doc.data().cards[i])
                  }
                }
              }
            } else {
              if (doc.data().cards[i].synonyms.split(",").length > 2) {
                if (typeof (doc.data().cards[i].antonym) === "object") {
                  if (doc.data().cards[i].antonym.length > 2) {
                    validWords.push(doc.data().cards[i])
                  }
                } else {
                  if (doc.data().cards[i].antonym.split(",").length > 2) {
                    validWords.push(doc.data().cards[i])
                  }
                }
              }
            }
          }
        }
        console.log(validWords)
        setvalidWords(validWords)

      
        //set round1 data- ans option topicContent
        let order = [0, 1, 2]
        if (validWords.length > 0) {
          for (let i = 0; i < 3; i++) {
            let option
            if (i < 1) {
              let ord = Math.floor(Math.random() * order.length)
              let word = validWords[0].word
              option = {
                id: order[ord],
                value: word,
                status: "unchoose",
                color: "white"
              }
              let answer = {
                id: order[ord],
                value: word,
                status: "unchoose",
                color: "white"
              }
              answers.push(answer)
              order.splice(ord, 1)
            } else {
              if (typeof (validWords[0].antonym) === "object") {
                let ord = Math.floor(Math.random() * order.length)
                let ant = validWords[0].antonym
                let antOr = Math.floor(Math.random() * ant.length)
             
                option = {
                  id: order[ord],
                  value: ant[antOr],
                  status: "unchoose",
                  color: "white"
                }
                order.splice(ord, 1)
                ant.splice(antOr, 1)
              } else {
                let ord = Math.floor(Math.random() * order.length)
                let ant = validWords[0].antonym.split(',')
                let antOr = Math.floor(Math.random() * ant.length)
              
                option = {
                  id: order[ord],
                  value: ant[antOr],
                  status: "unchoose",
                  color: "white"
                }
                order.splice(ord, 1)
                ant.splice(antOr, 1)
              }
            }
            console.log("order:" + order)
            options.push(option)
            console.log(options.sort(function (a, b) { return a.id - b.id }))
            console.log(answers)
            setAnswer(answers)
            setOptionList(options.sort(function (a, b) { return a.id - b.id }))
          }


          let synsContent = ""
          for (let i = 0; i < 2; i++) {
            if (typeof (validWords[0].synonyms) === "object") {
              if (i < 1) {
                synsContent = synsContent + validWords[0].synonyms[i]
              } else {
                synsContent = synsContent + "," + validWords[0].synonyms[i]
              }
            } else {
              let syns = validWords[0].synonyms.split(",")
              if (i < 1) {
                synsContent = synsContent + syns[i]
              } else {
                synsContent = synsContent + "," + syns[i]
              }
            }
          }
        
          
        setTopic(synsContent)
        console.log(synsContent)
        }
      } 
      ).catch((error) => {
        alert(error)
      })
    }
  }, [bookID]);
  const [start, setStart] = useState([false])

//來測 next page
  const [page, setPage] = useState(0)
  useEffect(() => {
    let str = bookID
    console.log(str.length)
    if (str.length > 5) {

   
      db.collection("books").doc(bookID).get().then((doc) => {

        let options = []
        let validWords = []
        let answers = []


        if (doc.data().cards.length > 0) {
          for (let i = 0; i < doc.data().cards.length; i++) {

            if (typeof (doc.data().cards[i].synonyms) === "object") {
              if (doc.data().cards[i].synonyms.length > 2) {
                if (typeof (doc.data().cards[i].antonym) === "object") {
                  if (doc.data().cards[i].antonym.length > 2) {
                    validWords.push(doc.data().cards[i])
                  }
                } else {
                  if (doc.data().cards[i].antonym.split(",").length > 2) {
                    validWords.push(doc.data().cards[i])
                  }
                }
              }
            } else {
              if (doc.data().cards[i].synonyms.split(",").length > 2) {
                if (typeof (doc.data().cards[i].antonym) === "object") {
                  if (doc.data().cards[i].antonym.length > 2) {
                    validWords.push(doc.data().cards[i])
                  }
                } else {
                  if (doc.data().cards[i].antonym.split(",").length > 2) {
                    validWords.push(doc.data().cards[i])
                  }
                }
              }
            }
          }
        }
        console.log(validWords)
        setvalidWords(validWords)


        //set round1 data- ans option topicContent
        let str = bookID
        if (str.length > 5) {
          console.log(page)

          if (validWords.length <= page) {
            alert('Theres no other words, your score is : ' + score)
            setEnd(true)
          } else {
            let order = [0, 1, 2]
            for (let i = 0; i < 3; i++) {
              let option
              if (i < 1) {
                let ord = Math.floor(Math.random() * order.length)
                let word = validWords[page].word
                option = {
                  id: order[ord],
                  value: word,
                  status: "unchoose",
                  color: "white"
                }
                let answer = {
                  id: order[ord],
                  value: word,
                  status: "unchoose",
                  color: "white"
                }
                answers.push(answer)
                order.splice(ord, 1)
              } else {
                if (typeof (validWords[page].antonym) === "object") {
                  let ord = Math.floor(Math.random() * order.length)
                  let ant = validWords[page].antonym
                  let antOr = Math.floor(Math.random() * ant.length)

                  option = {
                    id: order[ord],
                    value: ant[antOr],
                    status: "unchoose",
                    color: "white"
                  }
                  order.splice(ord, 1)
                  ant.splice(antOr, 1)
                } else {
                  let ord = Math.floor(Math.random() * order.length)
                  let ant = validWords[page].antonym.split(',')
                  let antOr = Math.floor(Math.random() * ant.length)

                  option = {
                    id: order[ord],
                    value: ant[antOr],
                    status: "unchoose",
                    color: "white"
                  }
                  order.splice(ord, 1)
                  ant.splice(antOr, 1)
                }
              }
              console.log("order:" + order)
              options.push(option)
              console.log(options.sort(function (a, b) { return a.id - b.id }))
              console.log(answers)
              setAnswer(answers)
              setOptionList(options.sort(function (a, b) { return a.id - b.id }))
              setChecked(true)
            }
          }


          let synsContent = ""
          if (validWords.length <= page) {
          
          } else {
            for (let i = 0; i < 2; i++) {
              if (typeof (validWords[page].synonyms) === "object") {
                if (i < 1) {
                  synsContent = synsContent + validWords[page].synonyms[i]
                } else {
                  synsContent = synsContent + "," + validWords[page].synonyms[i]
                }
              } else {
                let syns = validWords[page].synonyms.split(",")
                if (i < 1) {
                  synsContent = synsContent + syns[i]
                } else {
                  synsContent = synsContent + "," + syns[i]
                }
              }
            }
          }


          setTopic(synsContent)
          console.log(synsContent)
        }
      

      }
      ).catch((error) => {
        alert(error)
      })
    }
  }, [page]); 
  //====
    

  const [score, setScore] = useState(0)
  useEffect(() => {
    console.log("score : " + score)
  }, [score])

  const [topic, setTopic] = useState(0)
  useEffect(() => {
    console.log("topic : " + topic)
  }, [topic])


  const [sendSwitch, setSendSwitch] = useState(false)
  useEffect(() => {
    console.log(sendSwitch)
  }, [sendSwitch])


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

  const [topicCount, setTopicCount] = useState([""])
  useEffect(() => {
    console.log(topicCount)
  }, [topicCount])

  const [end, setEnd] = useState(false)
  useEffect(() => {
    console.log(end)
  }, [end])

  const checkAns = () => {
    console.log(" checkAns")
    let correct = false
    let chooseAns = ""
    let ans = 0
    for (let i = 0; i < optionList.length; i++) {
      if (optionList[i].status === "chosen") {
        console.log(optionList)
        console.log(answer)

        if (optionList[i].value === answer[0].value) {
          correct = true
          setChecked(false)
          chooseAns = -1
          setScore(score + 1)
          setTopicCount(topicCount + 1)
          alert('正確答案')
        } else {
          chooseAns = optionList[i].id
          setChecked(false)
          setTopicCount(topicCount + 1)
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

    for (let i = 0; i < optionList.length; i++) {

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
      let white
      console.log(i)
      if (optionList[i].id === answer[0].id) {
        blue = optionList[i]
        blue.color = "blue"
        newList.push(blue)
        console.log(blue)

      }
      if (optionList[i].id === chooseID) {
        red = optionList[i]
        red.color = "red"
        newList.push(red)
        console.log(red)
      }
      if (optionList[i].id !== answer[0].id && optionList[i].id !== chooseID) {
        white = optionList[i]
        newList.push(white)
        console.log(white)
      }
    }
    console.log(newList)
    setOptionList(newList)
    
  }


  const getBookID = (e) => {
    console.log(e.target.value)
    if (e.target.value !== " ") {
      setBookID(e.target.value)
      setHasOption(true)
      setStart(false)
      for (let i = 0; i < props.showBook.length; i++){
        if (e.target.value === props.showBook[i].bookID) {
          setBookName(props.showBook[i].bookName)
        }
      }
      
    } else {
      setBookID(" ")
      setBookName("")
      setStart(true)
      setHasOption(false)
      setvalidWords("")
    }

  }

  const showBookID = (data, i) => {
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

        /* let url = "https://kiwords-c058b.web.app/quiz?159585446911785aFFbQvKxZmidyhpfaKGrl2uPL2&TOEIC%20essential%20words" */
        
        let url = window.location.href

        let target = ""
        let defalutValue = " "
        if (url.split("?").length > 1) {
          
          target = url.split("?")[1].split("&")
          defalutValue = target[0]
          
        //target[0] = ID
        //decodeURI(target[1]) = book name
        }
        

        


        return (
          <div className="enterPop" style={{ display: bookIDpop || tutorPop ? "block" : "none" }}>
            
          <div className="bookIDpop" style={{ display: bookIDpop ? "block" : "none" }}>
              
            <div className="bookIDpopBox">
            <div className="bookIDpopTitle">Step1</div> 
            <div className="bookIDpopSubtitle">Select WordBook As Quiz Resources</div> 
            {/* <div className="bookPopX" onClick={() => { setBookIDpop(false)}}>X</div> */}
              <select onChange={(e) => { getBookID(e) }} className="bookSelect" defaultValue={defalutValue}>
              <option key={props.showBook.length + 1} value=" " >———— Please choose one wordbook ————</option>
              {all}
            </select>
              <div className="bookPopSend" onClick={() => {
                if (bookName === "" || bookID===" ") {
                  alert('Please Select one book :)')
                } else {
                  setBookIDpop(false), setTutorPop(true)
                }
                }}
                  style={{ display: validWords.length > 0 || !hasOption ? "block" : "none" }}
                >Send</div>

                <div className="bookPopCreateWording" style={{ display: hasOption? "none":"block"}}>No option ? Try :</div>
                <div className="bookPopCreate" onClick={() => { window.location.href = ("https://kiwords-c058b.web.app/wordbooks") }} style={{ display: hasOption ? "none" : "block" }}>Create wordbook</div>

                <div className="validWords" style={{ display: hasOption ? "block" : "none" }}>
                  <div className="usableWords" >{"Useable wordcards in this book : " + validWords.length}</div>
                  <div className="usableWordsWording" style={{ display: validWords.length > 0 ? "none" : "block" }}>Add words with more then 2 synonyms and antonyms ! </div>
                  <div className="usableWordsCreate" onClick={() => { window.location.href = ("https://kiwords-c058b.web.app/addwords?" + target[0] + " & " + decodeURI(target[1])) }} style={{ display: validWords.length > 0 ? "none" : "block" }}>Add Words</div>
                  </div>
            </div>

            </div>

            <div className="tutorPop" style={{ display: tutorPop ? "block" : "none" }}>
              
              <div className="tutorPopBox">
                <div className="tutorPopTitle">Step2</div>
                  <div className="tutorPopSubtitle">Watch Quick Tutorial</div> 
                  <iframe src="https://giphy.com/embed/Ol2yHMEFJdYEo" width="480" height="270" frameBorder="0" allowFullScreen></iframe>
                  <div className="tutorPopBtn" onClick={() => { setTutorPop(false) }}>Start Game</div> 
              </div>

            </div>            

          </div>
        )
      }
    }
  }

  const endQuiz = () => {
    alert('單字用罄，結束測驗，分數是： ' + score)
    setEnd(true)
  }

  /* const [end, setEnd] = useState(false) */
/* <div style={{ display: start ? "none" : "block" }} className="quizContainer"> */
  /* <div className="quizArea" style={{ display: end ? "none" : "block" }}> */
  
  
  return (
    <div className="quizContainer">
      <div className="bookIDpopBtn" onClick={() => { setBookIDpop(true) }}>{bookName === "" ? "Please Choose One of Your Wordbook" : "Now in : " + bookName}</div>
      {renderBookID()}

      
        
          {/* <div className="score">目前分數 : {score}</div> */}

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
 

      {/* setSendSwitch */}
      <div className="next" style={{ display: sendSwitch ? "block" : "none" }} onClick={() => { setPage(page + 1),setSendSwitch(false) }}>NEXT</div>
      <div onClick={() => { checkAns(), setSendSwitch(true) }} className="send" style={{ display: sendSwitch ? "none":"block"}}>SEND</div>
      <div onClick={() => { endQuiz()}} className="end-quiz" >QUIT</div>
           
         
        

        <div className="endQuiz" style={{ display: end ? "block" : "none" }}>
          <div className="yourScore">你的分數是</div>
          <div className="scoreIs">{score + "/" + topicCount}</div>

        </div>

      
    </div>

  )
}








export default QuizMatch