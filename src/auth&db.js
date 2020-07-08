import React from "react";
import RouteNav from "./route"
import { db, firebase } from "./firebaseConfig"


//================== Auth + DB setting ================

class Auth extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: "", //for passing input data 
      password: "", //for passing input data 
      name: "",
      logIn: false,
      userData: [],
      memberImg: "",
      memberImgWord: "",
      memberEmail: "",
      showBook: "",
      popularBook: "",
      popularBookScore: "",
      topThreeName:""
    };

    
    this.passingEmail = this.passingEmail.bind(this)
    this.passingPassword = this.passingPassword.bind(this)
    this.passingName = this.passingName.bind(this)
    this.handleSignUp = this.handleSignUp.bind(this)
    this.handleSignIn = this.handleSignIn.bind(this)
    this.storeToUser = this.storeToUser.bind(this)
    this.manageUserData = this.manageUserData.bind(this)
  

  }

//================== state change : log state swith & DB get item ================
  
  componentDidMount() {

    console.log('initial render detected')
    firebase.auth().onAuthStateChanged((user) => {
      console.log("onAuthStateChanged?")

      if (user) {
        console.log("login")
        this.setState({ logIn: true })
        this.setState({ userData: [user] })

        let uid
        uid = user.uid
        db.collection("users").where("uid", "==", uid)
          .get()
          .then((querySnapshot)=> {
            querySnapshot.forEach((doc)=> {

              console.log(doc.id, " => ", doc.data());
              this.setState({ memberImg: doc.data().image })
              this.setState({ memberImgWord: doc.data().name })
              console.log(this.state.memberImg)
              this.setState({ memberEmail: doc.data().email })
             

            });
          })
          .catch(function (error) {
            console.log("Error getting documents: ", error)
          });
        
        //get book data
          let showBook = []

          db.collection("books").where("created", "==", user.uid).get().then((doc) => {
            if (doc) {
              doc.forEach((doc) => {
                showBook.push(doc.data().bookName)
              })
              this.setState({showBook: showBook})
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }
          }).catch(function (error) {
            console.log("Error getting document:", error);
          });

        
        //get popular book data
          //get top 3 book id
        db.collection("books").get().then((doc) => {
          let container = []
          if (doc) {
              doc.forEach(callback)
              function callback(doc) {
                container.push(doc.data())
            }
            console.log(container)
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }

          let topThreeID =[]
          let topThreeScore = []
          let topThreeName = []

          //take off book you have
          if (this.state.logIn) {
            for (let k = 0; k < container.length; k++) {
              console.log("hi")
              for (let m = 0; m < this.state.showBook.length; m++) {
                console.log("book")
                let book = container[k].bookName
                if (book.includes(this.state.showBook[m])) {
                  container.splice(k, 1)
                }
              }

            }
          }

          for (let j = 0; j < 3; j++) {

            let largest = 0
            let largestID = []
            let largestName = ""
            let total = 0
            let average = 0
            let index = ""

            for (let i = 0; i < container.length; i++) {
            
              if (container[i].evaluation.length > 0) {
                total = 0
                for (let y = 0; y < container[i].evaluation.length; y++) {
                  total += container[i].evaluation[y]
                }
                average = total / container[i].evaluation.length
              } else {
                average = 0
              }


                if (average >= largest) {
                  largest = average
                  largestID = container[i].bookID
                  largestName = container[i].bookName
                  index = i
                }
              
            }

            topThreeID.push(largestID)
            topThreeScore.push(largest)
            topThreeName.push(largestName)
            container.splice(index, 1)
            console.log(container.length)

          }
          
          console.log(topThreeID)
          console.log(topThreeScore)
          this.setState({ popularBook: topThreeID })
          this.setState({ popularBookScore: topThreeScore })
          this.setState({ topThreeName: topThreeName})

        }).catch(function (error) {
          console.log("Error getting document:", error);
        });


        

      } else {
        console.log("logout")
        this.setState({ logIn: false })
        this.setState({ userData: [] }) 

        db.collection("books").get().then((doc) => {
          let container = []
          if (doc) {
            doc.forEach(callback)
            function callback(doc) {
              container.push(doc.data())
            }
            console.log(container)
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }

          let topThreeID = []
          let topThreeScore = []
          let topThreeName = []

        
          for (let j = 0; j < 3; j++) {

            let largest = 0
            let largestID = []
            let largestName = ""
            let total = 0
            let average = 0
            let index = ""

            for (let i = 0; i < container.length; i++) {

              if (container[i].evaluation.length > 0) {
                total = 0
                for (let y = 0; y < container[i].evaluation.length; y++) {
                  total += container[i].evaluation[y]
                }
                average = total / container[i].evaluation.length
              } else {
                average = 0
              }


              if (average >= largest) {
                largest = average
                largestID = container[i].bookID
                largestName = container[i].bookName
                index = i
              }

            }

            topThreeID.push(largestID)
            topThreeScore.push(largest)
            topThreeName.push(largestName)
            container.splice(index, 1)
            console.log(container.length)

          }

          console.log(topThreeID)
          console.log(topThreeScore)
          this.setState({ popularBook: topThreeID })
          this.setState({ popularBookScore: topThreeScore })
          this.setState({ topThreeName: topThreeName })

        }).catch(function (error) {
          console.log("Error getting document:", error);
        });

      }
    });  

  }

  


//================== log functions ================

  
  passingName() {
    this.setState({ name: event.target.value });
    
  }

  passingEmail() {
    this.setState({ email:event.target.value});
  }


  passingPassword() {
    this.setState({ password: event.target.value});
  }

  handleSignUp(event) {
    console.log(this.state.logIn)
    if (this.state.logIn) {
      alert('you have already signin in!')
      event.preventDefault();
    } else {
      event.preventDefault();
      console.log(this.state.name)
      alert('A name was submitted: ' + this.state.name);
      firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((res) => {
          console.log(res)
          this.setState({userData:res})
          event.persist();
          this.manageUserData(this.state.userData, this.state.name)
        })
        .catch((err) => {
          alert(err.message)
          console.log(err.message)
          event.persist();
        })
    }
  }

 
  handleSignIn(event) {
    console.log(this.state.logIn)
    if (this.state.logIn) {
      alert('you have already signin in!')
      event.preventDefault();
    } else {
      alert('handle signin activated!');
      event.preventDefault();
      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((res) => {
          console.log(res)
          event.persist();
          window.location.href = "/"
        })
        .catch((err) => {
          alert(err.message)
          console.log(err)
          event.persist();
        })
    }
  }

  //================== DB functions ================
  manageUserData(userData, name) {
    console.log(userData)
    console.log(name)
    console.log(userData.user.uid)
    console.log(userData.user.email)
    

    let nameEdited

    if (userData.user.displayName === null) {
      nameEdited = name
    } else {
      nameEdited = userData.user.displayName
    }

    let image = ""

    if (userData.user.photoURL===null) {
      image = ""
    } else if (userData.user.photoURL.includes("google")) {
      image = userData.user.photoURL
    }else if (userData.user.photoURL.includes("facebook")) {
      image = userData.user.photoURL + "?height=500"
    }

    console.log(nameEdited)


    let data = []
    data =

    {
      uid: userData.user.uid,
      email: userData.user.email,
      name: nameEdited,
      image: image,
      ownedBook: [],
      savedBook: [],
      userExp: {
        quizHis: [
          /* {
            time: "time-1",
            score: "score-1"
          } */
        ],
        likeBook: [
          /* {
            bookID: "likebook-1",
            bookScore: "bookScore-1"
          } */
        ],
        addCards: [
          /* {
            time: "time-1",
            amount: "amount-1"
          } */
        ]
      }
    }
    //send data
    console.log(data)
    alert('store to data!')
    this.storeToUser(data)
  } 


  storeToUser(data) {
    console.log('storeToUser is triggered!')

      db.collection("users").doc(data.uid).set(data)
      .then(function () {
        console.log("fisrt signup: " + data.uid + " is setted!")
        window.location.href="/"
      
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
        alert(err.message);
      });
    

  }

//==================render item : log page ================
  
  render() {
    {/* <firebaseConfig/> */}
    return(
      <div>
        <RouteNav handleSignUp={this.handleSignUp} handleSignIn={this.handleSignIn} storeToUser={this.storeToUser} passingName={this.passingName} passingEmail={this.passingEmail} passingPassword={this.passingPassword} logIn={this.state.logIn} manageUserData={this.manageUserData} userData={this.state.userData} img={this.state.memberImg} name={this.state.memberImgWord} memberEmail={this.state.memberEmail} showBook={this.state.showBook} popularBook={this.state.popularBook} popularBookScore={this.state.popularBookScore}/>
      </div>

    )
  }

}

export default Auth
