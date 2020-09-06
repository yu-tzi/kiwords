import React from "react";
import "../style/WordBook.scss";
import Loading from "./Loading.js";

class WordBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.convertName = this.convertName.bind(this);
    this.convertImg = this.convertImg.bind(this);
  }

  convertImg() {
    if (this.props.memberData.image?.length < 5) {
      return (
        <div className="wordbookImg">
          {this.props.memberData.name?.slice(0, 1)}
        </div>
      );
    } else {
      return (
        <img
          className="wordbookImg"
          src={this.props.memberData.image}
          alt=""
        ></img>
      );
    }
  }

  convertName() {
    let name;
    if (this.props.memberData.name?.length < 19) {
      name = this.props.memberData.name;
    } else {
      name = this.props.memberData.name?.slice(0, 18);
      name = name + "...";
    }
    return <div className="wordbookN">{name}</div>;
  }

  render() {
    return (
      <div>
        {this.props.memberData.name?.length > 0 ? (
          <div>
            <div className="addbookTopArea">
              {this.convertImg()}
              {this.convertName()}
            </div>
            <MyBook
              userData={this.props.userData}
              showBook={this.props.showBook}
              storeBookData={this.props.storeBookData}
              addBookPop={this.props.addBookPop}
              addBookSucceed={this.props.addBookSucceed}
              popAddBook={this.props.popAddBook}
              closeAddBook={this.props.closeAddBook}
            />
          </div>
        ) : (
          <div className="addbookTopArea">
            <div className="addbookblank"></div>
            <Loading loadingMini={false} />
          </div>
        )}
      </div>
    );
  }
}

class MyBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookInfo: [],
    };
    this.getBookData = this.getBookData.bind(this);
    this.renderShowBook = this.renderShowBook.bind(this);
    this.manageBookData = this.manageBookData.bind(this);
  }

  getBookData(e) {
    if (this.props.userData.length > 0) {
      let time = new Date().getTime();
      let bookInfo = {
        bookName: e.target.value,
        created: this.props.userData[0].uid,
        bookID: time + this.props.userData[0].uid,
        cards: [],
      };
      this.setState({ bookInfo: bookInfo });
    }
  }

  manageBookData(e) {
    e.preventDefault();
    this.props.storeBookData(this.state.bookInfo);
  }

  renderShowBook() {
    if (this.props.showBook.length > 0) {
      return (
        <div className="myBookRender">
          <div
            className="newBookShow"
            style={{
              display: this.props.addBookPop ? "none" : "block",
            }}
            onClick={() => {
              this.props.popAddBook();
            }}
          >
            <div className="addbookDecor">
              <div className="addBookTitle">
                {"✚" + "　" + "Create New Book"}
              </div>
            </div>
          </div>

          <div
            className="newBookHide"
            style={{
              display: this.props.addBookPop ? "block" : "none",
            }}
          >
            <form
              className="bookEnterFrame"
              onSubmit={(e) => {
                this.manageBookData(e);
              }}
            >
              <input
                className="bookEnter"
                type="text"
                placeholder="Enter a title, like: TOEIC words"
                onChange={(e) => this.getBookData(e)}
              ></input>
              <input
                className="bookSend"
                type="submit"
                value={this.props.addBookSucceed ? "Succeed!" : "OK"}
                style={{
                  backgroundColor: this.props.addBookSucceed
                    ? "black"
                    : "#303545",
                }}
              ></input>
            </form>
            <div
              className="addbookShowPopX"
              onClick={() => {
                this.props.closeAddBook();
              }}
            >
              ✕
            </div>
          </div>

          {this.props.showBook.map((obj, index) => {
            return (
              <div
                className="addBookShow bookformat"
                key={index}
                onClick={(event) => {
                  event.stopPropagation(),
                    (window.location.href =
                      "https://kiwords-c058b.web.app/details/" +
                      obj.bookID +
                      "?" +
                      obj.bookName);
                }}
              >
                <div className={"bookTitle " + obj.bookID}>{obj.bookName}</div>
                <div
                  className="bookBtnPlus"
                  onClick={(event) => {
                    event.stopPropagation(),
                      (window.location.href =
                        "https://kiwords-c058b.web.app/addwords?" +
                        obj.bookID +
                        "&" +
                        obj.bookName);
                  }}
                >
                  Add Words
                </div>
              </div>
            );
          })}
          {/* end of myBookRender */}
        </div>
      );
    } else {
      return (
        <div
          className="noBookInfor"
          style={{
            display: this.props.showBook.length >= 1 ? "none" : "flex",
          }}
        >
          <div className="noBookTitle">You have no Wordbook yet</div>
          <div className="noBookSubtitle">
            Create a new Wordbook to start adding flashcards.
          </div>
          <div
            className="noBookBtn"
            onClick={() => {
              this.props.popAddBook();
            }}
          >
            Create Wordbook
          </div>

          <div
            className="addbookpop"
            style={{
              display: this.props.addBookPop ? "block" : "none",
            }}
          >
            <div
              className="addbookpopX"
              onClick={() => {
                this.props.closeAddBook();
              }}
            >
              ✕
            </div>
            <form className="addbookpopFrame" onSubmit={this.manageBookData}>
              <input
                className="addbookpopEnter"
                type="text"
                placeholder="Enter a title, like : 4000 Essential English Words "
                onChange={(e) => this.getBookData(e)}
              ></input>
              <input
                className="addbookpopSend"
                type="submit"
                value="Create"
              ></input>
            </form>
          </div>
        </div>
      );
    }
  }

  render() {
    return <div className="myBookBlock">{this.renderShowBook()}</div>;
  }
}

export default WordBook;
