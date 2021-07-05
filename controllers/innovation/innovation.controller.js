var formidable = require('formidable');
var fs = require('fs');
var Database = require("../../common/db.js")
const db = new Database();
const helper = require('../../common/helper.js');
const logHelper = require('../../common/log.js');
const config = require('../../config.js');
const constant = require('../../common/constant');
const excel = require('exceljs');

// Part
module.exports.getIndex = function (req, res) {
    res.render('Innovation/Index');
}

// suggest part while creating sparepart request
module.exports.suggestPart = function (req, res) {
    try {
        //parameters
        let keyword = req.body.keyword;
        let pageSize = req.body.pageSize;

        // execute
        let query = `SELECT id, code, quantity, name, image, location, unit FROM mec_part WHERE name LIKE '%${keyword}%' LIMIT ${pageSize}`;
        db.excuteQuery(query, function (result) {
            if (!result.rs) {
                res.end(JSON.stringify({ rs: false, msg: result.msg.message }));
            }
            else {
                res.end(JSON.stringify({ rs: true, msg: "Thành công", data: result.data }));
            }
        });
    }
    catch (error) {
        logHelper.writeLog("innovation.suggestPart", error);
    }
}

// display all warning part
module.exports.getWarningPart = function (req, res) {
    try {
        //parameters
        let keyword = req.body.keyword;

        // execute
        db.excuteSP(`CALL USP_Part_Warning_Get ('${keyword}')`, function (result) {
            if (!result.rs) {
                res.end(JSON.stringify({ rs: false, msg: result.msg.message }));
            }
            else {
                res.end(JSON.stringify({ rs: true, msg: "Thành công", data: result.data }));
            }
        });
    }
    catch (error) {
        logHelper.writeLog("innovation.getWarningPart", error);
    }
}

module.exports.downloadWarningPart = function (req, res) {
    try {
        //parameters
        let keyword = req.body.keyword;

        // execute
        db.excuteSP(`CALL USP_Part_Warning_Get ('${keyword}')`, function (result) {
            if (!result.rs) {
                return res.end(JSON.stringify({ rs: false, msg: result.msg.message }));
            }
            else {

                let jsonWaringPart = JSON.parse(JSON.stringify(result.data));

                let workbook = new excel.Workbook(); //creating workbook
                let worksheet = workbook.addWorksheet('Warning part'); //creating worksheet

                //  WorkSheet Header
                worksheet.columns = [
                    { header: 'Id', key: 'id', width: 10 },
                    { header: 'Name', key: 'name', width: 30 },
                    { header: 'Code', key: 'code', width: 30 },
                    { header: 'Location', key: 'location', width: 30 }
                ];

                // Add Array Rows
                worksheet.addRows(jsonWaringPart);

                // Write to File
                let filename = "\warning_part.xlsx";
                workbook.xlsx.writeFile(filename).then(function () {
                    // return res.end(JSON.stringify({ rs: true, msg: "Thành công", data: result.data }));

                    res.download(filename);
                });
            }
        });

    } catch (error) {
        logHelper.writeLog("innovation.downloadWarningPart", error);
    }
}

// display all part
module.exports.getAllPart = function (req, res) {
    try {
        //parameters
        let keyword = req.body.keyword;

        // execute
        db.excuteSP(`CALL USP_Part_Get ('${keyword}')`, function (result) {
            if (!result.rs) {
                res.end(JSON.stringify({ rs: false, msg: result.msg.message }));
            }
            else {
                res.end(JSON.stringify({ rs: true, msg: "Thành công", data: result.data }));
            }
        });
    }
    catch (error) {
        logHelper.writeLog("innovation.getAllPart", error);
    }
}

module.exports.downloadPart = function (req, res) {
    try {
        //parameters
        let keyword = req.body.keyword;

        // execute
        db.excuteSP(`CALL USP_Part_Get ('${keyword}')`, function (result) {
            if (!result.rs) {
                return res.end(JSON.stringify({ rs: false, msg: result.msg.message }));
            }
            else {

                let jsonPart = JSON.parse(JSON.stringify(result.data));

                let workbook = new excel.Workbook(); //creating workbook
                let worksheet = workbook.addWorksheet('Part'); //creating worksheet

                //  WorkSheet Header
                worksheet.columns = [
                    { header: 'Id', key: 'id', width: 10 },
                    { header: 'Name', key: 'name', width: 30 },
                    { header: 'Code', key: 'code', width: 30 },
                    { header: 'Location', key: 'location', width: 30 }
                ];

                // Add Array Rows
                worksheet.addRows(jsonPart);

                // Write to File
                let filename = "\part.xlsx";
                workbook.xlsx.writeFile(filename).then(function () {
                    // return res.end(JSON.stringify({ rs: true, msg: "Thành công", data: result.data }));

                    res.download(filename);
                });
            }
        });

    } catch (error) {
        logHelper.writeLog("innovation.downloadPart", error);
    }
}

module.exports.getPartDetail = function (req, res) {
    try {
        //parameters
        let id = req.params.id;

        // execute
        db.excuteSP(`SELECT * FROM mec_part WHERE id = ${id}`, function (result) {
            if (!result.rs) {
                res.end(JSON.stringify({ rs: false, msg: result.msg.message }));
            }
            else {
                res.end(JSON.stringify({ rs: true, msg: "Thành công", data: result.data }));
            }
        });
    }
    catch (error) {
        logHelper.writeLog("innovation.getPartDetail", error);
    }
}

// upload part image
module.exports.upload = function (req, res) {
    try {
        let form = new formidable.IncomingForm();

        form.parse(req, function (err, fields, file) {
            if (err)
                return res.redirect(303, 'Error');

            fs.rename(file.file.path, config.imageFilePath + file.file.name, function (err) {
                if (err)
                    throw err;
                console.log('upload successfully');
            });

            res.end();
        });
    } catch (error) {
        logHelper.writeLog("innovation.upload", error);
    }
}

module.exports.addPart = async function (req, res) {
    try {
        //parameters
        let name = req.body.name;
        let code = req.body.code;
        let qty = req.body.qty;
        let min_qty = req.body.min_qty;
        let location = req.body.location;
        let des = req.body.des;
        let user = req.user.username;
        let datetime = helper.getDateTimeNow();
        let img = req.body.img ? req.body.img.split("\\")[2] : "";

        // var base64Data = req.body.img.replace(/^data:image\/png;base64,/, "");
        // fs.writeFile(config.imageFilePath + "out.png", base64Data, 'base64', function(err) {
        //     console.log(err);
        // });

        // check exist
        let partObj = await innovationService.getPartDetail({code: code.trim()});
        if(partObj.length > 0){
            return res.end(JSON.stringify({ rs: false, msg: `Đẫ tồn tại part có mã code ${code}` }));
        }

        // execute
        let query = `INSERT INTO mec_part (name, code, quantity, min_quantity, location, description, image, last_update, user_update) 
                    VALUES('${name}', '${code}', ${qty}, ${min_qty}, '${location}', '${des}', '${img}', '${datetime}', '${user}')`;
        db.excuteQuery(query, function (result) {
            if (!result.rs) {
                return res.end(JSON.stringify({ rs: false, msg: result.msg.message }));
            }
            else {
                return res.end(JSON.stringify({ rs: true, msg: "Thành công", data: result.data }));
            }
        });
    }
    catch (error) {
        logHelper.writeLog("innovation.addMachine", error);
    }
}

module.exports.updatePart = function (req, res) {
    try {
        //parameters
        let id = req.body.id;
        let name = req.body.name;
        let code = req.body.code;
        let qty = req.body.qty;
        let location = req.body.location;
        let des = req.body.des;
        let user = req.user.username;
        let datetime = helper.getDateTimeNow();

        // execute
        let query = `UPDATE mec_part
                    SET name = '${name}', code = '${code}', quantity = '${qty}', location = '${location}', 
                    last_update = '${datetime}', user_update = '${user}', description = '${des}'
                    WHERE id = ${id}`;

        db.excuteQuery(query, function (result) {
            if (!result.rs) {
                res.end(JSON.stringify({ rs: false, msg: result.msg.message }));
            }
            else {
                res.end(JSON.stringify({ rs: true, msg: "Thành công", data: result.data }));
            }
        });
    }
    catch (error) {
        logHelper.writeLog("innovation.updatePart", error);
    }
}

// Spare Part request
module.exports.getPartRequest = function (req, res) {
    try {
        //parameters
        let status = req.body.status;
        let fromDate = req.body.date;
        let toDate = req.body.date;

        // execute
        db.excuteSP(`CALL USP_Part_Request_Processing_Get ('${status}', '${fromDate}', '${toDate}')`, function (result) {
            if (!result.rs) {
                res.end(JSON.stringify({ rs: false, msg: result.msg.message }));
            }
            else {
                res.end(JSON.stringify({ rs: true, msg: "Thành công", data: result.data }));
            }
        });
    }
    catch (error) {
        logHelper.writeLog("innovation.getPartRequest", error);
    }
}

module.exports.getRequestDetail = function (req, res) {
    try {
        //parameters
        let id = req.params.id;

        // execute
        db.excuteSP(`SELECT * FROM mec_sparepart_request WHERE id = ${id}`, function (result) {
            if (!result.rs) {
                res.end(JSON.stringify({ rs: false, msg: result.msg.message }));
            }
            else {
                res.end(JSON.stringify({ rs: true, msg: "Thành công", data: result.data }));
            }
        });
    }
    catch (error) {
        logHelper.writeLog("innovation.getRequestDetail", error);
    }
}

module.exports.addRequest = function (req, res) {
    try {
        //parameters
        let name = req.body.name;
        let code = req.body.code;
        let qty = req.body.qty;
        let location = req.body.location;
        let tag = req.body.tag;
        let reason = req.body.reason;

        let user = req.user.username;
        let datetime = helper.getDateTimeNow();

        // execute
        let query = `INSERT INTO mec_sparepart_request (name, code, qty, export_qty, tag_machine, location, reason, request_date, requester) 
                    VALUES('${name}', '${code}', ${qty}, 0, '${tag}', '${location}', '${reason}', '${datetime}', '${user}')`;
        db.excuteQuery(query, function (result) {
            if (!result.rs) {
                res.end(JSON.stringify({ rs: false, msg: result.msg.message }));
            }
            else {
                res.end(JSON.stringify({ rs: true, msg: "Thành công", data: result.data }));
            }
        });
    }
    catch (error) {
        logHelper.writeLog("innovation.addMachine", error);
    }
}

var innovationService = require("../../services/innovation.service");
module.exports.updateRequest = async function (req, res, next) {
    try {
        // Check exist
        var objReq = await innovationService.getRequestDetail(req.body);
        if (!objReq)
            return res.end(JSON.stringify({ rs: false, msg: "Không tìm thấy request" }));

        // Check has processed
        if (objReq[0].clerk_status != constant.Action_Status.None)
            return res.end(JSON.stringify({ rs: false, msg: "Request đã được clerk xử lý" }));

        // Excute update
        var isSuccess = await innovationService.updateRequest(req.body);
        if (isSuccess <= 0)
            return res.end(JSON.stringify({ rs: false, msg: result.msg.message }));
        else {
            var partObj = await innovationService.getPartDetail({ code: objReq[0].code });
            if (partObj.length > 0) {
                if (partObj[0].quantity > 0) {
                    // update quantity in mec_part: substract the quantity
                    isSuccess = await innovationService.updatePartQuantity({ export_qty: req.body.export_qty, code: objReq[0].code });
                    if (isSuccess <= 0)
                        return res.end(JSON.stringify({ rs: false, msg: "Cập nhật số lượng part trong kho không thành công" }));
                    return res.end(JSON.stringify({ rs: true, msg: "Thành công" }));
                }
            }
            return res.end(JSON.stringify({ rs: true, msg: "Thành công" }));
        }
    }
    catch (error) {
        logHelper.writeLog("innovation.updateRequest", error);
    }
}

module.exports.downloadRequest = function (req, res) {
    try {
        //parameters
        let status = req.body.status;
        let fromDate = req.body.fromDate;
        let toDate = req.body.toDate;

        // execute
        db.excuteSP(`CALL USP_Part_Request_Processing_Get ('${status}', '${fromDate}', '${toDate}')`, function (result) {
            if (!result.rs) {
                res.end(JSON.stringify({ rs: false, msg: result.msg.message }));
            }
            else {
                let jsonMachine = JSON.parse(JSON.stringify(result.data));

                let workbook = new excel.Workbook(); //creating workbook
                let worksheet = workbook.addWorksheet('Machine'); //creating worksheet

                //  WorkSheet Header
                worksheet.columns = [
                    { header: 'Id', key: 'id', width: 10 },
                    { header: 'Name', key: 'name', width: 30 },
                    { header: 'Code', key: 'code', width: 30 },
                    { header: 'Qty', key: 'qty', width: 30 }
                ];

                // Add Array Rows
                worksheet.addRows(jsonMachine);

                // Write to File
                let filename = "\sparepart.xlsx";
                workbook.xlsx.writeFile(filename).then(function () {
                    res.download(filename);
                });
            }
        });

    } catch (error) {
        logHelper.writeLog("innovation.downloadRequest", error);
    }
}