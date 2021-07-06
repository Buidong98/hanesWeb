var Database = require("../../common/db.js")
const db = new Database();
const helper = require('../../common/helper.js');
const logHelper = require('../../common/log.js');
const config = require('../../config.js');
const constant = require('../../common/constant');
const excel = require('exceljs');
const innovationService = require("../../services/innovation.service");

// Machine
module.exports.getImportIndex = function (req, res) {
    res.render('Innovation/ImportPart/ImportPartIndex');
}

module.exports.getImport = function (req, res) {
    try {
        //parameters
        let po = req.body.po;
        let importDate = req.body.importDate;
        let vendor = req.body.vendor;

        // execute
        db.excuteSP(`CALL USP_Part_Import_Get ('${po}', '${importDate}', '${vendor}')`, function (result) {
            if (!result.rs) {
                res.end(JSON.stringify({ rs: false, msg: result.msg.message }));
            }
            else {
                res.end(JSON.stringify({ rs: true, msg: "Thành công", data: result.data }));
            }
        });
    }
    catch (error) {
        logHelper.writeLog("innovation.getMachine", error);
    }
}

module.exports.addUI = function (req, res) {
    res.render("Innovation/ImportPart/AddImportRequest");
}

module.exports.addImportRequest = async function (req, res) {
    try {
        //parameters
        let importInfo = req.body.importInfo;
        let listPart = req.body.listPart;

        let user = req.user.username;
        let datetime = helper.getDateTimeNow();

        // add import request then return id to insert into import request detail
        let idInserted = await innovationService.addImportRequest({
            po: importInfo.po,
            importDate: importInfo.importDate,
            vendor: importInfo.vendor,
            receiver: importInfo.receiver,
            deliverer: importInfo.deliverer,
            requestDate: datetime,
            user: user
        });
        if (idInserted <= 0)
            return res.end(JSON.stringify({ rs: false, msg: "Thêm import request không thành công." }));

        // add import request detail
        let arr = [];
        for (let i = 0; i < listPart.length; i++) {
            let eleArr = [];
            let ele = listPart[i];
            for (let j = 0; j < Object.values(ele).length; j++) {
                eleArr.push(Object.values(ele)[j]);
            }
            eleArr.push(idInserted);
            arr.push(eleArr);
        }

        let isAddDetailSuccess = await innovationService.addImportRequestDetail(arr);
        if (isAddDetailSuccess <= 0)
            return res.end(JSON.stringify({ rs: false, msg: "Thêm chi tiết không thành công." }));
        return res.end(JSON.stringify({ rs: true, msg: "Thêm import request thành công." }));
    }
    catch (error) {
        logHelper.writeLog("innovation.addMachine", error);
    }
}

module.exports.getImportDetail = async function (req, res) {
    try {
        // parameters
        let id = req.body.id;

        // get import info
        let importInfo = await innovationService.getImportDetail({ id: id });
        if (!importInfo)
            return res.end(JSON.stringify({ rs: false, msg: "Không tìm thấy thông tin nhập hàng" }));

        // get import detail item
        let importDetail = await innovationService.getImportDetailItem({ id: id });
        if (!importDetail)
            return res.end(JSON.stringify({ rs: false, msg: "Không tìm thấy thông tin chi tiết nhập hàng" }));

        return res.end(JSON.stringify({ rs: true, msg: "", data: { info: importInfo[0], items: importDetail } }));
    }
    catch (error) {
        logHelper.writeLog("innovation.getMachineDetail", error);
    }
}

module.exports.updateImportRequest = async function (req, res) {
    try {
        //parameters
        let importInfo = req.body.importInfo;
        let listPart = req.body.listPart;

        let user = req.user.username;
        let datetime = helper.getDateTimeNow();

        // update import request
        let isUpdateSuccess = await innovationService.updateImportRequest({
            id: importInfo.id,
            importDate: importInfo.importDate,
            vendor: importInfo.vendor,
            receiver: importInfo.receiver,
            deliverer: importInfo.deliverer
        });
        if (isUpdateSuccess <= 0)
            return res.end(JSON.stringify({ rs: false, msg: "Cập nhật thông tin import request không thành công." }));

        // delete all existed item detail
        let isDeleteSuces = await innovationService.deleteImportDetailItem({ id: importInfo.id });
        // if (isDeleteSuces <= 0)
        //     return res.end(JSON.stringify({ rs: false, msg: "Xóa chi tiết không thành công." }));

        // add import request detail
        let arr = [];
        for (let i = 0; i < listPart.length; i++) {
            let eleArr = [];
            let ele = listPart[i];
            for (let j = 0; j < Object.values(ele).length; j++) {
                eleArr.push(Object.values(ele)[j]);
            }
            eleArr.push(importInfo.id);
            arr.push(eleArr);
        }

        let isAddDetailSuccess = await innovationService.addImportRequestDetail(arr);
        if (isAddDetailSuccess <= 0)
            return res.end(JSON.stringify({ rs: false, msg: "Cập nhật chi tiết không thành công." }));
        return res.end(JSON.stringify({ rs: true, msg: "Cập nhật import request thành công." }));
    }
    catch (error) {
        logHelper.writeLog("innovation.updateImportRequest", error);
    }
}

module.exports.downloadImportRequest = function (req, res) {
    try {
        //parameters
        let vendor = req.body.vendor;
        let filterDate = req.body.filterDate;

        // execute
        db.excuteSP(`CALL USP_Part_Import_Download ('${vendor}', '${filterDate.split(';')[0]}', '${filterDate.split(';')[1]}')`, function (result) {
            if (!result.rs) {
                res.end(JSON.stringify({ rs: false, msg: result.msg.message }));
            }
            else {
                let jsonMachine = JSON.parse(JSON.stringify(result.data));

                let workbook = new excel.Workbook(); //creating workbook
                let worksheet = workbook.addWorksheet('Import'); //creating worksheet

                //  WorkSheet Header
                worksheet.columns = [
                    { header: 'Part', key: 'part_code', width: 10 },
                    { header: 'Qty', key: 'total', width: 30 },
                    { header: 'Price', key: 'price', width: 30 },
                    { header: 'Money', key: 'money', width: 30 },
                ];

                // Add Array Rows
                worksheet.addRows(jsonMachine);

                // Write to File
                let filename = "\import_request.xlsx";
                workbook.xlsx.writeFile(filename).then(function () {
                    res.download(filename);
                });
            }
        });

    } catch (error) {
        logHelper.writeLog("innovation.downloadImportRequest", error);
    }
}