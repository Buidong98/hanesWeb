// const { text } = require("body-parser");

const baseUrl = "/warehouse/shippingMark/";

$(document).ready(function () {
    var now = new Date();
    var month = (now.getMonth() + 1);
    var day = now.getDate();
    if (month < 10)
        month = "0" + month;
    if (day < 10)
        day = "0" + day;
    var today = now.getFullYear() + '-' + month + '-' + day;
    document.getElementById("findDate").defaultValue = today;
    findDateChanged(today);
    loadDataTable();
    toastr.options = {
        "positionClass": "toast-bottom-right"
      };
    // document.getElementById('findDate').valueAsDate = new Date();
});
async function uploadExcel() {
    if (window.FormData !== undefined) {
        const file = document.getElementById('inputfilePlan').files[0];
        var dataJson = {};
        await file.arrayBuffer().then((res) => {
            let data = new Uint8Array(res);
            let workbook = XLSX.read(data, {
                type: "array"
            });
            let first_sheet_name = workbook.SheetNames[0];
            let worksheet = workbook.Sheets[first_sheet_name];
            dataJson = XLSX.utils.sheet_to_json(worksheet);
        })
        // LoadingShow();
        if (typeof dataJson[0]["po"] != "undefined" && typeof dataJson[0]["hbi_code"] != "undefined" && typeof dataJson[0]["quantity_plan"] != "undefined") {
            $.ajax({
                url: baseUrl + 'planUpload',
                method: 'POST',
                data: {
                    'dataJson': dataJson
                },
                dataType: 'json',
                success: function (result) {
                    console.log(result);
                    let error=0;
                    let insert = 0;
                    let update = 0;
                    let replace = 0;
                    result.status.forEach (function (item, index) {
                        switch(item['plan_status']) {
                            case '0',0:
                                error += 1;
                                break;
                            case '1',1:
                                insert += 1;
                                break;
                            case '2',2:
                                update += 1;
                                break;
                            case '3',3:
                                replace += 1;
                                break;
                        }
                    })
                    // LoadingHide();
                    if(result.rs){
                        document.getElementById('inputfilePlan').files[0] = "";
                        document.getElementById('inputfilePlan').value = "";

                        if(error >0)
                        toastr.error(`Không thể insert ${error} bản ghi`);
                        if(insert >0)
                        toastr.success(`Insert ${insert} bản ghi mới thành công`);
                        if(update >0)
                        toastr.success(`Update ${update} bản ghi thành công`);
                        if(replace >0)
                        toastr.success(`Replace ${replace} bản ghi thành công`);
                    }
                    else
                    toastr.error(result.msg);
                    // document.getElementById('FilePo').value = "";
                }
            })
        } else {
            //LoadingHide();
            toastr.error("File po sai định dạng");
            //document.getElementById('FilePo').value = "";
        }
    }
}
function ExcelDateToJSDate(date) {
    return new Date(Math.round((date - 25569) * 86400 * 1000));
}
function findDateChanged(obj) {
    var selectTable =  document.getElementById("selectTable").value;
    $.ajax({
        url: baseUrl + 'findDateChanged',
        method: 'POST',
        data: {
            'date': obj,'select_table':selectTable
        },
        dataType: 'json',
        success: function (result) {
            var optionPO = "<option selected>All</option>";
            var optionvendor = "<option selected>All</option>";
            if (result.data.length > 0) {
                let mvendor =[];
                if(selectTable == 'plan'|| selectTable == 'total'||selectTable == 'addin' || selectTable=='planError'){
                    result.data.forEach(function (item, index) {
                        if (item['po'] != null) {
                            optionPO += `<option class="chart_header_option" value=${item['po']}>${item['po']}</option>\n`;
                            
                            if(!mvendor.includes(item['vendor'])){
                                optionvendor += `<option class="chart_header_option" value="${item['vendor']}">${item['vendor']}</option>\n`;
                                mvendor.push(item['vendor']);
                            }
                        }
                    });
                }
                else if(selectTable =='scan'){
                    var po = [];
                    var pallet = [];
                    result.data.forEach(function (item, index) {
                        if(!po.includes(item['po'])){
                            optionPO += `<option class="chart_header_option" value=${item['po']}>${item['po']}</option>\n`;
                            po.push(item['po']);
                        }
                            if(!pallet.includes(item['pallet'])){
                            optionvendor += `<option class="chart_header_option" value="${item['pallet']}">${item['pallet']}</option>\n`;
                            pallet.push(item['pallet']);
                        }
                        
                    });
                }
            
            }
            document.getElementById('findPo').innerHTML = optionPO;
            document.getElementById('findvendor').innerHTML = optionvendor;
        }
    })
}

function findvendorChanged(obj) {
    var selectTable =  document.getElementById("selectTable").value;
    var date =  document.getElementById("findDate").value;
    toastr.success(obj)
    $.ajax({
        url: baseUrl + 'findvendorChanged',
        method: 'POST',
        data: {
            'vendor': obj,'select_table':selectTable,'date':date
        },
        dataType: 'json',
        success: function (result) {
            var optionPO = "<option selected>All</option>";
            if (result.data.length > 0) {
                result.data.forEach(function (item, index) {
                    if (item['po'] != null) {
                        optionPO += `<option class="chart_header_option" value=${item['po']}>${item['po']}</option>\n`;
                    }
                });
            }
            document.getElementById('findPo').innerHTML = optionPO;
        }
    })
}
function changeSelectTable(obj){
    var date =  document.getElementById("findDate").value;
    if(obj =="total"){
        findDateChanged(date)
        document.getElementById("form_checkAbnormal").innerHTML = `<label class="form-check-label" for="checkAbnormal">
        Lọc bản ghi bất thường
        </label>
        <input class="form-check-input" type="checkbox" checked ="true" value="1" id="checkAbnormal">`;
        document.getElementById("titlevendor").innerHTML = "vendor:";
    }
    if(obj =="scan"){
        findDateChanged(date)
        document.getElementById('findvendor').innerHTML ="";
        document.getElementById("form_checkAbnormal").innerHTML ="";
        document.getElementById("titlevendor").innerHTML = "pallet:";

    }
    if(obj =="plan" || obj =="planError"){
        findDateChanged(date)
        document.getElementById("form_checkAbnormal").innerHTML ="";
        document.getElementById("titlevendor").innerHTML = "vendor:";

    }
    if(obj =="addin"){
        findDateChanged(date);
        document.getElementById("titlevendor").innerHTML = "vendor:";

    }
}
let dataExcel = []; 
let dataFileName = "";
let dataSheetName = "";
function loadDataTable() {
   
    var date = document.getElementById("findDate").value;
    var vendor = document.getElementById("findvendor").value;
    var po = document.getElementById("findPo").value;
    var selectTable = document.getElementById("selectTable").value;
    $.ajax({
        url: baseUrl + 'LoadDataTable',
        method: 'POST',
        data: {
            'date': date,
            'vendor': vendor,
            'po': po,
            'selectTable':selectTable
        },
        dataType: 'json',
        success: function (result) {
            var tableHeader="";
            var tableBody = "";
            switch(selectTable){
                case 'total':
                    { var checkBox = document.getElementById('checkAbnormal').checked;
                    tableHeader = `<th scope="col" class="listItem-header-actual">#</th>
                    <th scope="col" class="listItem-header-actual">PO</th>
                    <th scope="col"class="listItem-header-actual">Code</th>
                    <th scope="col" class="listItem-header-actual">Quantity plan</th>
                    <th scope="col" class="listItem-header-actual">Quantity actual</th>
                    <th scope="col" class="listItem-header-actual">Quantity confirm</th>
                    <th scope="col" class="listItem-header-actual">vendor</th>
                    <th scope="col" class="listItem-header-actual">date</th>
                    `;
                    var i =0;
                    dataExcel = [];
                    dataFileName = "Total table";
                    dataSheetName="Total data";
                    result.data.forEach(function (item, index) {
                        if (item["quantity_plan"] != item["quantity_actual"]||!checkBox) {
                            dataExcel.push({"PO":item["po"],
                                "Code":item["hbi_code"],
                                "Quantity plan":item["quantity_plan"],
                                "Lisence plates":item["license_plates"],
                                "Quantity plan":item["quantity_actual"],
                                "Quantity actual":item["quantity_actual"],
                                "Quantity confirm":item["quantity_confirm"],
                                "vendor":item["vendor"],
                                "date":item["plan_date"]
                            });
                            i++;
                            tableBody += `<tr>
                            <td class="listItem-body-actual">${i}</th>
                            <td class="listItem-body-actual">${item["po"]}</td>
                            <td class="listItem-body-actual">${item["hbi_code"]}</td>
                            <td class="listItem-body-actual">${formatNumber(item["quantity_plan"])}</td>
                            <td class="listItem-body-actual">${formatNumber(item["quantity_actual"])}</td>
                            <td class="listItem-body-plan">
                                <!-- Button trigger modal -->
                                <div class="row">
                                <h class="quantityConfirmItem col-10" id="quantityConfirmItem${index}">${formatNumber(item["quantity_confirm"])}</h>
                                <a class="quntittModelOn col-2"  data-bs-toggle="modal" data-bs-placement="bottom" data-bs-target="#quantityComfirm" 
                                data-bookid='{"po":"${item["po"]}", "hbi_code":"${item["hbi_code"]}", "plan_date":"${item["plan_date"]}","quantityPlan":"${item["quantity_plan"]}","quantityActual":"${item["quantity_actual"]}","index":"${index}","quantity_confirm":"${item["quantity_confirm"]}"}'>
                                    <i class="fa-regular fa-pen-to-square"></i>
                                </a>
                                </div>
                            </td>
                            <td class="listItem-body-actual">${item["vendor"]}</td>
                            <td class="listItem-body-actual">${formatDate(item["plan_date"])}</td>
                            </tr>`;
                        }
                    });}
                    break;
                case 'scan':
                    {tableHeader = `<th scope="col" class="listItem-header-actual">#</th>
                    <th scope="col" class="listItem-header-actual">PO</th>
                    <th scope="col"class="listItem-header-actual">Code</th>
                    <th scope="col"class="listItem-header-actual">Pallet</th>
                    <th scope="col"class="listItem-header-actual">Lisence plates</th>
                    <th scope="col" class="listItem-header-actual">Quantity actual</th>
                    <th scope="col" class="listItem-header-actual">date</th>
                    <th scope="col" class="listItem-header-actual">Id employee</th>
                    `;
                    dataExcel = [];
                    dataFileName = "Scan table";
                    dataSheetName="Scan data";
                    result.data.forEach(function (item, index) {
                        dataExcel.push({"PO":item["po"],
                        "Code":item["hbi_code"],
                        "Pallet":item["pallet"],
                        "Lisence plates":item["license_plates"],
                        "Quantity actual":item["quantity_actual"],
                        "date":item["date"],
                        "Id employee":item["id_employee"]
                    });
                        tableBody += `<tr>
                        <td class="listItem-body-actual">${index +1}</th>
                        <td class="listItem-body-actual">${item["po"]}</td>
                        <td class="listItem-body-actual">${item["hbi_code"]}</td>
                        <td class="listItem-body-actual">${item["pallet"]}</td>
                        <td class="listItem-body-actual">${item["license_plates"]}</td>
                        <td class="listItem-body-actual">${formatNumber(item["quantity_actual"])}</td>
                        <td class="listItem-body-actual">${item["date"]}</td>
                        <td class="listItem-body-actual">${item["id_employee"]}</td>
                        </tr>`;
                    });}
                    break;
                case 'plan':
                    {
                        tableHeader = `<th scope="col" class="listItem-header-actual">#</th>
                        <th scope="col" class="listItem-header-actual">PO</th>
                        <th scope="col"class="listItem-header-actual">Code</th>
                        <th scope="col" class="listItem-header-actual">Location</th>
                        <th scope="col" class="listItem-header-actual">Po release</th>
                        <th scope="col" class="listItem-header-actual">Quantity plan</th>
                        <th scope="col" class="listItem-header-actual">Unit</th>
                        <th scope="col" class="listItem-header-actual">Package quantity</th>
                        <th scope="col" class="listItem-header-actual">Vendor</th>
                        <th scope="col" class="listItem-header-actual">Date</th>
                        `;
                        dataExcel = [];
                        dataFileName = "Plan table";
                        dataSheetName="Plan data";
                        result.data.forEach(function (item, index) {
                            dataExcel.push({"PO":item["po"],
                            "Code":item["hbi_code"],
                            "Location":item["location"],
                            "Po release":item["po_release"],
                            "Quantity plan":item["quantity_plan"],
                            "Unit":item["unit"],
                            "Package quantity":item["package_quantity"],
                            "vendor":item["vendor"],
                            "Date":item["DATE"]
                        });
                            tableBody += `<tr>
                            <td class="listItem-body-actual">${index+1}</th>
                            <td class="listItem-body-actual">${item["po"]}</td>
                            <td class="listItem-body-actual">${item["hbi_code"]}</td>
                            <td class="listItem-body-actual">${item["location"]}</td>
                            <td class="listItem-body-actual">${item["po_release"]}</td>
                            <td class="listItem-body-actual">${formatNumber(item["quantity_plan"])}</td>
                            <td class="listItem-body-actual">${item["unit"]}</td>
                            <td class="listItem-body-actual">${item["package_quantity"]}</td>
                            <td class="listItem-body-actual">${item["vendor"]}</td>
                            <td class="listItem-body-actual">${item["DATE"]}</td>
                            </tr>`;
                        });}
                        break;
                    case 'planError':
                        tableHeader = `<th scope="col" class="listItem-header-actual">#</th>
                        <th scope="col" class="listItem-header-actual">Po release</th>
                        <th scope="col" class="listItem-header-actual">PO</th>
                        <th scope="col"class="listItem-header-actual">Code</th>
                        <th scope="col" class="listItem-header-actual">Location</th>
                        <th scope="col" class="listItem-header-actual">Quantity plan</th>
                        <th scope="col" class="listItem-header-actual">Unit</th>
                        <th scope="col" class="listItem-header-actual">Package quantity</th>
                        <th scope="col" class="listItem-header-actual">Vendor</th>
                        <th scope="col" class="listItem-header-actual">Date</th>
                        `;
                        dataExcel = [];
                        dataFileName = "Plan error table";
                        dataSheetName="Plan error data";
                        result.data.forEach(function (item, index) {
                            dataExcel.push({
                            "po_release":item["po_release"],"po":item["po"],
                            "hbi_code":item["hbi_code"],
                            "location":item["location"],
                            "quantity_plan":item["quantity_plan"],
                            "unit":item["unit"],
                            "package_quantity":item["package_quantity"],
                            "vendor":item["vendor"],
                            "date":formatDate2(item["DATE"]),
                            "po_line_nbr":item["po_line_nbr"],
                            "status":""
                        });
                            tableBody += `<tr>
                            <td class="listItem-body-actual">${index+1}</th>
                            <td class="listItem-body-actual">${item["po_release"]}</td>
                            <td class="listItem-body-actual">${item["po"]}</td>
                            <td class="listItem-body-actual">${item["hbi_code"]}</td>
                            <td class="listItem-body-actual">${item["location"]}</td>
                            <td class="listItem-body-actual">${formatNumber(item["quantity_plan"])}</td>
                            <td class="listItem-body-actual">${item["unit"]}</td>
                            <td class="listItem-body-actual">${formatNumber(item["package_quantity"])}</td>
                            <td class="listItem-body-actual">${item["vendor"]}</td>
                            <td class="listItem-body-actual">${formatDate2(item["DATE"])}</td>
                            </tr>`;
                        });
                        break;
                    case 'addin':
                        {tableHeader = `<th scope="col" class="listItem-header-actual">#</th>
                        <th scope="col" class="listItem-header-actual">PO-NUMBER</th>
                        <th scope="col"class="listItem-header-actual">PO-RELEASE</th>
                        <th scope="col" class="listItem-header-actual">PO-CODE</th>
                        <th scope="col" class="listItem-header-actual">LINE-FC1</th>
                        <th scope="col" class="listItem-header-actual">PO-LINE-NBR1</th>
                        <th scope="col" class="listItem-header-actual">ITEM-DETAIL1</th>
                        <th scope="col" class="listItem-header-actual">REC-QTY1</th>
                        <th scope="col" class="listItem-header-actual">REC-UOM1</th>
                        <th scope="col" class="listItem-header-actual">BIN</th>
                        <th scope="col" class="listItem-header-actual">Vendor</th>
                        `;
                        let LINE_FC1 = "A";
                        let po_Code = "DIRM";
                        let conpany = "3844";
                        dataExcel = [];
                        dataFileName = "ADD-IN";
                        dataSheetName="ADDIN";
                        result.data.forEach(function (item, index) {	
                            dataExcel.push({"COMPANY":conpany,
                                            "PO-NUMBER":item["po"],
                                            "PO-RELEASE":item["po_release"],
                                            "PO-CODE":po_Code,
                                            "LINE-FC1":LINE_FC1,
                                            "PO-LINE-NBR1":item["po_line_nbr"],
                                            "ITEM-DETAIL1":item["hbi_code"],
                                            "REC-QTY1":item["quantity"],
                                            "REC-UOM1":item["unit"],
                                            "LOCATION1":"",
                                            "NAME1":"",
                                            "BIN":item["location"],
                                            "Column1":"",
                                            "Results from PO30.1":"",
                                            "vendor":item["vendor"],
                                        });
                            tableBody += `<tr>
                            <td class="listItem-body-actual">${index+1}</th>
                            <td class="listItem-body-actual">${item["po"]}</td>
                            <td class="listItem-body-actual">${item["po_release"]}</td>
                            <td class="listItem-body-actual">${po_Code}</td>
                            <td class="listItem-body-actual">${LINE_FC1}</td>
                            <td class="listItem-body-actual">${item["po_line_nbr"]}</td>
                            <td class="listItem-body-actual">${item["hbi_code"]}</td>
                            <td class="listItem-body-actual">${formatNumber(item["quantity"])}</td>
                            <td class="listItem-body-actual">${item["unit"]}</td>
                            <td class="listItem-body-actual">${item["location"]}</td>
                            <td class="listItem-body-actual">${item["vendor"]}</td>
                            </tr>`;
                        });}
                    break;
            }
            document.getElementById('tableHeader').innerHTML = tableHeader;
            document.getElementById('tableBody').innerHTML = tableBody;
        }
    })
}
var confirmData;
var myModal = document.getElementById('quantityComfirm');
myModal.addEventListener('show.bs.modal', function () {
    var bookdata = $(event.relatedTarget).data('bookid');
    document.getElementById('modalQuantityPlan').innerHTML = bookdata["quantityPlan"]
    document.getElementById('modalQuantityActual').innerHTML = bookdata["quantityActual"]
    var quantityConfirm = document.getElementById(`quantityConfirmItem${bookdata["index"]}`).innerHTML; 
    if(quantityConfirm != "null") {
        document.getElementById('modalQuantityConfirm').value = document.getElementById(`quantityConfirmItem${bookdata["index"]}`).innerHTML;
    }
    else{
        document.getElementById('modalQuantityConfirm').value="";
    }
    
    document.getElementById("modalQuantityConfirm").focus();
    confirmData = {
        "po": bookdata["po"],
        "hbi_code": bookdata["hbi_code"],
        "plan_date": bookdata["plan_date"],
        "quantity_confirm":bookdata["quantity_confirm"]
    }
 
})
$("#quantityComfirm" ).on('shown.bs.modal', function(){
    document.getElementById("modalQuantityConfirm").focus();
})

function saveQuantity(){
    var quantityComfirm = (document.getElementById('modalQuantityConfirm').value).replaceAll(',','');
    toastr.remove();
    toastr.success(quantityComfirm);
    if(parseInt(quantityComfirm)>=0){
        if( confirmData["quantity_confirm"] != quantityComfirm){
           
            confirmData["quantity_confirm"] = quantityComfirm;
            const d = new Date(confirmData["plan_date"]);
            $.ajax({
                url: baseUrl + 'updateQuantity',
                method: 'POST',
                data: {
                    'data': confirmData
                },
                dataType: 'json',
                success: function (result) {
                    if (result.rs) {
                        toastr.success(result.msg);
                         $('#quantityComfirm').modal('hide');
                        loadDataTable();
                    }
                    else{
                        toastr.error(result.msg);
                    }   
                }
            })
        }
    }
    else{toastr.error("Bạn cần nhập vào qunatity confirm là số tự nhiên");}
}

function formatDate(date) {
    if (typeof date == 'string') {
        date1 = new Date(date);
        var month = date1.getMonth() + 1 < 10 ? `0${date1.getMonth()+1}` : date1.getMonth() + 1;
        var day = date1.getDate() < 10 ? `0${date1.getDate()}` : date1.getDate();
        return `${date1.getFullYear()}-${month}-${day}`
    }
}
function formatDate2(date) {
    if (typeof date == 'string') {
        date1 = new Date(date);
        var month = date1.getMonth() + 1 < 10 ? `0${date1.getMonth()+1}` : date1.getMonth() + 1;
        var day = date1.getDate() < 10 ? `0${date1.getDate()}` : date1.getDate();
        return `${month}/${day}/${date1.getFullYear()}`
    }
}
async function  DownloadReport(){
    loadDataTable();
    exportToExcel(dataFileName,dataSheetName,dataExcel);
}
function exportToExcel(fileName, sheetName, data) {
    let wb;
    let ws;
    wb = XLSX.utils.book_new();
    ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
}
function formatNumber(data){
    let num = data;
    let ar = [];
    let res ="";
    
    while(num/1000 > 0){
        let pd = num % 1000;
        
        let a = "";
        if(pd<100 && pd >10 && num >=1000)
            a = "0"+Math.round(pd*100)/100;
        else if(pd<10 && num >=1000)
            a = "00"+Math.round(pd*100)/100;
        else 
            a = Math.round(pd)
        num = Math.round(num/1000 - pd/1000)
        // ar.push(Math.round(pd*100)/100);
        ar.push(a);
        
    }
    ar.reverse().forEach(function (item, index) {
        if(index+1 < ar.length) {
            res += item + ",";
        }
        else
        res += item;
    })
    return res;
}
    
