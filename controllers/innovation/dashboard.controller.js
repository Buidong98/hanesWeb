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

module.exports.getStatistic = async function (req, res){
    let now = new Date();
    let year = new Date().getFullYear();
    let dateNow = helper.getDateTimeNow().substr(0, 10);
    let dayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    let firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    let lastDay = new Date(now.getFullYear(), now.getMonth(), dayOfMonth);
    let firstDayStr = firstDay.getDate().toString().padStart(2, "0") + '/' + (firstDay.getMonth() + 1).toString().padStart(2, "0") + '/' + firstDay.getFullYear();
    let lastDayStr =  lastDay.getDate().toString().padStart(2, "0") + '/' + (lastDay.getMonth() + 1).toString().padStart(2, "0") + '/' + lastDay.getFullYear();

    // widget 1: count part
    let query = `SELECT COUNT(1) FROM mec_part`;
    let countPart = await db.excuteQueryAsync(query);
    // widget 2: count processing request
    query = `SELECT COUNT(1) FROM mec_sparepart_request WHERE SUBSTRING(request_date, 1, 10) = '${dateNow}'`;
    let countRequest = await db.excuteQueryAsync(query);
    // widget 3: export fee
    query = `CALL USP_Part_Export_Report_Download ('${firstDayStr}', '${lastDayStr}', '', 1)`;
    let exportFee = await db.excuteQueryAsync(query);
    // widget 4: import fee
    query = `CALL USP_Part_Import_Download ('', '${firstDayStr}', '${lastDayStr}')`;
    let importFee = await db.excuteQueryAsync(query);

    let barChartData = {
        data1 :  [],
        data2 :  []
    };
    let months = [
        `01/01/${year};31/01/${year}`,
        `01/02/${year};28/02/${year}`,
        `01/03/${year};31/03/${year}`,
        `01/04/${year};30/04/${year}`,
        `01/05/${year};31/05/${year}`,
        `01/06/${year};30/06/${year}`,
        `01/07/${year};31/07/${year}`,
        `01/08/${year};31/08/${year}`,
        `01/09/${year};30/09/${year}`,
        `01/10/${year};31/10/${year}`,
        `01/11/${year};30/11/${year}`,
        `01/12/${year};31/12/${year}`
    ]

    for (let i = 0; i < months.length; i++) {
        let ele = months[i].split(";");
        let fromDate = ele[0];
        let toDate = ele[1];

        // bar chart
        query = `CALL USP_Part_Export_Report_Download ('${fromDate}', '${toDate}', '', 1)`;
        let exportFee = await db.excuteQueryAsync(query);
        if (exportFee)
            barChartData.data1.push(exportFee[0].reduce((accumulator, {money}) => accumulator + money, 0))
        else 
            barChartData.data1.push(0);
        
        query = `CALL USP_Part_Import_Download ('', '${fromDate}', '${toDate}')`;
        let importFee = await db.excuteQueryAsync(query);
        if (importFee)
            barChartData.data2.push(importFee[0].reduce((accumulator, {money}) => accumulator + money, 0))
        else 
            barChartData.data2.push(0);
    }

    let returnData = {
        part: countPart[0]["COUNT(1)"],
        request: countRequest[0]["COUNT(1)"],
        exportFee: exportFee[0].reduce((accumulator, {money}) => accumulator + money, 0),
        importFee: importFee[0].reduce((accumulator, {money}) => accumulator + money, 0),
        barChartData: { data1: barChartData.data1, data2: barChartData.data2 },
        // pieChartData: { data1: [], data2: [] },
    }

    return res.end(JSON.stringify({ rs: true, msg: "Thành công", data: returnData }));
}