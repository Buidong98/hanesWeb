var Database = require("../common/db.js")
var db = new Database();

var SparePartRequestService = {};

SparePartRequestService.getRequestDetail = function(objDTO, callback){
    let query = `SELECT * FROM mec_sparepart_request 
                WHERE id = ${objDTO.id}`;
                
    db.excuteQuery(query, function (result) {
        if (!result.rs) {
            callback(undefined);
        }
        else {
            callback(result.data[0]);
        }
    });
}

SparePartRequestService.updateRequest = function(objDTO, callback){
    let query = `UPDATE mec_sparepart_request 
            SET export_qty = ${objDTO.export_qty}, clerk_status = 2, clerk_date = ''
            WHERE id = ${objDTO.id}`;

    db.excuteQuery(query, function (result) {
        if (!result.rs) {
            callback(0)
        }
        else {
            callback(1)
        }
    });
}

module.exports = SparePartRequestService;