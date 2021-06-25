var formidable = require('formidable');
var fs = require('fs');
var Database = require("../../common/db.js")
const db = new Database();
const helper = require('../../common/helper.js');
const logHelper = require('../../common/log.js');
const config = require('../../config.js');
const constant = require('../../common/constant');
const excel = require('exceljs');

// Machine
module.exports.getMachineIndex = function (req, res) {
    res.render('Innovation/Machine/MachineIndex');
}

module.exports.getMachine = function (req, res) {
    try {
        //parameters
        let keyword = req.body.keyword;
        let type = req.body.type;

        // execute
        db.excuteSP(`CALL USP_Machine_Get ('${keyword}', '${type}')`, function (result) {
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

module.exports.addMachine = function (req, res) {
    try {
        //parameters
        let name = req.body.name;
        let code = req.body.code;
        let type = req.body.type;
        let user = req.user.username;
        let datetime = helper.getDateTimeNow();

        // execute
        let query = `INSERT INTO mec_machine (name, code, type, active, last_update, user_update) 
                    VALUES('${name}', '${code}', '${type}', 1, '${datetime}', '${user}')`;
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

module.exports.updateMachine = function (req, res) {
    try {
        //parameters
        let id = req.body.id;
        let name = req.body.name;
        let code = req.body.code;
        let active = req.body.active;
        let type = req.body.type;
        let user = req.user.username;
        let datetime = helper.getDateTimeNow();

        // execute
        let query = `UPDATE mec_machine
                    SET name = '${name}', code = '${code}', type = '${type}', active = '${active}', last_update = '${datetime}', user_update = '${user}'
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
        logHelper.writeLog("innovation.updateMachine", error);
    }
}

module.exports.getMachineDetail = function (req, res) {
    try {
        //parameters
        let id = req.params.id;

        // execute
        db.excuteSP(`SELECT * FROM mec_machine WHERE id = ${id}`, function (result) {
            if (!result.rs) {
                res.end(JSON.stringify({ rs: false, msg: result.msg.message }));
            }
            else {
                res.end(JSON.stringify({ rs: true, msg: "Thành công", data: result.data }));
            }
        });
    }
    catch (error) {
        logHelper.writeLog("innovation.getMachineDetail", error);
    }
}

module.exports.downloadMachine = function (req, res) {
    try {
        //parameters
        let keyword = req.body.keyword;
        let type = req.body.type;

        // execute
        db.excuteSP(`CALL USP_Machine_Get ('${keyword}', '${type}')`, function (result) {
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
                    { header: 'Type', key: 'type', width: 30 }
                ];

                // Add Array Rows
                worksheet.addRows(jsonMachine);

                // Write to File
                let filename = "\machine.xlsx";
                workbook.xlsx.writeFile(filename).then(function () {
                    res.download(filename);
                });
            }
        });

    } catch (error) {
        logHelper.writeLog("innovation.downloadMachine", error);
    }
}

// Model 
module.exports.getModel = function (req, res) {
    try {
        //parameters
        let keyword = req.body.keyword;
        let machine = req.body.machine;

        // execute
        db.excuteSP(`CALL USP_Model_Get ('${keyword}', '${machine}')`, function (result) {
            if (!result.rs) {
                res.end(JSON.stringify({ rs: false, msg: result.msg.message }));
            }
            else {
                res.end(JSON.stringify({ rs: true, msg: "Thành công", data: result.data }));
            }
        });
    }
    catch (error) {
        logHelper.writeLog("innovation.getModel", error);
    }
}

module.exports.addModel = function (req, res) {
    try {
        //parameters
        let name = req.body.name;
        let code = req.body.code;
        let machine = req.body.machine;
        let des = req.body.des;
        let qty = req.body.qty;

        let user = req.user.username;
        let datetime = helper.getDateTimeNow();

        // execute
        let query = `INSERT INTO mec_model (name, code, quantity, machine_id, description, active, last_update, user_update) 
                    VALUES('${name}', '${code}', ${qty}, ${machine}, '${des}', 1, '${datetime}', '${user}')`;
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
        logHelper.writeLog("innovation.addModel", error);
    }
}

module.exports.updateModel = function (req, res) {
    try {
        //parameters
        let id = req.body.id;
        let name = req.body.name;
        let code = req.body.code;
        let active = req.body.active;
        let machine = req.body.machine;
        let qty = req.body.qty ? req.body.qty : 0;
        let des = req.body.des;
        let user = req.user.username;
        let datetime = helper.getDateTimeNow();

        // execute
        let query = `UPDATE mec_model
                    SET name = '${name}', code = '${code}', machine_id = ${machine}, quantity = ${qty}, description = '${des}', active = ${active}, last_update = '${datetime}', user_update = '${user}'
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
        logHelper.writeLog("innovation.updateModel", error);
    }
}

module.exports.getModelDetail = function (req, res) {
    try {
        //parameters
        let id = req.params.id;

        // execute
        db.excuteSP(`SELECT * FROM mec_model WHERE id = ${id}`, function (result) {
            if (!result.rs) {
                res.end(JSON.stringify({ rs: false, msg: result.msg.message }));
            }
            else {
                res.end(JSON.stringify({ rs: true, msg: "Thành công", data: result.data }));
            }
        });
    }
    catch (error) {
        logHelper.writeLog("innovation.getModelDetail", error);
    }
}

module.exports.downloadModel = function (req, res) {
    try {
        //parameters
        let keyword = req.body.keyword;
        let machine = req.body.machine;

        // execute
        db.excuteSP(`CALL USP_Model_Get ('${keyword}', '${machine}')`, function (result) {
            if (!result.rs) {
                res.end(JSON.stringify({ rs: false, msg: result.msg.message }));
            }
            else {
                let jsonModel = JSON.parse(JSON.stringify(result.data));

                let workbook = new excel.Workbook(); //creating workbook
                let worksheet = workbook.addWorksheet('Model'); //creating worksheet

                //  WorkSheet Header
                worksheet.columns = [
                    { header: 'Id', key: 'id', width: 10 },
                    { header: 'Name', key: 'name', width: 30 },
                    { header: 'Code', key: 'code', width: 30 },
                    { header: 'Quantity', key: 'quantity', width: 30 }
                ];

                // Add Array Rows
                worksheet.addRows(jsonModel);

                // Write to File
                let filename = "\model.xlsx";
                workbook.xlsx.writeFile(filename).then(function () {
                    res.download(filename);
                });
            }
        });

    } catch (error) {
        logHelper.writeLog("innovation.downloadModel", error);
    }
}