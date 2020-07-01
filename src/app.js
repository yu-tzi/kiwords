import React from "react";
import ReactDOM from "react-dom";
import firebase from "firebase/app";
import "firebase/auth";
import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer,
  IfFirebaseAuthed,
  IfFirebaseAuthedAnd
} from "@react-firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAgpVLf1iNb1RJmq3QBIuHdDnMUYObYqKo",
  authDomain: "kiwords-c058b.firebaseapp.com",
  databaseURL: "https://kiwords-c058b.firebaseio.com",
  projectId: "kiwords-c058b",
  storageBucket: "kiwords-c058b.appspot.com",
  messagingSenderId: "959153092087",
  appId: "1:959153092087:web:278807305aad9aa00caaf2",
  measurementId: "G-1GYNCR5WYZ"
};


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      signIn: " "
    };

    this.handleSignUpState = this.handleSignUpState.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleSignInState = this.handleSignInState.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
  }

  componentDidUpdate() {
    console.log('update detected!')
  }
  componentDidMount() {
    console.log('initial render detected')
  }

  handleSignUpState(event) {
    this.setState({ value: event.target.value });
  }

  handleSignUp(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
    firebase.auth().createUserWithEmailAndPassword(this.state.value, this.state.value)
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  handleSignInState(event) {
    this.setState({ signIn: event.target.value });
  }

  handleSignIn(event) {
    alert('A name was submitted: ' + this.state.signIn);
    event.preventDefault();
    firebase.auth().signInWithEmailAndPassword(this.state.signIn, this.state.signIn)
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }


  render() {
    return (
      <FirebaseAuthProvider {...firebaseConfig} firebase={firebase}>
        
        <form onSubmit={this.handleSignUp}>
          <input type="text" onChange={this.handleSignUpState} />
          <input type="submit" value="sign upppp" />
        </form>

        <form onSubmit={this.handleSignIn}>
          <input type="text" onChange={this.handleSignInState} />
          <input type="submit" value="sign innnn" />
        </form>


        <div>
          <button
            onClick={() => {
              const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
              firebase.auth().signInWithPopup(googleAuthProvider);
            }}
          >
            Sign In with Google
        </button>
          <button
            onClick={() => {
              const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
              firebase.auth().signInWithPopup(facebookAuthProvider);
            }}
          >
            Sign In with Facebook
        </button>
          <button
            data-testid="signin-anon"
            onClick={() => {
              firebase.auth().signInAnonymously();
            }}
          >
            Sign In Anonymously
        </button>
          <button
            onClick={() => {
              firebase.auth().signOut();
            }}
          >
            Sign Out
        </button>
          <FirebaseAuthConsumer>
            {({ isSignedIn, user, providerId }) => {
              return (
                <pre style={{ height: 300, overflow: "auto" }}>
                  {JSON.stringify({ isSignedIn, user, providerId }, null, 2)}
                </pre>
              );
            }}
          </FirebaseAuthConsumer>
          <div>
            <IfFirebaseAuthed>
              {() => {
                return <div>You are authenticated</div>;
              }}
            </IfFirebaseAuthed>
            <IfFirebaseAuthedAnd
              filter={({ providerId }) => providerId !== "anonymous"}
            >
              {({ providerId }) => {
                return <div>You are authenticated with {providerId}</div>;
              }}
            </IfFirebaseAuthedAnd>
          </div>
        </div>
      </FirebaseAuthProvider>
    )
  }
}








//=========================
ReactDOM.render(<App />, document.querySelector("#root"));