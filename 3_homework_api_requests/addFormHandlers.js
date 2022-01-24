import { ValidationError, MyError, ConcurrencyError } from "./errors/errors.js";

async function callFormSaveButtonSubmitHandlerWithTryCatch(thisValue, submitNewUserFunc, form) {
  try {
    await formSaveButtonSubmitHandler(thisValue, submitNewUserFunc, form);
  } catch (error) {
    if (error instanceof ValidationError) {
      window.dispatchEvent(
        new CustomEvent("CustomWindowErrorListener", {
          detail: {
            error: new MyError(`Form submit failed. ${error.message}`, error.stack),
          },
        })
      );
      return;
    }
    window.dispatchEvent(
      new CustomEvent("CustomWindowErrorListener", {
        detail: {
          error: new MyError(`Unknown error. ${error.message}`, error.stack),
        },
      })
    );
  }
}

function addFormHandlers(thisValue, submitNewUserFunc, formName) {
  const form = document.forms[formName];

  form.addEventListener("focusin", focusinEventHandler);
  function focusinEventHandler(e) {
    focusinInputHandler(e);
  }

  form.addEventListener("submit", submitEventHandler);
  async function submitEventHandler(e) {
    e.preventDefault();

    await callFormSaveButtonSubmitHandlerWithTryCatch(thisValue, submitNewUserFunc, form);
  }

  form.addEventListener("error", (e) => {
    console.log("form error handler", e);
  });
}

function focusinInputHandler(e) {
  if (e.target.tagName === "INPUT") e.target.classList.remove("invalid");
}

async function formSaveButtonSubmitHandler(thisValue, submitNewUserFunc, form) {
  let newUser = {};
  let validFormElements = true;
  for (let input of form.elements) {
    if (input.tagName === "INPUT") {
      if (!input.value.trim()) {
        input.classList.add("invalid");
        validFormElements = false;
      } else {
        const [prop] = input.name.match(/-\w+-/g);
        const normalizedProp = prop.replaceAll("-", "");
        newUser[normalizedProp] = input.value;
      }
    }
  }

  if (!validFormElements) throw new ValidationError("Invalid input values");

  for (let input of form.elements) {
    if (input.tagName === "INPUT") {
      input.value = "";
    }
  }

  form.elements["save-btn"].setAttribute("disabled", true);

  try {
    await submitNewUserFunc.call(thisValue, newUser);
    form.elements["save-btn"].removeAttribute("disabled");
  } catch (error) {
    form.elements["save-btn"].removeAttribute("disabled");

    if (error instanceof ConcurrencyError) {
      throw new MyError(`Concurrency error occured ${error.message}`, error.stack);
    }

    throw new MyError(error.message, error.stack);
  }
}

export { addFormHandlers, focusinInputHandler, callFormSaveButtonSubmitHandlerWithTryCatch };
