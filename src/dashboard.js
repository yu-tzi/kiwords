import React from "react";
import { db, storage } from "./firebaseConfig"
import './style/dashboard.scss';

class Dashboards extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      imgUploadPop: false,
      titleUploadPop: false,
      titleContent: ""
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

  titleUploadPop() {
    this.setState({ titleUploadPop: true})
  }

  titleUploadClose() {
    this.setState({ titleUploadPop: false })
  }

  imageUploadPop() {
    this.setState({ imgUploadPop: true})
  }

  imageUploadClose() {
    this.setState({ imgUploadPop: false })
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
        <img className="edit editTitle" src="https://i.imgur.com/W1LMjHf.png" alt="" onClick={this.titleUploadPop}></img>
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
    alert("change name")

    if (this.props.userData.length > 0) {
      alert("this.props.userData.length > 0")
      console.log(this.props.userData[0].uid)
      let uid = this.props.userData[0].uid
      alert(uid)
      event.preventDefault()

      db.collection("users").doc(uid).update({
        "name": this.state.titleContent
      }).then(() => {
        alert("文字修改完成!")
      })
        .catch(function (error) {
          alert("Error getting documents: ", error)
        });
    }
  }


  render() {
    return (
      <div className="profileBox">
        <div className="profileImgBox">
          
          
          {this.convertImg()}

          <img className="edit editImg" src="https://i.imgur.com/W1LMjHf.png" alt=""
            onClick={this.imageUploadPop}></img>
          
          {/* image upload pop */}
          <div className="imageUploadPop" style={{ display: this.state.imgUploadPop ? "block" : "none" }}>
            <input type="file" name="file" className="uploadPicture" placeholder="上傳檔案" accept="image/*" onChange={this.uploadImg} />
            <div className="imgUploadClose" onClick={this.imageUploadClose}>✕</div>
          </div>

          {/* word upload pop */}
          <div className="titleUploadPop" style={{ display: this.state.titleUploadPop ? "block" : "none" }}>
            <form className="uploadTitleForm" onSubmit={this.changeName}>
              <input type="text" id="fname" name="fname" className="uploadTitle" placeholder="你想改成什麼名字？" onChange={(e) => { this.uploadName(e)}} />
              <input type="submit" ></input>
            </form>
            <div className="titleUploadClose" onClick={this.titleUploadClose}>✕</div>
          </div>
            


        </div>
        
        {this.convertName()}

        <div className="profileInfor">{this.props.memberEmail}
        </div>
        
      </div>
    )
  }
}

export default Dashboards