export enum ErrorMsgEnum {
  badRequest = "Client error: malformed request syntax",
  internalServer = "An unexpected server error occurred, please try again.",
  incorrectEmail = "Count not find an account using the submitted email address. Please try again, or create a new account.",
  incorrectPassword = "The password you submitted does not match our records. Please try again.",
  duplicateEmail = "An account using the submitted email address already exists.",
  nullResult = "We were unable to access the requested resource. The resource either does not exist, or you are not authorized.",
}

export enum ValidatorMsgEnum {
  badRequest = "Client error: malformed request syntax",
}
