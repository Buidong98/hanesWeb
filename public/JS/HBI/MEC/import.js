var baseUrl = "/innovation/import/";

// Refresh data
function refresh() {
    window.location.href = '/innovation/import';
}

$(document).on('click', '.dropdown-menu', function (e) {
    e.stopPropagation();
});

$(document).on('click', '.day', function (e) {
    $('.datepicker').css('display', 'none')
    e.preventDefault();
    e.stopPropagation();
})

// Load khi tải trang xong
$(document).ready(function () {
    $('.isDate').datepicker({
        format: "dd/mm/yyyy",
    });

    getAllRequest();
})

function getAllRequest(){
    let po = $("#txtPO").val();
    let importDate = $("#txtImportDate").val();
    let vendor = $("#txtVendor").val();

    let action = baseUrl + 'get';
    let datasend = {
        po: po,
        importDate: importDate,
        vendor: vendor
    };
    LoadingShow();
    PostDataAjax(action, datasend, function (response) {
        LoadingHide();
        if(response.rs){
            let data = response.data;
            let html = "";
            for (let i = 0; i < data.length; i++) {
                let ele = data[i];
                html += "<tr>"
                        + "<td width='10%'>"+ ele.id +"</td>"
                        + "<td width='20%'>"+ ele.po +"</td>"
                        + "<td width='30%'>"+ ele.import_date +"</td>"
                        + "<td width='30%'>"+ ele.vendor +"</td>"
                        + "<td width='10%'><a href='javascript:void(0)' onclick='getImportDetail("+ ele.id +")'><i class='fa fa-edit' style='font-size: 14px'></i></a></td>"
                        + "</tr>";
            }
            $("#import-table-body").html('');
            $("#import-table-body").html(html);
        }
        else{
            toastr.error(response.msg, "Thất bại");
        }
    });
}    

var partArr = [];
var index = 1;
var listPart = [];
// update request 
function updateRequest(){
    listPart = [];

    let id =  $("#txtDId");
    let po =  $("#txtDPO");
    let importDate =  $("#txtDImportDate");
    let vendor =  $("#txtDVendor");
    let deliverer =  $("#txtDDeliverer");
    let receiver =  $("#txtDReceiver");

    if (!CheckNullOrEmpty(importDate, "Ngày nhập không được để trống"))
        return false;
    if(partArr.length <= 0){
        toastr.error("Bạn chưa nhập danh sách vật tư");
        return false;
    }

    let partCodeList = $(".partCode");
    let partNameList = $(".partName");
    let unitList = $(".unit");
    let qtyPOList = $(".qtyPO");
    let qtyImportList = $(".qtyImport");

    for (let i = 0; i < partArr.length; i++) {
        partCode = $(partCodeList[i]).val();
        partName = $(partNameList[i]).val();
        unit = $(unitList[i]).val();
        qtyPO = $(qtyPOList[i]).val();
        qtyImport = $(qtyImportList[i]).val();
        
        listPart.push({
            code: partCode,
            name: partName,
            unit: unit,
            qty: qtyPO,
            qtyImport: qtyImport
        });
    }

    let action = baseUrl + 'update';
    let datasend = {
        importInfo: {
            id: id.val(),
            po: po.val(),
            importDate: importDate.val(),
            vendor: vendor.val(),
            deliverer: deliverer.val(),
            receiver: receiver.val(),
        },
        listPart: listPart
    };
    LoadingShow();
    PostDataAjax(action, datasend, function (response) {
        LoadingHide();
        if(response.rs){
            toastr.success(response.msg, "Thành công");
        }
        else{
            toastr.error(response.msg, "Thất bại");
        }
    });
}

// get import detail
function getImportDetail(id){
    partArr = [];
    let action = baseUrl + 'get-import-detail'
    let datasend = {
        id: id
    }
    LoadingShow();
    PostDataAjax(action, datasend, function (response) {
        LoadingHide();
        if(response.rs){
            let importInfo = response.data.info;
            $("#txtDPO").text(importInfo.po);
            $("#txtDId").val(importInfo.id);
            $("#txtDImportDate").val(importInfo.import_date);
            $("#txtDVendor").val(importInfo.vendor);
            $("#txtDDeliverer").val(importInfo.deliverer);
            $("#txtDReceiver").val(importInfo.receiver);

            $("#list-part-body").html('');
            let html = "";
            let importDetail = response.data.items;
            for (let i = 0; i < importDetail.length; i++) {
                let ele = importDetail[i];
                html += `<tr id="tr-${i + 1}">                   
                    <td>
                        <input type="text" class="form-control partName" value='${ele.part_name}'>
                        <div class="d-none search-result-panel" style="border: 1px dotted yellowgreen; width: 100%; height: auto; border-radius: 3px; background: whitesmoke;">
                        </div>
                    </td>
                    <td><input type="text" class="form-control partCode" value='${ele.part_code}'></td>
                    <td><input type="text" class="form-control unit" value='${ele.unit}'></td>
                    <td><input type="text" class="form-control qtyPO" value='${ele.qty_po}'></td>
                    <td><input type="text" class="form-control qtyImport" value='${ele.qty_real}'></td>
                    <td><button class="btn btn-outline-success" onclick="deleteRow(event, ${ele.id})"><i class="fa fa-close"></i></button></td>
                </tr>`;

                partArr.push({
                    id: i + 1,
                })
            }
            index = importDetail.length;
            $("#list-part-body").append(html);
        }
        else{
            toastr.error(response.msg, "Thất bại");
        }
    });
    
    $("#modalImportDetail").modal("show");
}

function addRow(){
    let idx = ++index;
    partArr.push({
        id: idx,
    })

    // let html = `<tr id="tr-${idx}">
    //                 <td><input type="text" class="form-control partCode"></td>
    //                 <td><input type="text" class="form-control partName"></td>
    //                 <td><input type="text" class="form-control unit"></td>
    //                 <td><input type="text" class="form-control qtyPO"></td>
    //                 <td><input type="text" class="form-control qtyImport"></td>
    //                 <td><button class="btn btn-outline-success" onclick="deleteRow(event, ${idx})"><i class="fa fa-close"></i></button></td>
    //             </tr>`;

    let html = `<tr id="tr-${idx}">
                    <td>
                        <input type="text" class="form-control partName" data-value='${idx}' id='name-${idx}'>
                        <div class="d-none search-result-panel" style="border: 1px dotted yellowgreen; width: 100%; height: auto; border-radius: 3px; background: whitesmoke;">
                        </div>
                    </td>
                    <td><input type="text" class="form-control partCode" id='code-${idx}'></td>
                    <td><input type="text" class="form-control unit" id='unit-${idx}'></td>
                    <td><input type="number" class="form-control qtyPO"></td>
                    <td><input type="number" class="form-control qtyImport"></td>
                    <td><button class="btn btn-outline-success" onclick="deleteRow(event, ${idx})"><i class="fa fa-close"></i></button></td>
                </tr>`;

    $("#list-part-body").append(html);
}


function deleteRow(e, idx){
    let obj = partArr.filter((ele) => {
        return ele.id == idx;
    })
    let i = partArr.indexOf(obj[0]);
    partArr.splice(i, 1);

    $(e.currentTarget).parent().parent().remove();
}

// tìm kiếm part
// $(".partName").on("keyup", $.debounce(250, searchPart));
$(document).on("keyup", ".partName", $.debounce(250, searchPart));
var partArrSearch = [];

function searchPart() {
    let currentInput = $(this);
    let dataValue = currentInput.attr("data-value");
    let keyword = currentInput.val();
    setTimeout(function () {
        if (keyword.length >= 1) {
            let datasend = {
                keyword: keyword,
                pageSize: 5
            }
            let action = "/innovation/suggest";
            PostDataAjax(action, datasend, function (response) {
                LoadingHide();
                setTimeout(function () {
                    if (response.rs) {
                        if (response.data.length >= 1) {
                            let data = response.data;
                            partArrSearch = data;
                            let html = "";
                            for (let i = 0; i < data.length; i++) {
                                let ele = data[i];
                                html += "<div class='d-flex part-result' onclick='selectPart(" + ele.id + ", "+ dataValue +")'>"
                                    + "<img class='search-image' src='/Image/Parts/" + (ele.image == "" ? "no_image.png" : ele.image) +"' width='75px' />"
                                    + "<div class=''>"
                                    + "<h5>Tên: <strong>" + ele.name + "</strong></h5>"
                                    + "<p class='m-0'>Mã: <strong>" + ele.code + "</strong></p>"
                                    + "</div>"
                                    + "</div>";
                            }

                            currentInput.next().removeClass('d-none');
                            currentInput.next().html('');
                            currentInput.next().html(html);
                        }
                        else {
                            currentInput.next().addClass('d-none');
                            currentInput.next().html('');
                        }
                    }
                    else {
                        currentInput.next().addClass('d-none');
                        currentInput.next().html('');
                    }
                });
            });
        } else {
            currentInput.next().addClass('d-none');
            currentInput.next().html('');
        }
    });
}

// select part
function selectPart(id, value) {
    let listPart = partArrSearch.filter(function (ele) {
        return ele.id == id;
    })

    let selectedPart = listPart[0];
    // full fill to input
    $("#name-" + value).val(selectedPart.name);
    $("#code-" + value).val(selectedPart.code);
    $("#unit-" + value).val(selectedPart.unit);

    // close search result panel
    $(".search-result-panel").addClass('d-none');
    $(".search-result-panel").html('');
}