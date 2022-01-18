class MyQueue {
  constructor() {
    this.reset();
  }

  reset() {
    this.front = 0;
    this.rear = 0;
    this.arr = new Array();
  }

  push(x) {
    this.arr.push(x);
    this.rear++;
    return this.rear - 1;
  }

  pop() {
    if (!this.arr.length || this.front == this.rear) return { num: -1 };

    let num = this.arr[this.front];
    let previousFront = this.front;
    delete this.arr[this.front];
    this.front++;
    return { num, previousFront };
  }

  get state() {
    const state = {
      front: this.front,
      rear: this.rear,
      arr: this.arr,
    };

    return state;
  }

  set state(data) {
    const { front, rear, arr } = data;
    this.front = front;
    this.rear = rear;
    this.arr = arr;
  }
}

export default MyQueue;
