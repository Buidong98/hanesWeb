const Database = require("../common/db.js")
var db = new Database();
const logHelper = require("../common/log.js");

var InnovationService = {};

// Spare part request
InnovationService.getRequestDetail = async function (objDTO) {
    try {
        let query = `SELECT * FROM mec_sparepart_request 
                WHERE id = ${objDTO.id}`;
        return await db.excuteQueryAsync(query);
    } catch (error) {
        logHelper.writeLog("excuteQueryAsync", error.message);
    }
}

InnovationService.updateRequest = async function (objDTO) {
    try {
        let query = `UPDATE mec_sparepart_request 
                    SET export_qty = ${objDTO.export_qty}, clerk_status = 1, clerk_date = ''
                    WHERE id = ${objDTO.id}`;
        return await db.excuteNonQueryAsync(query);
    } catch (error) {
        logHelper.writeLog("excuteQueryAsync", error.message);
    }
}

// Part 
InnovationService.getPartDetail = async function (objDTO) {
    try {
        let query =`SELECT * FROM mec_part WHERE code = '${objDTO.code}'`;
        return await db.excuteQueryAsync(query);
    } catch (error) {
        logHelper.writeLog("excuteQueryAsync", error.message);
    }
}

InnovationService.updatePartQuantity = async function (objDTO) {
    try {
        let query = `UPDATE mec_part 
            SET quantity = quantity - ${objDTO.export_qty}
            WHERE code = '${objDTO.code}'`;

        return await db.excuteNonQueryAsync(query);
    } catch (error) {
        logHelper.writeLog("updatePartQuantity", error.message);
    }
}

// Import part from vendor
InnovationService.addImportRequest = async function(objDTO){
    try {
        let query = `INSERT INTO mec_import_request (po, import_date, vendor, receiver, deliverer, request_date, user) 
                    VALUES ('${objDTO.po}', '${objDTO.importDate}', '${objDTO.vendor}', '${objDTO.receiver}', 
                    '${objDTO.deliverer}', '${objDTO.requestDate}', '${objDTO.user}')`;

        return await db.excuteInsertReturnIdAsync(query);
    } catch (error) {
        logHelper.writeLog("addImportRequest", error.message);
    }
}

InnovationService.addImportRequestDetail = async function(objDTO){
    try {
        let query = `INSERT INTO mec_import_request_detail (part_code, part_name, unit, qty_po, qty_real, import_request_id) 
        VALUES ?`;

        return await db.excuteInsertWithParametersAsync(query, objDTO);
    } catch (error) {
        logHelper.writeLog("addImportRequest", error.message);
    }
}

module.exports = InnovationService;