export enum RequestErrorsEnum {
  null = "ERR_NOT_FOUND",
  dup = "ERR_DUPLICATE_ITEM",
}

export class RequestErrors {
  badRequest() {
    return "Invalid request.";
  }

  internalServer() {
    return "Unexpected server error. Please try again";
  }

  incorrectEmail(email: string) {
    return `Could not find account ${email}`;
  }

  duplicateEmail(email: string) {
    return `Account ${email} already exists`;
  }

  incorrectPassword() {
    return "Incorrect password. Please try again";
  }

  nullResult() {
    return "Unable to access the requested resource";
  }

  duplicateList(type: string, name: string) {
    return `${type} list ${name} already exists`;
  }

  duplicateShopItem(itemName: string) {
    return `${itemName} already added`;
  }
}

export class ValidatorErrors {
  badRequest() {
    return "Invalid request";
  }

  invalidField() {
    return "Invalid request";
  }

  nullField(fieldName: string) {
    return `"${fieldName}" cannot be blank`;
  }

  maxLength(fieldName: string, maxChar: number) {
    return `"${fieldName}" exceeds character limit (${maxChar})`;
  }
}
