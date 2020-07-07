import React from "react";
import { db, firebase } from "./firebaseConfig"
import './style/dashboard.scss';

class Dashboards extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      imgUploadPop: false,
      imageEdited: ""
    }
    this.changeName = this.changeName.bind(this)
    this.convertName = this.convertName.bind(this)
    this.changeImg = this.changeImg.bind(this)
    this.imageUploadPop = this.imageUploadPop.bind(this)
    this.imageUploadSend = this.imageUploadSend.bind(this)
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

  imageUploadPop() {
    this.setState({ imgUploadPop: true})
  }

  imageUploadSend() {
    this.setState({ imageEdited: event.target.value })
  }


  changeImg(img) {
    console.log(img)
    if (this.props.userData.length > 0) {
      console.log(this.props.userData[0].uid)
      let uid = this.props.userData[0].uid

      db.collection("users").doc(uid).update({
        "image": img
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
        <img className="edit editTitle" src="https://i.imgur.com/W1LMjHf.png" alt=""></img>
      </div>
    )
  }



  render() {
    return (
      <div className="profileBox">
        <div className="profileImgBox">
          <div className="profileImg" style={{ content: "url(" + this.props.img + ")" }}></div>
          <img className="edit editImg" src="https://i.imgur.com/W1LMjHf.png" alt=""
            onClick={this.imageUploadPop}></img>
          
          {/* image upload pop */}
          <div className="imageUploadPop" style={{ display: this.state.imgUploadPop ? "block" : "none" }}>
            <form onSubmit={this.changeImg(this.state.imageEdited)}>
              <input type="file" className="uploadPicture" accept="image/*" onChange={this.imageUploadSend} />
              <input type="submit" value="Submit"></input>
            </form>
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