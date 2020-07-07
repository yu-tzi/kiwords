import React from "react";
import { db, storage } from "./firebaseConfig"
import './style/dashboard.scss';

class Dashboards extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      imgUploadPop: false
    }
    this.changeName = this.changeName.bind(this)
    this.convertName = this.convertName.bind(this)
    this.uploadImg = this.uploadImg.bind(this)
    this.imageUploadPop = this.imageUploadPop.bind(this)

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

 

/*   async uploadImg(e){

    const files = e.target.file
    const data = new FormData()
    data.append("file", files)
    data.append("upload_preset", "md4sceof")
    console.log(data)
  
    
    const response = await fetch(' https://api.cloudinary.com/v1_1/dmmnwhxmb/image/upload', data);
    const res = await response.json();
    console.log(res)
      
    

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
  } */

  uploadImg(e) {
    const storageRef = storage.ref();
    console.log(e.target.files[0])
    let name = e.target.files[0].name
    let url = ""
    let memeberRef = storageRef.child(name);
    memeberRef.put(e.target.files[0]).then(function (snapshot) {
      console.log('Uploaded a blob or file!');
      console.log(snapshot);
      storageRef.child(name).getDownloadURL().then((res) => {
        console.log(res)
        url=res
      })
    });

    




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
            <input type="file" name="file" className="uploadPicture" placeholder="上傳檔案" accept="image/*" onChange={this.uploadImg} />
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