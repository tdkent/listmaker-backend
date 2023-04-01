// export enum ErrorMsgEnum {
//   badRequest = "Client error: malformed request syntax",
//   internalServer = "An unexpected server error occurred, please try again.",
//   incorrectEmail = "Count not find an account using the submitted email address. Please try again, or create a new account.",
//   incorrectPassword = "The password you submitted does not match our records. Please try again.",
//   duplicateEmail = "An account using the submitted email address already exists.",
//   nullResult = "We were unable to access the requested resource. The resource either does not exist, or you are not authorized.",
//   duplicateList = "Duplicate list name found. Please submit a new name or delete the old list.",
// }

// export enum ValidatorMsgEnum {
//   badRequest = "Client error: malformed request syntax",
//   invalidField = "Client error: invalid field format or selection",
//   nullField = "This field cannot be blank",
//   maxLength24 = "Exceeds maximum character limit: 24",
// }

export class RequestErrors {
  badRequest() {
    return "Client error: malformed request syntax";
  }

  internalServer() {
    return "An unexpected server error occurred, please try again.";
  }

  incorrectEmail(email: string) {
    return `An account with email address ${email} does not exist. Create a new account?`;
  }

  duplicateEmail(email: string) {
    return `An account with email address ${email} already exists. Do you want to log in?`;
  }

  incorrestPassword() {
    return "The password you entered does not match our records. Please try again.";
  }

  nullResult() {
    return "Unable to access the requested resource. The resource either does not exist, or you are not authorized.";
  }

  duplicateList(name: string) {
    return `You already have a list called ${name}. Please enter a new name, or delete the old list.`;
  }
}

export class ValidatorErrors {
  badRequest() {
    return "Client error: malformed request syntax";
  }

  invalidField() {
    return "Client error: invalid field format or selection";
  }

  nullField(fieldName: string) {
    return `${fieldName} cannot be blank`;
  }

  maxLength(fieldName: string, maxChar: number) {
    return `${fieldName} exceeds max character limit (${maxChar})`;
  }
}
