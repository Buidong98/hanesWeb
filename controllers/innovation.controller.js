var formidable = require('formidable');
var fs = require('fs');
var Database = require("../common/db.js")
var db = new Database();
var helper = require('../common/helper.js');
var logHelper = require('../common/log.js');
const config = require('../config.js');

module.exports.getIndex = function (req, res) {
    res.render('Innovation/Index');
}

module.exports.getPartRequest = function (req, res) {
    try {
        //parameters
        let status = req.body.status;
        let date = req.body.date;

        // execute
        db.excuteSP(`CALL USP_Part_Request_Processing_Get (${status}, '${date}')`, function (result) {
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

module.exports.suggestPart = function (req, res) {
    try {
        //parameters
        let keyword = req.body.keyword;
        let pageSize = req.body.pageSize;

        // execute
        let query = `SELECT id, part_code, name, image, location FROM mec_part WHERE name LIKE '%${keyword}%' LIMIT ${pageSize}`;
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

module.exports.upload = function (req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, file) {
        if (err)
            return res.redirect(303, 'Error');

        console.log(file);
        fs.rename(file.file.path, config.imageFilePath + file.file.name, function(err) {
            if (err)
                throw err;
            console.log('renamed complete');  
        });

        res.end();
    });
}

// add part
module.exports.addPart = function (req, res) {
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

        // execute
        let query = `INSERT INTO mec_part (name, part_code, quantity, min_quantity, location, description, image, last_update, user_update) 
                    VALUES('${name}', '${code}', ${qty}, ${min_qty}, '${location}', '${des}', '${img}', '${datetime}', '${user}')`;
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

// update part
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
                    SET name = '${name}', part_code = '${code}', quantity = '${qty}', location = '${location}', 
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

// module.exports.upload = function(req, res) {
//     var base64Data = req.body.img.replace(/^data:image\/png;base64,/, "");

//     fs.writeFile("/Image/Parts/out.png", base64Data, 'base64', function(err) {
//         console.log(err);
//     });
// }

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