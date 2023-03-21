var Database = require("../../database/db_warehouse.js")

const helper = require('../../common/helper.js');
const logHelper = require('../../common/log.js');
const db = new Database();
module.exports.getIndex = function (req, res) {
    let user = req.user;
    res.render('Warehouse/shippingMarkScan', { user: user });
}
module.exports.poUpdate =async function (req, res) { 
    try{
        var data = req.body.dataJson;
        var query =`INSERT INTO warehouse_scan_po (WAREHOUSE,PR_NUM,PO_LINE,SKU,ITEM_STYLE,ITEM_COLOR,ITEM_DESCR,CARTON_ID,ORDER_QTY,PACKED_QTY,CARTON_NAME,CARTON_CBM,UPDATE_TIME)
        VALUES `;
        for (let i = 0; i < data.length; i++){
            query += await `( 
            "${data[i].WAREHOUSE}",
            "${data[i].PR_NUM}",
            "${data[i].PO_LINE}",
            "${data[i].SKU}",
            "${data[i].ITEM_STYLE}",
            "${data[i].ITEM_COLOR}",
            "${data[i].ITEM_DESCR}",
            "${data[i].CARTON_ID}",
            "${data[i].ORDER_QTY}",
            "${data[i].PACKED_QTY}",
            "${data[i].CARTON_NAME}",
            "${data[i].CARTON_CBM}",
            now())`
            if (i<data.length - 1)
                query += ",\n"
        }
        await db.excuteNonQueryAsync("DELETE FROM warehouse_scan_po WHERE WAREHOUSE IS NOT NULL;");
        await db.excuteNonQueryAsync(query);
       
        return res.end(JSON.stringify({
            rs: true,
            msg: "Thành công"
        }));
    }
    catch (error) {
        logHelper.writeLog("warehouse_upload_file_excel", error);
    }
    
}
module.exports.CheckId = async function(req, res){
    try{
        let id = req.body.id;
        
        var query = `SELECT * FROM warehouse_user WHERE id = "${id}"`
        console.log(query)
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
        console.table(dataScan);
        
            let query ="INSERT INTO warehouse_shipping_data_scan (po,hbi_code,quantity_actual,box_carton,`date`,id_employee, license_plates,pallet) VALUES\n";
            dataScan.forEach(function(item,index){
                if(index+1 != dataScan.length){
                    query += `('${item.po}','${item.code}','${item.quantity}','${item.box}',now(),'${item.id_employee}','${licensePlates}','${pallet}'),\n`;
                }
               else{
                query += `('${item.po}','${item.code}','${item.quantity}','${item.box}',now(),'${item.id_employee}','${licensePlates}','${pallet}')`;
               }
            });
            //console.log(query);
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
