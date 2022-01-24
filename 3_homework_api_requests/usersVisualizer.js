import { createElement } from "./helpers/createElement.js";
import { getLoader } from "./helpers/loaderElement.js";
import { usersFetcherInstance } from "./userStateFetcher.js";
import { createUserUpdateForm } from "./userUpdateForm.js";
import { MyHttpError, UserVisualizationError, ValidationError } from "./errors/errors.js";

class UserVisualizer {
  constructor(selector = ".users-container") {
    this.usersContainerElement = document.querySelector(selector);
    this.updateUser = this.updateUser.bind(this);
  }

  async visualizeUsers() {
    const loader = getLoader();
    this.usersContainerElement.appendChild(loader);

    try {
      const users = await usersFetcherInstance.fetchGetData();
      if (!users) return;
      loader.remove();

      users.forEach((user) => {
        this.#addUser({ user, avatarSrc: user.avatar });
      });
    } catch (error) {
      if (error instanceof MyHttpError) {
        throw new UserVisualizationError(`an error occured while visualizing users. ${error.message}`, error.stack);
      }
      throw error;
    }
  }

  #addUser({ user, avatarSrc }) {
    const strong = createElement({
      tag: "strong",
      classList: "user-name",
      innerText: `${user.first_name} ${user.last_name}`,
    });

    const userName = createElement({ tag: "div", children: [strong] });

    const img = createElement({
      tag: "img",
      classList: "user-avatar",
      attributes: [
        { key: "alt", value: `${user.first_name} avatar` },
        { key: "src", value: avatarSrc },
      ],
    });

    const userData = createElement({ tag: "div", children: [img, userName] });

    const updateButton = createElement({
      tag: "button",
      classList: "btn btn-info",
      innerText: "update",
      onclick: this.updateUser(user.id),
    });

    this.usersContainerElement.prepend(
      createElement({
        tag: "div",
        classList: "user-container mt-2",
        id: `user-${user.id}`,
        children: [userData, updateButton],
      })
    );
  }

  async addNewUser(user) {
    if (user.first_name === "error") {
      throw new ValidationError("can not add user with name error");
    }

    const createdUser = await usersFetcherInstance.fetchAddNewData(user);
    if (!createdUser) return;

    this.#addUser({
      user: createdUser,
      avatarSrc: "/assets/img/my-user-avatar.jpg",
    });
  }

  //updateUser is a function (closure) //all functions in js are closures with hidden property named [[Environment]], that
  // keeps the reference to the Lexical Environment where the function was created;
  //a closure is a function that remembers its outer variables and can access them;
  //updateUser returns a function showUpdateForm that has reference to the argument id of updateUse function.
  // when we call showUpdateForm on button click a new Lexical Environment is created for call, and its outer Lexical
  //Environment reference is taken from onclick.[[Environment]] that stored id value.

  updateUser(id) {
    async function showUpdateForm() {
      const user = usersFetcherInstance.users.find((u) => u.id === id);
      createUserUpdateForm(user);
    }
    showUpdateForm = showUpdateForm.bind(this);
    return showUpdateForm;
  }
}

export default UserVisualizer;
