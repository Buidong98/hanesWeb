var Database = require("../../database/db_warehouse.js")
const db = new Database();
module.exports.getIndex = function (req, res) {
    let user = req.user;
    res.render('Warehouse/warehouse', { user: user });
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
