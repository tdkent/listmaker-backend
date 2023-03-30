"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserData = exports.UserLoginReqEnum = exports.UserRegisterReqEnum = void 0;
var UserRegisterReqEnum;
(function (UserRegisterReqEnum) {
    UserRegisterReqEnum["email"] = "userEmail";
    UserRegisterReqEnum["name"] = "userNickname";
    UserRegisterReqEnum["pass"] = "userPassword";
})(UserRegisterReqEnum = exports.UserRegisterReqEnum || (exports.UserRegisterReqEnum = {}));
var UserLoginReqEnum;
(function (UserLoginReqEnum) {
    UserLoginReqEnum["email"] = "userEmail";
    UserLoginReqEnum["pass"] = "userPassword";
})(UserLoginReqEnum = exports.UserLoginReqEnum || (exports.UserLoginReqEnum = {}));
class UserData {
    constructor(userId, userEmail, token) {
        this.userId = userId;
        this.userEmail = userEmail;
        this.token = token;
    }
}
exports.UserData = UserData;
