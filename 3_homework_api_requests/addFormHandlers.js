function addFormHandlers(thisValue, submitNewUserFunc, formName) {
  const form = document.forms[formName];

  form.addEventListener("focusin", focusinEventHandler);
  function focusinEventHandler(e) {
    focusinInputHandler(e);
  }

  form.addEventListener("submit", submitEventHandler);
  async function submitEventHandler(e) {
    e.preventDefault();

    await formSaveButtonSubmitHandler(thisValue, submitNewUserFunc, form);
  }
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

  if (!validFormElements) return;

  for (let input of form.elements) {
    if (input.tagName === "INPUT") {
      input.value = "";
    }
  }

  form.elements["save-btn"].setAttribute("disabled", true);

  await submitNewUserFunc.call(thisValue, newUser);

  form.elements["save-btn"].removeAttribute("disabled");
}

export { addFormHandlers, focusinInputHandler, formSaveButtonSubmitHandler };
