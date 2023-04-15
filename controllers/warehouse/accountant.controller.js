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
       
        let status = [];
        await db.excuteQueryAsync(`delete from warehouse_shipping_plan_error WHERE error_date = DATE(NOW()) or po is not null;`);
        await data.forEach(async function (item, index) {
            var query = `call usp_wasehouse_shipping_plan(
                    "${(typeof item["po"]!=='undefined' ? item["po"] :"")}",
                    "${(typeof item["hbi_code"]!=='undefined' ? item["hbi_code"] :"")}",
                    "${(typeof item["date"]!=='undefined' ? ExcelDateToJSDate(item["date"]) :"now()")}",
                    "${(typeof item["po_release"]!=='undefined' ? item["po_release"] :"")}",
                    "${(typeof item["quantity_plan"]!=='undefined' ? item["quantity_plan"] :"0")}",
                    "${(typeof item["unit"]!=='undefined' ? item["unit"] :"")}",
                    "${ (typeof item["package_quantity"]!=='undefined' ? item["package_quantity"] :"0")}",
                    "${(typeof item["vendor"]!=='undefined' ? item["vendor"] :"")}",
                    "${(typeof item["location"]!=='undefined' ? item["location"] :"")}",
                    "${(typeof item["po_line_nbr"]!=='undefined' ? item["po_line_nbr"] :"")}",
                    "${(typeof item["status"]!=='undefined'&& item["status"] != ""? item["status"] :"i")}"
                    )`;
           var result  = await db.excuteQueryAsync(query);
            status.push(result[0][0]);
            if(index == data.length-1){
                return res.end(JSON.stringify({
                    rs: true,
                    msg: "Upload plan thành công",
                    status:status
                }));
            }
        });
       
    }
    catch (error) {
        //logHelper.writeLog("warehouse_upload_file_excel", error);
        return res.end(JSON.stringify({
            rs: false,
            msg: "Không thể upload file po, xin vui lòng kiểm tra lại"
        }));
    }
    
}
function ExcelDateToJSDate(date) {
    dt = new Date(Math.round((date - 25569)*86400*1000));
    if(isNaN(dt.getFullYear())){
        dt = new Date(date)
        return `${dt.getFullYear()}-${dt.getMonth()+1}-${dt.getDate()}`
    }
    return `${dt.getFullYear()}-${dt.getMonth()+1}-${dt.getDate()}`
  }
module.exports.findDateChanged = async function (req, res, next) { 
    try{
        var date = req.body.date;
        var table = req.body.select_table;
        if(table == 'plan'|| table == 'total'||table=='addin' || table=='planError'){
            var query = `SELECT po,vendor FROM vw_warehouse_shipping_data WHERE plan_date = '${date}' GROUP BY po`;
            console.log(query)
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
module.exports.findvendorChanged =async function (req, res, next) {
    try{
        var vendor = req.body.vendor;
        var table = req.body.select_table;
        var date = req.body.date;
        var query ="";
        if(table == 'total'|| table == 'plan' || table == 'planError' || table == 'addin'){
            query = vendor=="All" ?
        `SELECT po,vendor FROM vw_warehouse_shipping_data  WHERE plan_date = '${date}' GROUP BY po`
        :`SELECT po,vendor FROM vw_warehouse_shipping_data WHERE plan_date = '${date}' and vendor = '${vendor}' GROUP BY po`
        }
        else if(table=='scan'){
            query = vendor=="All" ?
        `SELECT po FROM warehouse_shipping_data_scan  WHERE date(date) = '${date}' GROUP BY po`
        :`SELECT po FROM warehouse_shipping_data_scan WHERE date(date) = '${date}' and pallet
         = '${vendor}' GROUP BY po`
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
        var vendor = req.body.vendor;
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
                query = `SELECT po, hbi_code, DATE, po_release, quantity_plan, unit, package_quantity, location, vendor, po_line_nbr FROM warehouse_shipping_plan where date = '${date}'`;
                break;
            case "planError":
                query = `SELECT po, hbi_code, DATE, po_release, quantity_plan, unit, package_quantity, location, vendor, po_line_nbr FROM warehouse_shipping_plan_error where date = '${date}'`;
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
        //     query = `SELECT po, hbi_code, DATE, po_release, quantity_plan, unit, package_quantity, location, vendor FROM warehouse_shipping_plan where date = '${date}'`;
        // } 
        // else if(selectTable=="addin"){
        //     query = `SELECT * FROM warehouse_shipping_data_scan WHERE DATE(date) = '${date}'`;
        // }
        if(po != "All"){
            query += ` and po = '${po}'`;
        }
        if(vendor != "All" && selectTable != "scan"){
            query += `and vendor = '${vendor}'`;
        }
        if(vendor != "All" && selectTable == "scan"){
            query += `and pallet = '${vendor}'`;
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
//  function formatDate(date){
//     if(typeof date == 'string'){
//         date1 = new Date(date);
//         return `${date1.getFullYear()}-${date1.getMonth()+1}-${date1.getDate()}`
//     }

//  }
function formatDate(date) {
    if (typeof date == 'string') {
        date1 = new Date(date);
        var month = date1.getMonth() + 1 < 10 ? `0${date1.getMonth()+1}` : date1.getMonth() + 1;
        var day = date1.getDate() < 10 ? `0${date1.getDate()}` : date1.getDate();
        return `${date1.getFullYear()}-${month}-${day}`
    }
}