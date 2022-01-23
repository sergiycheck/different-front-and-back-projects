import { client } from "./api/client.js";
import { UserStateFetcher } from "./userStateFetcher.js";
import { usersRoute } from "./api/apiRoutes.js";
import { createElement } from "./helpers/createElement.js";
import { getLoader } from "./helpers/loaderElement.js";
import { focusinInputHandler, formSaveButtonSubmitHandler } from "./addFormHandlers.js";

const usersFetcher = new UserStateFetcher(usersRoute, client);

const createUserUpdateForm = (user) => {
  const userFirstNameInput = createElement({
    tag: "input",
    id: "user-updateName-input",
    classList: "input-control",
    value: user.first_name,
    attributes: [
      { key: "name", value: "user-first_name-input" },
      { key: "autocomplete", value: "off" },
    ],
  });

  const warningForUserFirstNameInput = createElement({
    tag: "div",
    classList: "invalid-input",
    innerText: "name can not be empty",
  });

  const userLastNameInput = createElement({
    tag: "input",
    id: "user-updateSurname-input",
    value: user.last_name,
    classList: "input-control mt-2",
    attributes: [
      { key: "name", value: "user-last_name-input" },
      { key: "autocomplete", value: "off" },
    ],
  });

  const warningForUserLastNameInput = createElement({
    tag: "div",
    classList: "invalid-input",
    innerText: "last name can not be empty",
  });

  const saveButton = createElement({
    tag: "button",
    classList: "btn btn-info",
    innerText: "save",
    attributes: [{ key: "name", value: "save-btn" }],
  });

  const saveItemDiv = createElement({
    tag: "div",
    classList: "item",
    children: [saveButton],
  });

  const cancelButton = createElement({
    tag: "button",
    classList: "btn btn-info",
    innerText: "cancel",
    attributes: [{ key: "name", value: "cancel-btn" }],
  });

  const cancelItemDiv = createElement({
    tag: "div",
    classList: "item",
    children: [cancelButton],
  });

  const flexColumnContainer = createElement({
    tag: "div",
    classList: "flex-container",
    children: [cancelItemDiv, saveItemDiv],
  });

  const updateForm = createElement({
    tag: "form",
    attributes: [{ key: "name", value: "update-user-form" }],
    onsubmit: updateFormSubmitEventHandler,
    children: [
      userFirstNameInput,
      warningForUserFirstNameInput,
      userLastNameInput,
      warningForUserLastNameInput,
      flexColumnContainer,
    ],
  });

  updateForm.addEventListener("focusin", focusinInputHandler);

  const formContainer = createElement({
    tag: "div",
    classList: "overlay__form-container",
    children: [updateForm],
  });

  const divOverlay = createElement({
    tag: "div",
    classList: "overlay",
    children: [formContainer],
  });

  async function updateFormSubmitEventHandler(e) {
    e.preventDefault();

    const submitter = e.submitter;
    if (submitter === cancelButton) {
      divOverlay.remove();
    } else if (submitter === saveButton) {
      await formSaveButtonSubmitHandler(null, updateSaveExecutor, updateForm);

      async function updateSaveExecutor(updatedFields) {
        console.log("updated fields", updatedFields);

        const updatedUser = await usersFetcher.fetchPutData({ id: user.id, data: { ...user, ...updatedFields } });
        console.log("updated user", updatedUser);

        const usersContainer = document.querySelector(".users-container");
        const userContainer = usersContainer.querySelector(`#user-${updatedUser.id}`);
        const userInfoStrong = userContainer.querySelector("strong");
        userInfoStrong.innerText = `${updatedUser.first_name} ${updatedUser.last_name}`;

        updateForm.removeEventListener("focusin", focusinInputHandler);

        divOverlay.remove();
      }
    }
  }

  document.body.prepend(divOverlay);
};

class UserVisualizer {
  constructor(selector = ".users-container") {
    this.usersContainerElement = document.querySelector(selector);
    this.updateUser = this.updateUser.bind(this);
  }

  async visualizeUsers() {
    const loader = getLoader();
    this.usersContainerElement.appendChild(loader);
    const users = await usersFetcher.fetchGetData();
    if (!users) return;
    loader.remove();

    users.forEach((user) => {
      this.#addUser({ user, avatarSrc: user.avatar });
    });
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
        classList: "user-container",
        id: `user-${user.id}`,
        children: [userData, updateButton],
      })
    );
  }

  async addNewUser(user) {
    const createdUser = await usersFetcher.fetchAddNewData(user);
    if (!createdUser) return;

    this.#addUser({
      user: createdUser,
      avatarSrc: "/assets/img/my-user-avatar.jpg",
    });
  }

  updateUser(id) {
    return async function () {
      const user = usersFetcher.users.find((u) => u.id === id);
      createUserUpdateForm(user);
    };
  }
}

export default UserVisualizer;
