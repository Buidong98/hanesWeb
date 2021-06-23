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
InnovationService.updatePartQuantity = async function (objDTO) {
    try {
        let query = `UPDATE mec_part 
            SET quantity = quantity - ${objDTO.export_qty}
            WHERE code = '${objDTO.code}'`;

        return await db.excuteNonQueryAsync(query);
    } catch (error) {
        logHelper.writeLog("excuteQueryAsync", error.message);
    }
}

module.exports = InnovationService;