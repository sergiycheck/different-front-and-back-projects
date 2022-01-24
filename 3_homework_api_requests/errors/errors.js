class MyError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = this.constructor.name;
    this.cause = cause;
  }
}

class ConcurrencyError extends MyError {}
class ValidationError extends MyError {}
class MyHttpError extends MyError {}
class UserVisualizationError extends MyError {}

export { MyError, ConcurrencyError, ValidationError, MyHttpError, UserVisualizationError };
