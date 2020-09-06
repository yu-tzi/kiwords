import BookDetail from "./BookDetail.js";
import Enzyme, { shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import renderer from "react-test-renderer";
import React from "react";
Enzyme.configure({ adapter: new Adapter() });

it("snapshot tests", () => {
  const tree = renderer.create(<BookDetail />).toJSON();
  expect(tree).toMatchSnapshot();
});

it("BookDetail render exist", () => {
  const wrapper = shallow(<BookDetail />);
  expect(wrapper.exists()).toBe(true);
});

it("count lastValue function", () => {
  const component = mount(<BookDetail />);
  component.instance().changePage(1);
  expect(component.state("lastValue")).toBe(8);
  component.instance().changePage(3);
  expect(component.state("lastValue")).toBe(24);
  component.instance().changePage(0);
  expect(component.state("lastValue")).toBe(0);
});

it("pageLeaf length based on page state", () => {
  const component = mount(<BookDetail />);
  component.setState({ page: 3 });
  expect(component.find(".page").length).toBe(3);
  component.setState({ page: 0 });
  expect(component.find(".page").length).toBe(0);
});
