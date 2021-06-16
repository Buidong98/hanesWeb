'use strict';
class UserModel{
    constructor(username, fullname, dept, roles, email){
        this.username = username;
        this.fullname = fullname;
        this.dept = dept;
        this.roles = roles;
        this.email = email;
    }
}

module.exports = UserModel;
