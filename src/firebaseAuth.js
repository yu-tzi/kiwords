import React from "react";
import firebase from "firebase/app";
import "firebase/auth";


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
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


class Auth extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      signUp: "", //for passing input data 
      signIn: "", //for passing input data 
      logIn: false,
      userData: []
    };

    this.handleSignUpState = this.handleSignUpState.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleSignInState = this.handleSignInState.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);

  }


  componentDidMount() {
    console.log('initial render detected')
    firebase.auth().onAuthStateChanged((user) => {
      console.log("onAuthStateChanged?")

      if (user) {
        console.log("login")
        this.setState({ logIn: true })

        var user = firebase.auth().currentUser;
        if (user != null) {
          this.setState({ userData: [user]}) 
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

  swithLogState() {
    if (this.state.logIn) {
      this.setState({ logIn: true })
    } else {
      this.setState({ logIn: false })
    }
  }


  handleSignUpState(event) {
    console.log(event.target.value)
    this.setState({ signUp: event.target.value });
  }

  handleSignUp(event) {
    if (this.state.logIn) {
      alert('you have already signin in!')
      event.preventDefault();
    } else {
      alert('A name was submitted: ' + this.state.signUp);
      event.preventDefault();
      firebase.auth().createUserWithEmailAndPassword(this.state.signUp, this.state.signUp)
        .then((res) => {
          console.log(res)
          this.setState({ userData: [res] })
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  handleSignInState(event) {
    this.setState({ signIn: event.target.value });
  }

  handleSignIn(event) {
    if (this.state.logIn) {
      alert('you have already signin in!')
      event.preventDefault();
    } else {

      alert('A name was submitted: ' + this.state.signIn);
      event.preventDefault();
      firebase.auth().signInWithEmailAndPassword(this.state.signIn, this.state.signIn)
        .then((res) => {
          console.log(res)
          this.setState({ userData: [res] })
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }


  render() {
    return (
      <div>

        <form onSubmit={
            this.handleSignUp
          }>
          <input type="text" onChange={(e) => this.handleSignUpState(e)} />
          <input type="submit" value="sign upppp" />
        </form>

        <form onSubmit={
          this.handleSignIn
        }>
          <input type="text" onChange={(e) => this.handleSignInState(e)}/>
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
                  this.setState({ userData: [res] })
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
                this.setState({ userData: [res] })
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

      </div>
    )
  }

}

export default Auth
