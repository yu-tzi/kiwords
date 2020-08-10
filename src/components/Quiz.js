import React from "react";
import { useState, createContext, useContext, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { firebase , db } from "../utility/firebaseConfig"
import MultiBackend from 'react-dnd-multi-backend';
import HTML5toTouch from 'react-dnd-multi-backend/dist/esm/HTML5toTouch';
import '../style/Quiz.scss';

class Quiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  render() {
    return (
      <DndProvider backend={MultiBackend} options={HTML5toTouch}>
        <QuizContainer showBook={this.props.showBook} userData={this.props.userData}/>
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
    >{props.word}
    </div>
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
        backgroundColor: isOver ? "whitesmoke" : "#4d5165"
      }}
      className="optionDrop">
      <div>
      </div>
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
      
      <div>
        <div>The synonym of
        </div>
        <div>{props.topic}
        </div>
      </div>

      <div>
        <div>is
        </div>
        <div
          ref={drop}
          style={{
            backgroundColor: isOver ? "whitesmoke" : "#24293c"
          }}
          className="answerDrop">
          {props.children}
        </div>
        <div>.
        </div>
      </div>

    </div>
  )
}

const QuizContext = createContext({
  chooseItem: null,
  unChooseItem: null
})

const QuizContainer = (props) => {

  let url = window.location.href
  let defalutValue = ""
  let defalutBook = ""
  let hasDefaultOption = false
  if (url.split("?").length > 1) {
    let target = ""
    target = url.split("?")[1].split("&")
    defalutValue = target[0]
    defalutBook = decodeURI(target[1])
    hasDefaultOption = true
    
  }

  const [bookIDpop, setBookIDpop] = useState(true)
  const [tutorPop, setTutorPop] = useState(false)
  const [bookName, setBookName] = useState(defalutBook)
  const [checked, setChecked] = useState(true)
  const [hasOption, setHasOption] = useState(hasDefaultOption)
  const [firstRound, setfirstRound] = useState(false)
  const [start, setStart] = useState([false])
  const [score, setScore] = useState(0)
  const [topic, setTopic] = useState(0)
  const [sendSwitch, setSendSwitch] = useState(false)
  const [optionList, setOptionList] = useState([""])
  const [answer, setAnswer] = useState([""])
  const [topicCount, setTopicCount] = useState([""])
  const [mouseHover, setMouseHover] = useState(false)


  const [validWords, setvalidWords] = useState(0)
  useEffect(() => {
    setfirstRound(true)
    if (validWords.length>=1 && page<0) {
      setPage(0)
    }
  })
  
  const [bookID, setBookID] = useState(defalutValue)
  useEffect(() => {
    let str = bookID
    if (str.length > 5) {

      //set data when firstly detect bookID chosen
      setScore(0)
      setTopicCount(0)
      setEnd(false)
      setChecked(true)

      db.collection("books").doc(bookID).get()
        .then((doc) => {

        let validWords = []
        if (doc.data().cards.length > 0) {
          for (let i = 0; i < doc.data().cards.length; i++) {
            //check if having enough antonyms and synonyms
            let synonyms = doc.data().cards[i].synonyms
            let antonyms = doc.data().cards[i].antonym
            let isSynonymsObjectBigEnough = typeof (synonyms) === "object" && synonyms.length > 2
            let isAntonymsObjectBigEnough = typeof (antonyms) === "object" && antonyms.length > 2
            let isSynonymsStringBigEnough = synonyms.toString().split(",").length > 2
            let isAntonymsStringBigEnough = antonyms.toString().split(",").length > 2

            if (
              isSynonymsObjectBigEnough && isAntonymsObjectBigEnough ||
              isSynonymsObjectBigEnough && isAntonymsStringBigEnough ||
              isSynonymsStringBigEnough && isAntonymsStringBigEnough ||
              isSynonymsStringBigEnough && isAntonymsObjectBigEnough
            ) {
              validWords.push(doc.data().cards[i])
            }
          }
        }
          setvalidWords(validWords)
        }
      )          
      .catch((error) => {
        alert(error)
      })
    }
  }, [bookID]);

  const [page, setPage] = useState(-1)
  useEffect(() => {
    //set question & ans
    let str = bookID
    let options = []
    let answers = []
    if (str.length > 5 && firstRound && page>= 0) {
          if (validWords.length <= page) {
            setEnd(true)
          } else {
            let order = [0, 1, 2]
            for (let i = 0; i < 3; i++) {
              let option
              let answer
              let ord = Math.floor(Math.random() * order.length)//assign id ramdomly
              if (i < 1) { //push answer first
                let word = validWords[page].word
                let obj = {
                  id: order[ord],
                  value: word,
                  status: "unchoose",
                  color: "white"
                }
                option = obj
                answer = obj
                order.splice(ord, 1)
                answers.push(answer)
              } else { //then push other two options
                let ant 
                if (typeof (validWords[page].antonym) === "object") {
                  ant = validWords[page].antonym
                } else {
                  ant = validWords[page].antonym.split(',')
                }
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
              options.push(option)
            }
            let synsContent = ""
            //set question content
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
            setAnswer(answers)
            setOptionList(options.sort(function (a, b) { return a.id - b.id }))//order based on id
            setChecked(true)
            setTopic(synsContent)
          }
        }
  }, [page]); 
    
  const [end, setEnd] = useState(false)
  useEffect(() => {
    if (end) {
      let nowTime = new Date().getTime()
      let quizHis = {
        nowTime: nowTime,
        topicCount: topicCount
      }
      let uid = props.userData[0]?.uid
      db.collection("users").doc(uid).update({
        userExp: firebase.firestore.FieldValue.arrayUnion(quizHis)
      });
    }
  }, [end])

  const checkAns = () => {
    let correct = false
    let chooseAns = ""
    let ans = 0
    for (let i = 0; i < optionList.length; i++) {
      if (optionList[i].status === "chosen") {
        if (optionList[i].value === answer[0].value) {
          correct = true
          setChecked(false)
          chooseAns = -1
          setScore(score + 1)
        } else {
          chooseAns = optionList[i].id
          setChecked(false)
        }
      } else {
        ans += 1
      }

      if (ans > 2) {
        alert('Please drag the block below and drop in the question-blank.')
      } else {
        SendItem(chooseAns)
        setTopicCount(topicCount + 1)
      }
    }
  }

  const chooseItem = (id) => {
    let newList = []
    let chosenStuff = ""
    let unChooseStuff = ""

    for (let i = 0; i < optionList.length; i++) {
      if (optionList[i].id === id) {
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
    setOptionList(newList)
  }

  const unChooseItem = (id) => {
    let newList = []
    let unChooseStuff = ""
    for (let i = 0; i < optionList.length; i++) {
      if (optionList[i].id === id) {
        unChooseStuff = optionList[i]
        unChooseStuff.status = "unchoose"
        newList.push(unChooseStuff)
      }
      if (optionList[i].id !== id) {
        newList.push(optionList[i])
      }
    }
    setOptionList(newList)
  }

  const SendItem = (chooseID) => {
    let newList = []
    for (let i = 0; i < optionList.length; i++) {
      let blue
      let red
      let white
      if (optionList[i].id === answer[0].id) {
        blue = optionList[i]
        blue.color = "rgb(77, 155, 255)"
        newList.push(blue)
      }
      if (optionList[i].id === chooseID) {
        red = optionList[i]
        red.color = "#ff5f5f"
        newList.push(red)
      }
      if (optionList[i].id !== answer[0].id && optionList[i].id !== chooseID) {
        white = optionList[i]
        newList.push(white)
      }
    }
    setOptionList(newList)
  }

  const getBookID = (e) => {
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
      <option key={i} value={data.bookID}>{data.bookName}
      </option>
    )
  }

  const renderBookSelecter = () => {
    if (props.showBook.length >= 0) {
      let all = []
      let count = 0
      for (let i = 0; i < props.showBook.length; i++) {
        all.push(showBookID(props.showBook[i], i))
        count++
      }

      if (count == props.showBook.length) {
        return (

          <div className="bookIDpopBox">
            
            <div className="bookIDpopTitle">Step1
            </div>
            <div className="bookIDpopSubtitle" >Select WordBook As Quiz Resources
            </div>
            <select className="bookSelect" value={bookID}
              onChange={(e) => {
                getBookID(e)
              }}>
              <option key={props.showBook.length + 1} value=" " >———— Please choose one wordbook ————
              </option>
              {all}
            </select>
            <div className="bookPopSend"
              onClick={() => {
                if (bookName === "" || bookID === " ") {
                  alert('Please Select one book :)')
                } else {
                  setBookIDpop(false), setTutorPop(true)
                }
              }}
              style={{
                display: validWords.length > 0 || !hasOption ? "block" : "none"
              }}>Next
            </div>

            <div className="bookPopCreateWording"
              style={{
                display: hasOption ? "none" : "block"
              }}>No option ? Try :
            </div>

            <div className="bookPopCreate"
              onClick={() => {
                window.location.href = ("https://kiwords-c058b.web.app/wordbooks")
              }}
              style={{
                display: hasOption ? "none" : "block"
              }}>Create wordbook
            </div>

            <div className="validWords"
              style={{
                display: hasOption ? "block" : "none"
              }}>
              <div className="usableWords" >{"Useable wordcards in this book : " + validWords.length}
              </div>
              <img src="https://i.imgur.com/hMFZm19.png" className="infoIcon"
                style={{
                  display: validWords.length > 0 ? "block" : "none"
                }}
                onMouseEnter={() => {
                  setMouseHover(true)
                }}
                onMouseLeave={() => {
                  setMouseHover(false)
                }}>
              </img>
              <div className="infobox" style={{ display: mouseHover ? "block" : "none" }}>Only word cards with more then 2 synonyms and antonyms can be used to generate quiz content.
              </div>
              <div className="usableWordsWording"
                style={{
                  display: validWords.length > 0 ? "none" : "block"
                }}>Add words with more then 2 synonyms and antonyms !
              </div>

              <div className="usableWordsCreate"
                onClick={() => {
                  window.location.href = ("https://kiwords-c058b.web.app/addwords?" + bookID + " & " + bookName )
                }}
                style={{
                  display: validWords.length > 0 ? "none" : "block"
                }}>Add Words
              </div>
            </div>

          </div>
        )
      }
    }
  }

  const renderTutorPop = () => {
    return (
      <div className="enterPop"
        style={{
          display: bookIDpop || tutorPop ? "block" : "none"
        }}>

        <div className="bookIDpop"
          style={{
            display: bookIDpop ? "block" : "none"
          }}>
          {renderBookSelecter()}
        </div>
        <div className="tutorPop" style={{ display: tutorPop ? "block" : "none" }}>
          <div className="tutorPopBox">
            <div className="tutorPopTitle">Step2
            </div>
            <div className="tutorPopSubtitle">Quick Tutorial
            </div> 
            <img src="https://i.imgur.com/npqeJsW.gif" >
            </img>
            <div className="tutorPopBtn" onClick={() => { 
              setTutorPop(false)
            }}>Start
            </div> 
          </div>
        </div> 
        
      </div>
    )
  }

  const endQuiz = () => {
    setEnd(true)
  }

  const endQuizRender = () => {
    return (
      <div className="endQuizRender">
        <div className="btnBlock"
          style={{
            display: end ? "none" : "flex"
          }}>
          <div className="next"
            style={{
              display: sendSwitch ? "block" : "none"
            }}
            onClick={() => {
              setPage(page + 1), setSendSwitch(false)
            }}>Next
          </div>
          <div className="send"
            style={{
              display: sendSwitch ? "none" : "block"
            }}
            onClick={() => {
              checkAns(), setSendSwitch(true)
            }}>Send
          </div>
          <div className="end-quiz"
            onClick={() => {
              endQuiz()
            }}>Quit Quiz
          </div>
        </div>

        <div className="endQuiz"
          style={{
            display: end ? "flex" : "none"
          }}>
          <div className="yourScoreTitle">Quiz finished !
          </div>
          <div className="yourScore">Your Score :
          </div>
          <div className="scoreIs">{score + "/" + topicCount}
          </div>
        </div>

        <div className="yourScorebtnblock">
          <div className="yourScorebtn"
            style={{
              display: end ? "flex" : "none"
            }}
            onClick={() => {
              window.location.href = ("https://kiwords-c058b.web.app/details/" + bookID + "?" + bookName)
            }}>Review wordcards
          </div>
          <div className="yourScorebtnCheck"
            style={{
              display: end ? "flex" : "none"
            }}
            onClick={() => {
              window.location.href = ("https://kiwords-c058b.web.app/dashboard")
            }}>See achievements
          </div>
        </div>
      </div>
    )
  }

  let questionCount = topicCount + 1
  return (
    <div className="quizContainer">
      <div className="bookIDpopBtn"
        onClick={() => {
          setBookIDpop(true)
        }}>
        {bookName === "" ? "Please Choose One of Your Wordbook" : "Resources :  " + bookName}
      </div>
      {renderTutorPop()}

      <QuizContext.Provider value={{ chooseItem, unChooseItem }}>
        
        <div className="questionArea"
          style={{
            display: end ? "none" : "block"
          }}>
          <div className="questionBlock">
            <div className="questionTitle">
              {"Question " + questionCount}
            </div>
          </div>
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
        </div>

        <div className="optionArea"
          style={{
            display: end ? "none" : "block"
          }}>
          <div className="optionBlock">
            <div className="optionSubTitle">
              Drag the block to fill the question-blank upside.
            </div>
          </div>
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
        </div>

      </QuizContext.Provider>

      {endQuizRender()}

    </div>
  )
}

export default Quiz