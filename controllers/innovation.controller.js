var Database = require("../common/db.js")
var db = new Database();

module.exports.getIndex = function (req, res) {
    res.render('Innovation/Index');
}

module.exports.getPartRequest = function (req, res) {
    try {
        db.excuteQuery("SELECT * FROM mec_sparepart_request", function (data) {
            res.end(JSON.stringify(data));
        });
    }
    catch (error) {
        logHelper.writeLog("innovation.getPartRequest", error);
    }
}

module.exports.filterRequest = function (req, res) {
    try {

        //paramesters
        let status = req.body.status;
        let date = req.body.date;

        // execute
        db.excuteSP(`CALL USP_Part_Request_Processing_Get (${status}, '${date}')`, function (data) {
            res.end(JSON.stringify(data));
        });
    }
    catch (error) {
        logHelper.writeLog("innovation.getPartRequest", error);
    }
}

module.exports.suggestPart = function (req, res) {
    try {
        //paramesters
        let keyword = req.body.keyword;
        let pageSize = req.body.pageSize;

        // execute
        db.excuteQuery(`SELECT id, part_code, name, image, location FROM mec_part WHERE name LIKE '%${keyword}%' LIMIT ${pageSize}`, function (data) {
            res.end(JSON.stringify({rs: true, msg: "", data: data}));
        });
    }
    catch (error) {
        logHelper.writeLog("innovation.suggestPart", error);
    }
}

