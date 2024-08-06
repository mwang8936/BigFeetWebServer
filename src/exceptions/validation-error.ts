import { CelebrateError } from "celebrate";
import { CustomError, HttpCode } from "./custom-error";

export class ValidationError extends CustomError {
  statusCode = HttpCode.BAD_REQUEST;
  constructor(public error: CelebrateError) {
    super();
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
  formatErrors() {
    const errorsMessageArray: string[] = [];
    this.error.details.forEach((errorsMap, section) => {
      for (let error of errorsMap.details.values())
        errorsMessageArray.push(`${section}: ${error.message}`);
    });

    if (errorsMessageArray.length == 1) {
      return errorsMessageArray[0];
    } else {
      return errorsMessageArray;
    }
  }
}
