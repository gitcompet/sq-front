import { ErrorHandler } from "@angular/core";

export class ErrorHandlerComponent implements ErrorHandler {
  handleError(error: any): void {
    console.log(error);
  }

}
