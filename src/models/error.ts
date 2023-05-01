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

  incorrectPassword() {
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

  invalidPassword(count: number, property: string) {
    return `Password must contain at least ${count} ${property}`;
  }
}
