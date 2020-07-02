import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import Main from "./route"

//================== Initialize Firebase ================
var firebaseConfig = {
  apiKey: "AIzaSyAgpVLf1iNb1RJmq3QBIuHdDnMUYObYqKo",
  authDomain: "kiwords-c058b.firebaseapp.com",
  databaseURL: "https://kiwords-c058b.firebaseio.com",
  projectId: "kiwords-c058b",
  storageBucket: "kiwords-c058b.appspot.com",
  messagingSenderId: "959153092087",
  appId: "1:959153092087:web:278807305aad9aa00caaf2",
  measurementId: "G-1GYNCR5WYZ"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();




//================== Auth + DB setting ================

class Auth extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: "", //for passing input data 
      password: "", //for passing input data 
      name:"",
      logIn: false,
      userData: []
    };

    this.passingEmail = this.passingEmail.bind(this);
    this.passingPassword = this.passingPassword.bind(this);
    this.passingName = this.passingName.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.manageUserData = this.manageUserData.bind(this)
    this.storeToUser = this.storeToUser.bind(this)
   


  }

//================== state change : log state swith & DB get item ================
  
  componentDidMount() {

    console.log('initial render detected')
    firebase.auth().onAuthStateChanged((user) => {
      console.log("onAuthStateChanged?")

      if (user) {
        console.log("login")
        this.setState({ logIn: true })

        var user = firebase.auth().currentUser;

        if (user != null) {
          this.setState({ userData: [user] }) 
        } else {
          console.log("user is null")
        }
      } else {
        console.log("logout")
        this.setState({ logIn: false })
        this.setState({ userData: [] }) 
      }
    }); 
  }

//================== log functions ================

  swithLogState() {
    if (this.state.logIn) {
      this.setState({ logIn: true })
    } else {
      this.setState({ logIn: false })
    }
  }
  
  passingEmail(event) {
    this.setState({ email: event.target.value });
  }

  passingPassword(event) {
    this.setState({ password: event.target.value });
  }

  passingName(event) {
    this.setState({ name: event.target.value });
  }



  handleSignUp(event) {
    if (this.state.logIn) {
      alert('you have already signin in!')
      event.preventDefault();
    } else {
      alert('A name was submitted: ' + this.state.name);
      event.preventDefault();
      firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((res) => {
          console.log(res)
          this.manageUserData(res, this.state.name)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

 
  handleSignIn(event) {
    if (this.state.logIn) {
      alert('you have already signin in!')
      event.preventDefault();
    } else {
      alert('A name was submitted: ' + this.state.name);
      event.preventDefault();
      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  //================== DB functions ================

  manageUserData(userData,name) {
    console.log(userData.user.uid)

    let nameEdited

    if (userData.user.displayName === null) {
      nameEdited = name
    } else {
      nameEdited = userData.user.displayName 
    }

    console.log(nameEdited)


    let data = []
    data =

    {
      uid: userData.user.uid,
      email: userData.user.email,
      name: nameEdited,
      ownedBook: ["bookID-1"],
      savedBook: ["bookID-1"],
      userExp: {
        quizHis: [
          {
            time: "time-1",
            score: "score-1"
          }
        ],
        likeBook: [
          {
            bookID: "likebook-1",
            bookScore: "bookScore-1"
          }
        ],
        addCards: [
          {
            time: "time-1",
            amount: "amount-1"
          }
        ]
      }
    }
    //send data
    console.log(data)
    this.storeToUser(data) 
  }


  storeToUser(data) {
    console.log('storeToUser is triggered!')

      db.collection("users").doc(data.uid).set(data)
      .then(function () {
        console.log("fisrt signup: " + data.uid + " is setted!")
        location.reload();
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
    

  }


//==================render item : log page ================
  
  render() {
    return (
      <div>

        <form onSubmit={
            this.handleSignUp
          }>
          email<input type="text" onChange={(e) => this.passingEmail(e)} />
          password<input type="text" onChange={(e) => this.passingPassword(e)} />
          name<input type="text" onChange={(e) => this.passingName(e)} />
          <input type="submit" value="sign upppp" />
        </form>

        <form onSubmit={
          this.handleSignIn
        }>
          email<input type="text" onChange={(e) => this.passingEmail(e)} />
          password<input type="text" onChange={(e) => this.passingPassword(e)} />
          <input type="submit" value="sign innnn" />
        </form>

        <div>
          <button
            onClick={() => {
              if (this.state.logIn) {
                alert('you are already log in!')
                return
              }
              const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
              firebase.auth().signInWithPopup(googleAuthProvider)
                .then((res) => {
                  console.log(res)
                  if (res.additionalUserInfo.isNewUser) {
                    console.log("google new user!")
                    this.manageUserData(res, "name")
                  }
                })
                .catch((err) => { console.log(err) })
            }}>Sign In with Google
          </button>

          <button
            onClick={() => {
              if (this.state.logIn) {
                alert('you are already log in!')
                return
              }
              const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
              firebase.auth().signInWithPopup(facebookAuthProvider).then((res) => {
                console.log(res)
                if (res.additionalUserInfo.isNewUser) {
                  console.log("faebook new user!")
                  this.manageUserData(res, "name")
                }
              })
                .catch((err) => { console.log(err) })
            }}>Sign In with Facebook
          </button>
          <button
            onClick={() => {
              firebase.auth().signOut();
            }}>Sign Out
          </button>
        </div>

        
      <Main/>
      </div>
    )
  }


  

}

export default Auth
