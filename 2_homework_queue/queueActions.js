import MyQueue from "./queue.js";
import { loadState, saveState, resetState } from "./localStorage.js";

const queueContainerEl = document.querySelector(".queue-container");

const frontDataEl = document.querySelector(".front-data");
const rearDataEl = document.querySelector(".rear-data");
const maxItemsEl = document.querySelector(".max-items-data");
const queueIsFullMessageEl = document.querySelector(".queue-is-full-msg");

const queueItems = queueContainerEl.children;

const queue = new MyQueue();

function loadQueue() {
  const state = loadState();
  if (state) {
    queue.state = state;

    queue.arr.forEach((num, index) => {
      appendNewQueueItem(num, index);
    });
  }

  displayQueueInfo();
}

function displayQueueInfo() {
  frontDataEl.innerText = `: ${queue.front},`;
  rearDataEl.innerText = `: ${queue.rear},`;
  maxItemsEl.innerText = `: ${queue.max}`;

  if (queue.rear - queue.front < queue.max) {
    queueIsFullMessageEl.innerText = "you can add more items";
  } else {
    queueIsFullMessageEl.innerText = "queue is full, please dequeue to add new items";
  }
}

function appendNewQueueItem(text, index) {
  const div = document.createElement("div");
  div.classList.add("queue-item");
  div.dataset.indexOfNum = `${index}`;
  if (text) {
    div.innerText = `${text}`;
  } else {
    markItemRemoved(div);
  }
  queueContainerEl.appendChild(div);
}

function setMaxItemsQueue(num) {
  queue.max = num;
  displayQueueInfo();
}

function enqueue(text) {
  if (queue.rear - queue.front < queue.max) {
    const index = queue.push(text);
    appendNewQueueItem(text, index);

    saveState(queue.state);
    displayQueueInfo();

    return true;
  }

  return false;
}

function dequeue() {
  const { num, previousFront } = queue.pop();
  if (num === -1) return false;

  const elemToRemove = Array.from(queueItems).find((el) => Number(el.dataset.indexOfNum) === previousFront);
  markItemRemoved(elemToRemove);

  saveState(queue.state);
  displayQueueInfo();
  return true;
}

function markItemRemoved(removedElem) {
  removedElem.innerText = "removed item";
  removedElem.classList.add("queue-item-removed");
}

function resetQueue() {
  resetState();

  queue.reset();
  Array.from(queueItems).forEach((item) => item.remove());

  saveState(queue.state);
  displayQueueInfo();
}

export { enqueue, dequeue, loadQueue, resetQueue, setMaxItemsQueue };
