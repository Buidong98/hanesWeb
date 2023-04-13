const { query } = require("express");
var Database = require("../../database/db_warehouse.js")
const db = new Database();
module.exports.getIndex = function (req, res) {
    let user = req.user;
    res.render('Warehouse/accountant', { user: user });
}

module.exports.planUpload =async function (req, res) { 
    try{
        var data = req.body.dataJson;
        var query =`INSERT INTO warehouse_shipping_plan (po,hbi_code,DATE,po_release,quantity_plan,unit,package_quantity,vender,location,po_line_nbr) values`;
        for (let i = 0; i < data.length; i++){
            query += await `( 
            "${(typeof data[i]["po"]!=='undefined' ? data[i]["po"] :"")}",
            "${(typeof data[i]["hbi_code"]!=='undefined' ? data[i]["hbi_code"] :"")}",
            "${(typeof data[i]["date"]!=='undefined' ? ExcelDateToJSDate(data[i]["date"]) :"now()")}",
            "${(typeof data[i]["po_release"]!=='undefined' ? data[i]["po_release"] :"")}",
            "${(typeof data[i]["quantity_plan"]!=='undefined' ? data[i]["quantity_plan"] :"0")}",
            "${(typeof data[i]["unit"]!=='undefined' ? data[i]["unit"] :"")}",
            "${ (typeof data[i]["package_quantity"]!=='undefined' ? data[i]["package_quantity"] :"0")}",
            "${(typeof data[i]["vender"]!=='undefined' ? data[i]["vender"] :"")}",
            "${(typeof data[i]["location"]!=='undefined' ? data[i]["location"] :"")}",
            "${(typeof data[i]["po_line_nbr"]!=='undefined' ? data[i]["po_line_nbr"] :"")}"
            )`
            if (i<data.length - 1)
                query += ",\n"
        }
       
      
        // await db.excuteNonQueryAsync("DELETE FROM warehouse_scan_po WHERE WAREHOUSE IS NOT NULL;");
        var result  = await db.excuteNonQueryAsync(query);
        if(result == null) {
            return res.end(JSON.stringify({
                rs: false,
                msg: "Không thể upload file po, xin vui lòng kiểm tra lại"
       }));
       }
        return res.end(JSON.stringify({
            rs: true,
            msg: "Upload plan thành công"
        }));
    }
    catch (error) {
        logHelper.writeLog("warehouse_upload_file_excel", error);
        return res.end(JSON.stringify({
            rs: false,
            msg: "Không thể upload file po, xin vui lòng kiểm tra lại"
        }));
    }
    
}
function ExcelDateToJSDate(date) {
    
    dt = new Date(Math.round((date - 25569)*86400*1000));
    return `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`
  }
module.exports.findDateChanged = async function (req, res, next) { 
    try{
        var date = req.body.date;
        var table = req.body.select_table;
        if(table == 'plan'|| table == 'total'||table=='addin'){
            var query = `SELECT po,vender FROM vw_warehouse_shipping_data WHERE plan_date = '${date}' GROUP BY po`;
        }   
        else if(table == 'scan'){
            var query = `SELECT po,pallet FROM warehouse_shipping_data_scan WHERE date(DATE)='${date}'`;
        }
       
        var data = await db.excuteQueryAsync(query);
        return res.end(JSON.stringify({
            rs: true,
            msg: "",
            data:data
        }));
    }
    catch{return res.end(JSON.stringify({
        rs: false,
        msg: ""
    }));}
}
module.exports.findVenderChanged =async function (req, res, next) { 
   
    try{
        var vender = req.body.vender;
        var table = req.body.select_table;
        var date = req.body.date;
        var query ="";
        if(table == 'total'|| table == 'plan' || table == 'addin'){
            query = vender=="All" ?
        `SELECT po,vender FROM vw_warehouse_shipping_data  WHERE plan_date = '${date}' GROUP BY po`
        :`SELECT po,vender FROM vw_warehouse_shipping_data WHERE plan_date = '${date}' and vender = '${vender}' GROUP BY po`
        }
        else if(table=='scan'){
            query = vender=="All" ?
        `SELECT po FROM warehouse_shipping_data_scan  WHERE date(date) = '${date}' GROUP BY po`
        :`SELECT po FROM warehouse_shipping_data_scan WHERE date(date) = '${date}' and pallet
         = '${vender}' GROUP BY po`
        }
        var data = await db.excuteQueryAsync(query);
        return res.end(JSON.stringify({
            rs: true,
            msg: "",
            data:data
        }));
    }
    catch{return res.end(JSON.stringify({
        rs: false,
        msg: ""
    }));}
}
module.exports.LoadDataTable =  async function (req, res, next) {
    try{
        var  date = req.body.date;
        var vender = req.body.vender;
        var po = req.body.po;
        var selectTable = req.body.selectTable;
        var query ="";
        switch (selectTable) {
            case "scan":
                query =`SELECT * FROM warehouse_shipping_data_scan WHERE DATE(date) = '${date}'`;
                break;
            case "total":
                query = `SELECT * FROM vw_warehouse_shipping_data WHERE plan_date = '${date}'`;
                break;
            case "plan":
                query = `SELECT po, hbi_code, DATE, po_release, quantity_plan, unit, package_quantity, location, vender FROM warehouse_shipping_plan where date = '${date}'`;
                break;
            case "addin":
                query = `SELECT *FROM vw_warehouse_shipping_addin  WHERE DATE(date) = '${date}'`;
                break;
        }
        // if(selectTable == "scan"){
        //     query = `SELECT * FROM warehouse_shipping_data_scan WHERE DATE(date) = '${date}'`;
        // }
        // else if(selectTable =="total"){
        //     query = `SELECT * FROM vw_warehouse_shipping_data WHERE plan_date = '${date}'`;
        // }
        // else if(selectTable =="plan"){
        //     query = `SELECT po, hbi_code, DATE, po_release, quantity_plan, unit, package_quantity, location, vender FROM warehouse_shipping_plan where date = '${date}'`;
        // } 
        // else if(selectTable=="addin"){
        //     query = `SELECT * FROM warehouse_shipping_data_scan WHERE DATE(date) = '${date}'`;
        // }
        if(po != "All"){
            query += ` and po = '${po}'`;
        }
        if(vender != "All" && selectTable != "scan"){
            query += `and vender = '${vender}'`;
        }
        if(vender != "All" && selectTable == "scan"){
            query += `and pallet = '${vender}'`;
        }
        
        var data = await db.excuteQueryAsync(query);
        return res.end(JSON.stringify({
            rs: true,
            msg: "",
            data:data,
            query: query
        }));
    }
    catch{
        return res.end(JSON.stringify({
            rs: false,
            msg: ""
        }));
    }
 }
 module.exports.updateQuantity = async function (req, res, next) {
    try{
        var confirmData = req.body.data;
        var query = `UPDATE  warehouse_shipping_plan  
        SET quantity_confirm = ${confirmData["quantity_confirm"]},
            confirm_date = now()
        WHERE po = '${confirmData["po"]}' AND
                hbi_code = '${confirmData["hbi_code"]}' and
                date = '${formatDate(confirmData["plan_date"])}'`;

        var queryInsertHistory =`INSERT INTO warehouse_shipping_data_confirm 
        (po,hbi_code,plan_date,quantity_confirm, confirm_date) 
        VALUE('${confirmData["po"]}','${confirmData["hbi_code"]}','${formatDate(confirmData["plan_date"])}',${confirmData["quantity_confirm"]},NOW())`
        var sql1 = await db.excuteQueryAsync(query);
       
        if(sql1 != null){
            var sql1 = await db.excuteQueryAsync(queryInsertHistory);
            return res.end(JSON.stringify({
                rs: true,
                msg: "Cập nhật quantity thành công",
                data:confirmData,
                query:query 
            }));
        }
        else{
            return res.end(JSON.stringify({
                rs: false,
                msg: "Không thể cập nhận quantity, xin vui lòng kiểm tra lại",
                query:query 
            }));
        }
    }
    catch{
        return res.end(JSON.stringify({
            rs: false,
            msg: "Không thể cập nhận quantity, xin vui lòng kiểm tra lại",
            query:query 
        }));
    }
 }
 function formatDate(date){
    if(typeof date == 'string'){
        date1 = new Date(date);
        return `${date1.getFullYear()}-${date1.getMonth()+1}-${date1.getDate()}`
    }

 }