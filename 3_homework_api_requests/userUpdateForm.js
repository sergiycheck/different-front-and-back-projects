import { createElement } from "./helpers/createElement.js";

import { focusinInputHandler, callFormSaveButtonSubmitHandlerWithTryCatch } from "./addFormHandlers.js";

import { usersFetcherInstance } from "./userStateFetcher.js";

import { ValidationError } from "./errors/errors.js";

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
    classList: "flex-container reverse",
    children: [saveItemDiv, cancelItemDiv],
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
      await callFormSaveButtonSubmitHandlerWithTryCatch(null, updateSaveExecutor, updateForm);

      async function updateSaveExecutor(updatedFields) {
        if (updatedFields.first_name === "error") {
          cleanFromOverlayAndListener(updateForm, divOverlay);

          throw new ValidationError("can not add user with name error");
        }

        const updatedUser = await usersFetcherInstance.fetchPutData({
          id: user.id,
          data: { ...user, ...updatedFields },
        });

        updateDomClean(updatedUser, updateForm, divOverlay);
      }
    }
  }

  document.body.prepend(divOverlay);
};

function updateDomClean(updatedUser, updateForm, divOverlay) {
  const usersContainer = document.querySelector(".users-container");
  const userContainer = usersContainer.querySelector(`#user-${updatedUser.id}`);
  const userInfoStrong = userContainer.querySelector("strong");
  userInfoStrong.innerText = `${updatedUser.first_name} ${updatedUser.last_name}`;

  cleanFromOverlayAndListener(updateForm, divOverlay);
}

function cleanFromOverlayAndListener(updateForm, divOverlay) {
  updateForm.removeEventListener("focusin", focusinInputHandler);

  divOverlay.remove();
}

export { createUserUpdateForm };
