import WordBook from "./WordBook.js";
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import React from "react";
Enzyme.configure({ adapter: new Adapter() })

const fakeBook = {
  bookID: "159671373474580y4BQnFNPaMzvodV6xGlK96nqN2",
  bookName: "TOEIC 3000",
  cards: []
}

it('testing convert img function : has initial image', () => {
  const fakeData = {
    email: "Ikik@gmail.com",
    image: "https://lh3.googleusercontent.com/-3hduY5jbms4/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucl4iq0lJetalxfZJ2jPHN9b-PLtuA/photo.jpg",
    name: "Ikik Luo"
  }
  const component = mount(<WordBook memberData={fakeData} showBook={fakeBook} />);
  component.instance().convertImg()
  expect(component.find(".wordbookImg").prop("src")).toEqual(fakeData.image);
});

it('testing convert img function : does not has initial image', () => {
  const fakeData = {
    email: "Ikik@gmail.com",
    image: "",
    name: "Ikik Luo"
  }
  const component = mount(<WordBook memberData={fakeData} showBook={fakeBook} />);
  component.instance().convertImg()
  expect(component.find(".wordbookImg").text()).toEqual("I");
});

it('testing convert name function : name in En is too long', () => {
  const fakeData = {
    email: "Ikik@gmail.com",
    image: "",
    name: "Pneumonoultramicroscopicsilicovolcanoconiosis"
  }
  const component = mount(<WordBook memberData={fakeData} showBook={fakeBook} />);
  component.instance().convertName()
  //console.log(component.find(".wordbookN").debug())
  expect(component.find(".wordbookN").text()).toEqual("Pneumonoultramicro...");
});

it('testing convert name function : name is empty', () => {
  const fakeData = {
    email: "Ikik@gmail.com",
    image: "",
    name: ""
  }
  const component = mount(<WordBook memberData={fakeData} showBook={fakeBook} />);
  component.instance().convertName()
  expect(component.find(".wordbookN").text()).toEqual("");
  expect(component.find(".wordbookImg").text()).toEqual("");
});

it('testing convert name function : name in Ch is too long', () => {
  const fakeData = {
    email: "Ikik@gmail.com",
    image: "",
    name: "名字最多只有十八個字名字最多只有十八個字"
  }
  const component = mount(<WordBook memberData={fakeData} showBook={fakeBook} />);
  component.instance().convertName()
  //console.log(component.find(".wordbookN").debug())
  expect(component.find(".wordbookN").text()).toEqual("名字最多只有十八個字名字最多只有十八...");
  expect(component.find(".wordbookImg").text()).toEqual("名");
});
