var Database = require("../../common/db.js")
const db = new Database();
const helper = require('../../common/helper.js');
const logHelper = require('../../common/log.js');
const config = require('../../config.js');
const constant = require('../../common/constant');
const excel = require('exceljs');
const innovationService = require("../../services/innovation.service");

// Machine
module.exports.getDashboard = function (req, res) {
    res.render('Innovation/Dashboard');
}

module.exports.getCount = async function (req, res){
    let dateNow = helper.getDateTimeNow().substr(0, 10);

    // widget 1: count part
    let query = `SELECT COUNT(1) FROM mec_part`;
    let countPart = await db.excuteQueryAsync(query);
    // widget 2: count processing request
    query = `SELECT COUNT(1) FROM mec_sparepart_request WHERE SUBSTRING(request_date, 1, 10) = '${dateNow}'`;
    let countRequest = await db.excuteQueryAsync(query);
    // widget 3: export fee
    query = `CALL USP_Part_Export_Report_Download ('01/06/2021', '31/07/2021', '', 1)`;
    let exportFee = await db.excuteQueryAsync(query);
    // widget 4: import fee
    query = `CALL USP_Part_Import_Download ('', '01/06/2021', '31/07/2021')`;
    let importFee = await db.excuteQueryAsync(query);

    let returnData = {
        part: countPart[0]["COUNT(1)"],
        request: countRequest[0]["COUNT(1)"],
        exportFee: exportFee[0].reduce((accumulator, {money}) => accumulator + money, 0),
        importFee: importFee[0].reduce((accumulator, {money}) => accumulator + money, 0)
    }

    return res.end(JSON.stringify({ rs: true, msg: "Thành công", data: returnData }));
}