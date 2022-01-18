import { enqueue, dequeue, resetQueue } from "./queueActions.js";

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
    if (e.target.tagName === "INPUT") {
      if (!input.value) {
        input.classList.add("invalid");
      } else {
        input.classList.remove("invalid");
      }
    }
  }

  function focusinEventHandler(e) {
    if (e.target.tagName === "INPUT") {
      input.classList.remove("invalid");
    }
  }

  function inputEventHandler(e) {
    if (e.target.tagName === "INPUT") {
      if (e.target.value) {
        enqueueBtn.removeAttribute("disabled");
      } else {
        enqueueBtn.setAttribute("disabled", true);
      }
    }
  }

  function submitEventHandler(e) {
    e.preventDefault();

    const submitter = e.submitter;

    if (submitter === enqueueBtn) {
      const newValue = input.value.trim();
      input.value = "";

      console.log(newValue);
      enqueue(newValue);

      enqueueBtn.setAttribute("disabled", true);
      dequeueBtn.removeAttribute("disabled");
      form.focus();
    } else if (submitter === dequeueBtn) {
      const result = dequeue();
      if (result === -1) {
        dequeueBtn.setAttribute("disabled", true);
      } else if (submitter.hasAttribute("disabled")) {
        dequeueBtn.removeAttribute("disabled");
      }
    } else if (submitter === resetBtn) {
      resetQueue();
    }
  }
}

export default addFormHandlers;
