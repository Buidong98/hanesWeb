const logHelper = require("../common/log.js");
const mysql = require("mysql");
const util = require('util');
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

// node native promisify
const query = util.promisify(con.query).bind(con);
class Database {

    async excuteQueryAsync(queryString) {
        try {
            var result = await query(queryString);
            return result;
        }
        catch (error) {
            logHelper.writeLog("excuteQueryAsync", error.message);
            return null;
        }
    }

    async excuteSPAsync(queryString) {
        try {
            var result = await query(queryString);
            return result;
        }
        catch (error) {
            logHelper.writeLog("excuteSPAsync", error.message);
            return null;
        }
    }

    async excuteNonQueryAsync(queryString) {
        try {
            var result = await query(queryString);
            return result.affectedRows;
        }
        catch (error) {
            logHelper.writeLog("excuteNonQueryAsync", error.message);
            return null;
        }
    }

    async excuteInsertReturnIdAsync(queryString) {
        try {
            var result = await query(queryString);
            return result.insertId;
        }
        catch (error) {
            logHelper.writeLog("excuteInsertReturnIdAsync", error.message);
            return 0;
        }
    }

    async excuteInsertWithParametersAsync(queryString, parameters) {
        try {
            var result = await query(queryString, [[['fsdfsadf', 'fsdfsdfsdaf', 'fsfsdaf', 11, 22, 1]]]);
            return result.affectedRows;
        }
        catch (error) {
            logHelper.writeLog("excuteInsertReturnIdAsync", error.message);
            return 0;
        }
    }

    excuteQuery(queryString, callback) {
        try {
            con.query(queryString, function (err, result, fields) {
                if (err) {
                    callback({ rs: false, msg: err });
                }
                else {
                    callback({ rs: true, msg: "", data: result });
                }
            })
        }
        catch (error) {
            logHelper.writeLog("excuteQuery", error.message);
            return null;
        }
    }

    excuteSP(queryString, callback) {
        try {
            con.query(queryString, function (err, result, fields) {
                if (err) {
                    callback({ rs: false, msg: err });
                }
                else {
                    callback({ rs: true, msg: "", data: result[0] });
                }
            })
        }
        catch (error) {
            logHelper.writeLog("excuteSP", error.message);
            return null;
        }
    }
}

module.exports = Database;