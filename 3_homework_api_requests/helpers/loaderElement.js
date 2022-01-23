import { createElement } from "./createElement.js";

export function getLoader() {
  const img = createElement({
    tag: "img",
    attributes: [
      { key: "src", value: "/assets/img/loader.gif" },
      { key: "alt", value: "img loader" },
    ],
  });
  const divLoaderImgContainer = createElement({ tag: "div", classList: "loader", children: [img] });

  return createElement({ tag: "div", classList: "flex-center", children: [divLoaderImgContainer] });
}
