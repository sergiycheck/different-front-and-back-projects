import UserVisualizer from "./usersVisualizer.js";
import { addFormHandlers } from "./addFormHandlers.js";

const userVisualizer = new UserVisualizer();

addFormHandlers(userVisualizer, userVisualizer.addNewUser, "user-form");

userVisualizer.visualizeUsers();

//TODO: add all functions into array and call them in the single error handling class that will handle and check all thrown
// errors with trycatch && instanceof
