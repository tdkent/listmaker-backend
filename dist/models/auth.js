"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserData = exports.NewUser = void 0;
class NewUser {
    constructor(userEmail, userPassword) {
        this.userEmail = userEmail;
        this.userPassword = userPassword;
    }
}
exports.NewUser = NewUser;
class UserData {
    constructor(userId, userEmail, token) {
        this.userId = userId;
        this.userEmail = userEmail;
        this.token = token;
    }
}
exports.UserData = UserData;
