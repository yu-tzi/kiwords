import React from "react";
import RouteNav from "./RouteNav"
import { db, firebase, storage } from "../utility/firebaseConfig"


let rootURL = window.location.href.substr(0, window.location.href.indexOf("/", 9))

class Auth extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: "testuser@gmail.com", 
      password: "testuser",
      name: "",
      logIn: false,
      userData: [],
      showBook: [],
      memberData: [],
      renewProfile: false,
      imgUploadPop: false,
      titleUploadPop: false,
      titleContent: "",
      addBookPop: false,
      addBookSucceed: false
    }
    this.passingEmail = this.passingEmail.bind(this)
    this.passingPassword = this.passingPassword.bind(this)
    this.passingName = this.passingName.bind(this)
    this.handleSignUp = this.handleSignUp.bind(this)
    this.handleSignIn = this.handleSignIn.bind(this)
    this.storeToUser = this.storeToUser.bind(this)
    this.manageUserData = this.manageUserData.bind(this)
    this.uploadImg = this.uploadImg.bind(this)
    this.closeImageUpload = this.closeImageUpload.bind(this)
    this.popImageUpload = this.popImageUpload.bind(this)
    this.uploadName = this.uploadName.bind(this)
    this.changeName = this.changeName.bind(this)
    this.popTitleUpload = this.popTitleUpload.bind(this)
    this.closeTitleUpload = this.closeTitleUpload.bind(this)
    this.storeBookData = this.storeBookData.bind(this)
    this.popAddBook = this.popAddBook.bind(this)
    this.closeAddBook = this.closeAddBook.bind(this)

  }

  componentDidMount() {

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ logIn: true })
        this.setState({ userData: [user] })
        db.collection("users")
          .where("uid", "==", user.uid)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              this.setState({ memberData: doc.data()})
            });
          })
          .catch((error) => {
            console.log("Error getting documents: ", error)
          });
        
        db.collection("books")
          .where("created", "==", user.uid)
          .get()
          .then((doc) => {
          if (doc) {
            let showBook = []
            doc.forEach((doc) => {
              showBook.push(doc.data())
            })
            this.setState({ showBook: showBook })
          } else {
            console.log("No such document!");
          }
        }).catch((error) => {
          console.log("Error getting document:", error);
        });

      } else { //if user didn't login
        this.setState({ logIn: false })
        this.setState({ userData: [] })
      }
    });
  }//end of componentDidMount

  passingName() {
    this.setState({ name: event.target.value });
  }

  passingEmail() {
    this.setState({ email: event.target.value });
  }

  passingPassword() {
    this.setState({ password: event.target.value });
  }

  handleSignUp(e) {
    e.preventDefault();
    if (this.state.logIn) {
      alert('You have already signin in!')
    } else {
      firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((res) => {
          this.setState({ userData: res })
          this.manageUserData(this.state.userData, this.state.name)
          e.persist();
        })
        .catch((err) => {
          alert(err.message)
          e.persist();
        })
    }
  }

  handleSignIn(e) {
    e.preventDefault();
    if (this.state.logIn) {
      alert('you have already signin in!')
    } else {
      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((res) => {
          window.location.href = "/wordbooks"
        })
        .catch((err) => {
          alert(err.message)
        })
    }
  }

  manageUserData(userData, name) {

    let nameEdited
    if (userData.user.displayName === null) {
      nameEdited = name
    } else {
      nameEdited = userData.user.displayName
    }

    let image
    if (userData.user.photoURL === null) {
      image = ""
    } else if (userData.user.photoURL.includes("google")) {
      image = userData.user.photoURL
    } else if (userData.user.photoURL.includes("facebook")) {
      image = userData.user.photoURL + "?height=500"
    }

    let data =
    {
      uid: userData.user.uid,
      email: userData.user.email,
      name: nameEdited,
      image: image,
      ownedBook: [],
      userExp: []
    }

    this.storeToUser(data)
  }

  storeToUser(data) {
    db.collection("users").doc(data.uid).set(data)
      .then(() => {
        window.location.href = rootURL + "/wordbooks"
      })
      .catch(function (error) {
        alert(err.message);
      });
  }

  uploadImg(e) {
    const storageRef = storage.ref()
    let name = e.target.files[0].name
    let memeberRef = storageRef.child(name)
    memeberRef.put(e.target.files[0])
      .then((snapshot) => {
        storageRef.child(name).getDownloadURL()
          .then((res) => {
            this.storeImg(res)
          })
      });
  }

  storeImg(res) {
      let uid = this.state.userData[0].uid
      db.collection("users").doc(uid).update({
        "image": res
      })
        .then(() => {
          let newMemData = this.state.memberData
          newMemData.image = res
          this.setState({ memberData: newMemData })
          this.setState({ imgUploadPop: false })
        })
        .catch(function (error) {
          alert("Error getting documents: ", error)
        });
  }

  popImageUpload() {
    this.setState({ imgUploadPop: true })
  }

  closeImageUpload(e) {
    this.setState({ imgUploadPop: false })
    e.stopPropagation()
  }

  popTitleUpload(e) {
    e.stopPropagation()
    this.setState({ titleUploadPop: true })
  }

  closeTitleUpload(e) {
    this.setState({ titleUploadPop: false })
    e.stopPropagation()
  }

  uploadName(e) {
    this.setState({ titleContent: e.target.value })
  }

  changeName() {
    let uid = this.state.userData[0].uid
    event.preventDefault()

    db.collection("users").doc(uid)
      .update({
        "name": this.state.titleContent
      })
      .then(() => {
        let newMemData = this.state.memberData
        newMemData.name = this.state.titleContent
        this.setState({ memberData: newMemData })
        this.setState({ titleUploadPop: false })
      })
      .catch(function (error) {
          alert("Error getting documents: ", error)
      });
  }

  popAddBook() {
    this.setState({ addBookPop: true })
  }

  closeAddBook() {
    this.setState({ addBookPop: false })
  }

  storeBookData(bookInfo) {
    db.collection("books").doc(bookInfo.bookID).set(bookInfo)
      .then(() => {
        db.collection("users").doc(this.state.userData[0].uid).update({
          ownedBook: firebase.firestore.FieldValue.arrayUnion(bookInfo.bookID)
        })
          .then(() => {
            let showBook = this.state.showBook
            showBook.push(bookInfo)
            console.log(showBook)
            this.setState({ showBook: showBook }) 
            this.setState({ addBookSucceed: true })
            setTimeout(() => {
              this.setState({ addBookSucceed: false })
            }, 1500)
            setTimeout(() => {
              this.setState({ addBookPop: false })
            }, 1700)
        })
          .catch((err)=>{
            console.error("Error adding document: ", err);
          });
      })
      .catch(function (err) {
        console.error("Error adding document: ", err);
      });
  }

  render() {
    return (
      <div>
        <RouteNav
          //login
          handleSignUp={this.handleSignUp}
          handleSignIn={this.handleSignIn}
          storeToUser={this.storeToUser}
          passingName={this.passingName}
          passingEmail={this.passingEmail}
          passingPassword={this.passingPassword}
          logIn={this.state.logIn}
          manageUserData={this.manageUserData}
          email={this.state.email}
          password={this.state.password}
        //all pages
          userData={this.state.userData}
          showBook={this.state.showBook}
          memberData={this.state.memberData}
          //dashboard
          uploadImg={this.uploadImg}
          popImageUpload={this.popImageUpload}
          closeImageUpload={this.closeImageUpload}
          imgUploadPop={this.state.imgUploadPop}
          popTitleUpload={this.popTitleUpload}
          closeTitleUpload={this.closeTitleUpload}
          uploadName={this.uploadName}
          changeName={this.changeName}
          titleUploadPop={this.state.titleUploadPop}
          titleContent={this.state.titleContent}
          //wordbook
          storeBookData={this.storeBookData}
          addBookPop={this.state.addBookPop}
          addBookSucceed={this.state.addBookSucceed}
          popAddBook={this.popAddBook}
          closeAddBook={this.closeAddBook}
        />
      </div>
    )
  }
}

export default Auth
