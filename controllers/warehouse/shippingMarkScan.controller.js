var Database = require("../../database/db_warehouse.js")

const helper = require('../../common/helper.js');
const logHelper = require('../../common/log.js');
const db = new Database();
module.exports.getIndex = function (req, res) {
    let user = req.user;
    res.render('Warehouse/shippingMarkScan', { user: user });
}
module.exports.CheckId = async function(req, res){
    try{
        let id = req.body.id;
        
        var query = `SELECT * FROM warehouse_user WHERE id = "${id}"`
        var result =  await db.excuteQueryAsync(query);
        if(result.length > 0){
            return res.end(JSON.stringify({
                rs: true,
                msg: "Thay đổi mã id thành công",
                data:result
            }));
        }
        else{
            return res.end(JSON.stringify({
                rs: false,
                msg: "Công nhân không tồn tại trên hệ thống ",
                data:result
            }));
        }
       
    }
    catch (error) {
        logHelper.writeLog("warehouse_upload_file_excel", error);
        return res.end(JSON.stringify({
            rs: false,
            msg: "Error",
            data:""
        }));
        
    }
}
module.exports.UploadPallet = async function(req, res){
    try{
        
        let dataScan = req.body.dataScan;
        let pallet = req.body.palletId;
        let licensePlates = req.body.licensePlates;
        
            let query ="INSERT INTO warehouse_shipping_data_scan (po,hbi_code,quantity_actual,box_carton,`date`,id_employee, license_plates,pallet,po_release) VALUES\n";
            dataScan.forEach(function(item,index){
                if(index+1 != dataScan.length){
                    query += `('${item.po}','${item.code}','${item.quantity}','${item.box}',now(),'${item.id_employee}','${licensePlates}','${pallet}','${item.po_release}'),\n`;
                }
               else{
                    query += `('${item.po}','${item.code}','${item.quantity}','${item.box}',now(),'${item.id_employee}','${licensePlates}','${pallet}','${item.po_release}')`;
               }
            });
            var result =  await db.excuteQueryAsync(query);
            if(result == null) {
                 return res.end(JSON.stringify({
                rs: false,
                msg: "Không thể thêm pallet"
            }));
            }
            return res.end(JSON.stringify({
                rs: true,
                msg: "Thêm pallet thành công"
            }));
       
       
    }
    catch (error) {
        logHelper.writeLog("warehouse_upload_file_excel", error);
        return res.end(JSON.stringify({
            rs: false,
            msg: "Không thể thêm paller error:" + error
        }));
        
    }
}
