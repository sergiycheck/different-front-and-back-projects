/**
 *
 * @param {*} initializationObject this object can contain any prop for creating new dom element
 * @returns new dom element
 *
 * @example
 *
 * let element = createElement({
 * 	tag: "div",
 * 	id: "customId",
 * 	classList: "class1 class2",
 * 	onclick: onClickHandler(),
 * 	innerHTML: "<span>some content</span>",
 * 	attributes: [
 * 		{ key: "key1", value: "value1" },
 * 	]
 * })
 */

export const createElement = (initializationObject) => {
  const { tag } = initializationObject;
  const el = document.createElement(tag);
  for (let prop in initializationObject) {
    if (prop === "children") {
      initializationObject.children.forEach((child) => el.append(child));
    } else if (prop === "attributes") {
      initializationObject[prop].forEach((attr) => el.setAttribute(attr.key, attr.value));
    } else el[prop] = initializationObject[prop];
  }
  return el;
};
