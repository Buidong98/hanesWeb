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
                    // LoadingHide();
                    if(result.rs)
                    toastr.success(result.msg);
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
            var optionVender = "<option selected>All</option>";
            if (result.data.length > 0) {
                let mVender =[];
                if(selectTable == 'plan'|| selectTable == 'total'||selectTable == 'addin'){
                    result.data.forEach(function (item, index) {
                        if (item['po'] != null) {
                            optionPO += `<option class="chart_header_option" value=${item['po']}>${item['po']}</option>\n`;
                            
                            if(!mVender.includes(item['vender'])){
                                optionVender += `<option class="chart_header_option" value="${item['vender']}">${item['vender']}</option>\n`;
                                mVender.push(item['vender']);
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
                            optionVender += `<option class="chart_header_option" value="${item['pallet']}">${item['pallet']}</option>\n`;
                            pallet.push(item['pallet']);
                        }
                        
                    });
                }
            
            }
            document.getElementById('findPo').innerHTML = optionPO;
            document.getElementById('findVender').innerHTML = optionVender;
        }
    })
}

function findVenderChanged(obj) {
    var selectTable =  document.getElementById("selectTable").value;
    var date =  document.getElementById("findDate").value;
    toastr.success(obj)
    $.ajax({
        url: baseUrl + 'findVenderChanged',
        method: 'POST',
        data: {
            'vender': obj,'select_table':selectTable,'date':date
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
        document.getElementById("titleVender").innerHTML = "Vender:";
    }
    if(obj =="scan"){
        findDateChanged(date)
        document.getElementById('findVender').innerHTML ="";
        document.getElementById("form_checkAbnormal").innerHTML ="";
        document.getElementById("titleVender").innerHTML = "pallet:";

    }
    if(obj =="plan"){
        findDateChanged(date)
        document.getElementById("form_checkAbnormal").innerHTML ="";
        document.getElementById("titleVender").innerHTML = "Vender:";

    }
    if(obj =="addin"){
        findDateChanged(date);
        document.getElementById("titleVender").innerHTML = "Vender:";

    }
}
let dataExcel = []; 
let dataFileName = "";
let dataSheetName = "";
function loadDataTable() {
   
    var date = document.getElementById("findDate").value;
    var vender = document.getElementById("findVender").value;
    var po = document.getElementById("findPo").value;
    var selectTable = document.getElementById("selectTable").value;
    $.ajax({
        url: baseUrl + 'LoadDataTable',
        method: 'POST',
        data: {
            'date': date,
            'vender': vender,
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
                    <th scope="col" class="listItem-header-actual">vender</th>
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
                                "vender":item["vender"],
                                "date":item["plan_date"]
                            });
                            i++;
                            tableBody += `<tr>
                            <td class="listItem-body-actual">${i}</th>
                            <td class="listItem-body-actual">${item["po"]}</td>
                            <td class="listItem-body-actual">${item["hbi_code"]}</td>
                            <td class="listItem-body-actual">${item["quantity_plan"]}</td>
                            <td class="listItem-body-actual">${item["quantity_actual"]}</td>
                            <td class="listItem-body-plan">
                                <!-- Button trigger modal -->
                                <div class="row">
                                <h class="quantityConfirmItem col-10" id="quantityConfirmItem${index}">${item["quantity_confirm"]}</h>
                                <a class="quntittModelOn col-2"  data-bs-toggle="modal" data-bs-placement="bottom" data-bs-target="#quantityComfirm" 
                                data-bookid='{"po":"${item["po"]}", "hbi_code":"${item["hbi_code"]}", "plan_date":"${item["plan_date"]}","quantityPlan":"${item["quantity_plan"]}","quantityActual":"${item["quantity_actual"]}","index":"${index}","quantity_confirm":"${item["quantity_confirm"]}"}'>
                                    <i class="fa-regular fa-pen-to-square"></i>
                                </a>
                                </div>
                            </td>
                            <td class="listItem-body-actual">${item["vender"]}</td>
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
                        <td class="listItem-body-actual">${item["quantity_actual"]}</td>
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
                        <th scope="col" class="listItem-header-actual">Vender</th>
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
                            "Vender":item["vender"],
                            "Date":item["DATE"]
                        });
                            tableBody += `<tr>
                            <td class="listItem-body-actual">${index+1}</th>
                            <td class="listItem-body-actual">${item["po"]}</td>
                            <td class="listItem-body-actual">${item["hbi_code"]}</td>
                            <td class="listItem-body-actual">${item["location"]}</td>
                            <td class="listItem-body-actual">${item["po_release"]}</td>
                            <td class="listItem-body-actual">${item["quantity_plan"]}</td>
                            <td class="listItem-body-actual">${item["unit"]}</td>
                            <td class="listItem-body-actual">${item["package_quantity"]}</td>
                            <td class="listItem-body-actual">${item["vender"]}</td>
                            <td class="listItem-body-actual">${item["DATE"]}</td>
                            </tr>`;
                        });}
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
                        dataExcel = [];
                        dataFileName = "ADD-IN";
                        dataSheetName="ADDIN";
                        result.data.forEach(function (item, index) {	
                            dataExcel.push({"PO-NUMBER":item["po"],
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
                                            "Vender":item["vender"],
                                        });
                            tableBody += `<tr>
                            <td class="listItem-body-actual">${index+1}</th>
                            <td class="listItem-body-actual">${item["po"]}</td>
                            <td class="listItem-body-actual">${item["po_release"]}</td>
                            <td class="listItem-body-actual">${po_Code}</td>
                            <td class="listItem-body-actual">${LINE_FC1}</td>
                            <td class="listItem-body-actual">${item["po_line_nbr"]}</td>
                            <td class="listItem-body-actual">${item["hbi_code"]}</td>
                            <td class="listItem-body-actual">${item["quantity"]}</td>
                            <td class="listItem-body-actual">${item["unit"]}</td>
                            <td class="listItem-body-actual">${item["location"]}</td>
                            <td class="listItem-body-actual">${item["vender"]}</td>
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
    var quantityComfirm = document.getElementById('modalQuantityConfirm').value;
    toastr.remove();
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