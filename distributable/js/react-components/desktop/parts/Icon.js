"use strict";

import { panic_if_not_type } from "../../../assert.js";
export function Icon(props = {}) {
  Icon.validate_props(props);
  return React.createElement("div", {
    className: "Icon",
    tabIndex: props.tabIndex,
    onDoubleClick: props.onDoubleClick,
    title: `Year: ${props.browsingYear}\n${props.operatingSystem}`
  }, React.createElement("div", {
    className: "graphic"
  }, React.createElement("img", {
    src: props.imageUrl
  })), React.createElement("div", {
    className: "title"
  }, props.title));
}

Icon.validate_props = function (props = {}) {
  panic_if_not_type("object", props);
  panic_if_not_type("function", props.onDoubleClick);
  panic_if_not_type("number", props.browsingYear);
  panic_if_not_type("string", props.title, props.imageUrl);
  return;
};