import React from "react";
import { db, storage } from "./firebaseConfig"
import './style/dashboard.scss';
import { thresholdSturges, thresholdFreedmanDiaconis } from "d3";

let rootURL = window.location.href.substr(0, window.location.href.indexOf("/", 9))

class Dashboards extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      imgUploadPop: false,
      titleUploadPop: false,
      titleContent: "",
      reviseNamePop: false
    }
    this.changeName = this.changeName.bind(this)
    this.convertName = this.convertName.bind(this)
    this.uploadImg = this.uploadImg.bind(this)
    this.imageUploadPop = this.imageUploadPop.bind(this)
    this.storeImg = this.storeImg.bind(this)
    this.convertImg = this.convertImg.bind(this)
    this.uploadName = this.uploadName.bind(this)
    this.changeName = this.changeName.bind(this)
    this.titleUploadPop = this.titleUploadPop.bind(this)
    this.titleUploadClose = this.titleUploadClose.bind(this)
    this.imageUploadClose = this.imageUploadClose.bind(this)
  }

  

  changeName(name) {
    console.log(name)
    if (this.props.userData.length > 0) {
      console.log(this.props.userData[0].uid)
      let uid = this.props.userData[0].uid

      db.collection("users").doc(uid).update({
        "name": name
      }).then(() => {
        console.log("名字修改完成!")
        
      })
        .catch(function (error) {
          alert("Error getting documents: ", error)
        });
     
    }
  }

  titleUploadPop(e) {
    e.stopPropagation()
    this.setState({ titleUploadPop: true })
    this.setState({ reviseNamePop: true })
    if (this.state.imgUploadPop) {
      this.setState({ imgUploadPop:false})
    }
  }

  titleUploadClose() {
    this.setState({ titleUploadPop: false })
  }

  imageUploadPop() {
    this.setState({ imgUploadPop: true })
    if (this.state.titleUploadPop) {
      this.setState({ titleUploadPop: false })
    }
  }

  imageUploadClose() {
    this.setState({ imgUploadPop: false })
    console.log('imageUploadClose')
    
  }


 

  uploadImg(e) {
    const storageRef = storage.ref();
    console.log(e.target.files[0])
    let name = e.target.files[0].name
    let memeberRef = storageRef.child(name);
    memeberRef.put(e.target.files[0]).then( (snapshot)=> {
      console.log('Uploaded a blob or file!');
      console.log(snapshot);
      storageRef.child(name).getDownloadURL().then((res) => {
        console.log(res)
        this.storeImg(res)
      })
    });
  }

  storeImg(res) {
  
    
    if (this.props.userData.length > 0 && res.length > 0) {
      console.log(this.props.userData[0].uid)
      let uid = this.props.userData[0].uid

      db.collection("users").doc(uid).update({
        "image": res
      }).then(() => {
        console.log("照片修改完成!")
        window.location.href = rootURL + "/dashboard"
      })
        .catch(function (error) {
          alert("Error getting documents: ", error)
        });

    }
  }



  convertName() {

    let name

    if (this.props.name.length < 19) {
      name = this.props.name
    } else {
      name = this.props.name.slice(0, 18)
      name = name + "..."
    }
    return (
      <div className="profileTitle">{name}
        {/* <img className="edit editTitle" src="https://i.imgur.com/W1LMjHf.png" alt="" onClick={this.titleUploadPop}></img> */}
        
      </div>
    )
  }

  convertImg() {
 
    if (this.props.img.length < 5) {
      return (
        <div className="profileImg">{this.props.name.slice(0, 1)}</div>
      )
    } else {
      return(
        <img className="profileImg profileImgY" src={this.props.img} alt=""
        ></img>
      )
      
    }
  }

  uploadName(e) {
    this.setState({ titleContent: e.target.value})
  }

  changeName() {

    if (this.props.userData.length > 0) {
      let uid = this.props.userData[0].uid
      /* alert(uid) */
      event.preventDefault()

      db.collection("users").doc(uid).update({
        "name": this.state.titleContent
      }).then(() => {
        window.location.href = rootURL + "/dashboard"
      })
        .catch(function (error) {
          alert("Error getting documents: ", error)
        });
    }
  }


  render() {
    return (
      <div className="dashContainer">
        
        <div className="profileBox">
          <div className="profileImgBox">
            {this.convertImg()}
          </div>
          
        <div className="profileInforBox">
          {this.convertName()}
            <div className="profileInfor">{
              this.props.memberEmail
            }</div>
          </div>
        </div>
          
            
      <div className="uploadBtnBox">
              
          <div className="editTitleBox" onClick={(e) => { this.titleUploadPop(e) }}>Change Your Name
               
              <div className="titleUploadPop" style={{ display: this.state.titleUploadPop ? "block" : "none" }}>

              <div className="titleUploadPopbox">
                <div className="titleUploadclose" onClick={(e) => {
                  this.setState({
                    titleUploadPop: false
                  }), e.stopPropagation()}}>✕</div>
                <form className="uploadTitleForm" lang="en" onSubmit={this.changeName}>
                  <input type="text" id="fname" name="fname" className="uploadTitle" placeholder="NEW NAME" onChange={(e) => { this.uploadName(e) }} ></input>
                    <input type="submit" ></input>
                  </form>
              </div>
                  
            </div>
            {/* titleUploadPo */}
          </div>
          {/* editTitleBox */}
            
          <div className="editImgBox" onClick={this.imageUploadPop}>Upload New Photo
              
              <div className="imageUploadPop" style={{ display: this.state.imgUploadPop ? "block" : "none" }}>
              <div className="imageUploadPopbox">
              <div className="imageUploadclose" onClick={(e) => {
                this.setState({
                  imgUploadPop: false
                }), e.stopPropagation()
              }}>✕</div>
                <input type="file" lang="en" name="file" className="uploadPicture" placeholder="Upload file and wait for a sec" accept="image/*" onChange={this.uploadImg} ></input>
              </div>
            </div>
            
          </div>
          {/* editImgBox */}
          
          </div>
        {/* uploadBtnBox */}

      </div>
    )
  }
}

export default Dashboards