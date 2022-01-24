import UserVisualizer from "./usersVisualizer.js";
import { addFormHandlers } from "./addFormHandlers.js";
import { MyError } from "./errors/errors.js";

class GlobalErrorHandler {
  constructor() {
    this.manageError = this.manageError.bind(this);
    this.windowOnErrorHandler = this.windowOnErrorHandler.bind(this);
  }
  async main() {
    window.addEventListener("CustomWindowErrorListener", this.windowOnErrorHandler);

    try {
      const userVisualizer = new UserVisualizer();

      addFormHandlers(userVisualizer, userVisualizer.addNewUser, "user-form");

      await userVisualizer.visualizeUsers();
    } catch (error) {
      this.manageError(error);
    }
  }

  windowOnErrorHandler(event) {
    this.manageError(event.detail.error);
  }

  manageError(error) {
    if (error instanceof MyError) {
      console.log("error.name: ", error.name);
      console.log("error.cause: ", error.cause);
    } else {
      console.log("unknown error", error);
    }
  }
}

const errorHandler = new GlobalErrorHandler();

errorHandler.main();
