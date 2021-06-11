var logHelper = require("../common/log.js");
var mysql = require("mysql");
var con = mysql.createConnection({
    host: "hyspayqsqlv",
    port: 3306,
    user: "root",
    password: "Hy$2020",
    database: "mec_system"
});
con.connect(function (err) {
    if (err)
        logHelper.writeLog("con.connect", err.message);
});
class Database {

    excuteQuery(queryString, callback){
        try {
            con.query(queryString, function (err, result, fields) {
                if (err)
                    throw err;
                callback(result);
            })
        }
        catch(error) {
            logHelper.writeLog("excuteQuery", error.message);
            return null;
        }
    }

    excuteSP(queryString, callback){
        try {
            con.query(queryString, function (err, result, fields) {
                if (err)
                    throw err;
                callback(result[0]);
            })
        }
        catch(error) {
            logHelper.writeLog("excuteSP", error.message);
            return null;
        }
    }
}

module.exports = Database;