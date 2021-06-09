var fs = require('fs');
var config = require("../config")
var fileName = config.logFilePath;
var logHelper = {};

logHelper.writeLog = function(funcName, ex){
    let time = new Date().toLocaleString();
    fs.appendFile(fileName + time + "txt", time + ": " +  funcName + "\n" + ex.message + "\n" + "---------------------------------------------" + "\n", () => {

    });
}

module.exports = logHelper;