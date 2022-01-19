import { enqueue, dequeue, resetQueue, setMaxItemsQueue } from "./queueActions.js";

function addFormHandlers() {
  const form = document.getElementById("queue-form");

  const input = form.elements["queue-input"];
  const enqueueBtn = form.elements["enqueue-btn"];
  const dequeueBtn = form.elements["dequeue-btn"];
  const resetBtn = form.elements["reset-btn"];

  input.addEventListener("focusout", focusOutEventHandler);
  input.addEventListener("focusin", focusinEventHandler);
  input.addEventListener("input", inputEventHandler);

  form.addEventListener("submit", submitEventHandler);
  form.addEventListener(
    "focus",
    () => {
      if (!form.classList.contains("focused")) {
        form.classList.add("focused");
      }
    },
    true
  );

  function focusOutEventHandler(e) {
    if (!input.value && !input.hasAttribute("disabled")) {
      input.classList.add("invalid");
    } else {
      input.classList.remove("invalid");
    }
  }

  function focusinEventHandler(e) {
    input.classList.remove("invalid");
  }

  function inputEventHandler(e) {
    if (e.target.value) {
      enqueueBtn.removeAttribute("disabled");
    } else {
      enqueueBtn.setAttribute("disabled", true);
    }
  }

  function submitEventHandler(e) {
    e.preventDefault();

    const submitter = e.submitter;

    if (submitter === enqueueBtn) {
      const newValue = input.value.trim();
      input.value = "";

      console.log(newValue);
      const isAllowedToEnqueue = enqueue(newValue);

      if (!isAllowedToEnqueue) {
        input.setAttribute("disabled", true);
      }

      enqueueBtn.setAttribute("disabled", true);
      dequeueBtn.removeAttribute("disabled");
      form.focus();
    } else if (submitter === dequeueBtn) {
      input.removeAttribute("disabled");

      const result = dequeue();
      if (!result) {
        dequeueBtn.setAttribute("disabled", true);
      } else if (submitter.hasAttribute("disabled")) {
        dequeueBtn.removeAttribute("disabled");
      }
    } else if (submitter === resetBtn) {
      input.removeAttribute("disabled");

      resetQueue();
    }
  }
}

function addSetMaxNumHandler() {
  const inputMaxNum = document.getElementById("input-max-num");
  const btnMaxNum = document.getElementById("maximum-items-btn");

  inputMaxNum.addEventListener("input", inputEventHandler);
  inputMaxNum.addEventListener("keydown", keydownEventHandler);

  btnMaxNum.addEventListener("click", setMaxItemsQueueHandler);
  let maxItemsNum = 0;

  function inputEventHandler(e) {
    const value = e.target.value.trim();

    testIfValueIsNumAssignItAndSetAttributes(value);
  }

  function testIfValueIsNumAssignItAndSetAttributes(value) {
    if (testIfNum(value)) {
      btnMaxNum.removeAttribute("disabled");
      maxItemsNum = Number(value);
    } else {
      btnMaxNum.setAttribute("disabled", true);
    }
  }

  function testIfNum(text) {
    const moreThanOneNumRegex = /\d+/g;
    return moreThanOneNumRegex.test(text);
  }

  function keydownEventHandler(e) {
    const key = e.key;
    if (key == "Enter") {
      setMaxItemsQueueEnterHandler();
      inputMaxNum.classList.remove("invalid");
    } else {
      const res = checkNumberKey(key);
      if (!res) {
        inputMaxNum.classList.add("invalid");
        e.preventDefault();
      } else {
        inputMaxNum.classList.remove("invalid");
      }
    }
  }

  function checkNumberKey(key) {
    return (
      (key >= "0" && key <= "9") || key == "ArrowLeft" || key == "ArrowRight" || key == "Delete" || key == "Backspace"
    );
  }

  function setMaxItemsQueueEnterHandler() {
    testIfValueIsNumAssignItAndSetAttributes(inputMaxNum.value.trim());
    setMaxItemsQueueHandler();
  }

  function setMaxItemsQueueHandler() {
    setMaxItemsQueue(maxItemsNum);
    inputMaxNum.value = null;
    btnMaxNum.setAttribute("disabled", true);
  }
}

export { addFormHandlers, addSetMaxNumHandler };
