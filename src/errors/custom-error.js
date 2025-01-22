// customError.ts
const { ErrorCode, ErrorMessage } = require('./error-codes');

class CustomError extends Error {
  constructor(errorCode, message = '') {
    super(message);

    this.errorCode = errorCode;
    this.errorMessage = message;
  }

  static init() {
    return new CustomError(ErrorCode.UNKNOWN, '');
  }

  static from(error) {
    if (error instanceof CustomError) {
      return error;
    } else if (error instanceof Error) {
      return CustomError.init().setMessage(error.message);
    } else if (typeof error === 'string') {
      return CustomError.init().setMessage(error);
    } else {
      return CustomError.init();
    }
  }

  static getUnknowErrorCode() {
    const code = ErrorCode.UNKNOWN;
    return code;
  }

  static getUnknownErrorMessage() {
    const message = ErrorMessage[ErrorCode.UNKNOWN];
    return message;
  }

  setErrorCode(errorCode) {
    this.errorCode = errorCode;
    return this;
  }

  setMessage(message) {
    this.errorMessage = message;
    return this;
  }

  appendMessage(message) {
    this.errorMessage = `${this.errorMessage} -> ${message}`;
    return this;
  }

  prependMessage(message) {
    this.errorMessage = `${message} -> ${this.errorMessage}`;
    return this;
  }

  getMessage() {
    const message = `${ErrorMessage[this.errorCode]}`;
    return message;
  }

  getCode() {
    const code = this.errorCode;
    return code;
  }

  get code() {
    return this.getCode();
  }

  get message() {
    return this.getMessage();
  }
}

module.exports = CustomError;
