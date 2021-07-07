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
