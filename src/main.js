import React from "react";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
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

/* firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore(); */


export const App = () => {
  return (
    <FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
        <button
          onClick={() => {
            const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(googleAuthProvider);
          }}
        >
          Sign In with Google
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
    </FirebaseAuthProvider>
  );
};