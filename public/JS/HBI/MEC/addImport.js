var baseUrl = "/innovation/";

$(document).on('click', '.dropdown-menu', function (e) {
    e.stopPropagation();
});

$(document).on('click', '.day', function (e) {
    $('.datepicker').css('display', 'none')
    e.preventDefault();
    e.stopPropagation();
})

$(document).ready(function () {
    $('.isDate').datepicker({
        format: "dd/mm/yyyy",
    });
    console.log(partArr);
})

var index = 1;
var partArr = [
    {
        id: index
    }
];
var listPart = [];
// add request 
function addRequest(){
    let po =  $("#txtPO");
    let importDate =  $("#txtImportDate");
    let vendor =  $("#txtVendor");
    let deliverer =  $("#txtDeliverer");
    let receiver =  $("#txtReceiver");

    if (!CheckNullOrEmpty(po, "Mã PO không được để trống"))
        return false;
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

    let action = baseUrl + 'import/add';
    let datasend = {
        importInfo: {
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
            let data = response.data;
            toastr.success("Thành công", "Thêm thành công");
        }
        else{
            toastr.error(response.msg, "Thất bại");
        }
    });
}

function addRow(){
    let idx = ++index;
    partArr.push({
        id: idx,
    })

    let html = `<tr id="tr-${idx}">
                    <td><input type="text" class="form-control partCode"></td>
                    <td><input type="text" class="form-control partName"></td>
                    <td><input type="text" class="form-control unit"></td>
                    <td><input type="text" class="form-control qtyPO"></td>
                    <td><input type="text" class="form-control qtyImport"></td>
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

// update machine 
function updateRequest(){
    let id = $("#txtUMachineId");
    let name =  $("#txtUMachineName");
    let code =  $("#txtUMachineCode");
    let type =  $("#txtUMachineType");
    let active =  $("#txtUMachineActive");

    if (!CheckNullOrEmpty(name, "Tên loại máy không được để trống"))
        return false;
    if (!CheckNullOrEmpty(code, "Tên mã máy không được để trống"))
        return false;

    let action = baseUrl + 'machine/update';
    let datasend = {
        id: id.val(),
        name: name.val(),
        code: code.val(),
        type: type.val(),
        active: active.val()
    };
    LoadingShow();
    PostDataAjax(action, datasend, function (response) {
        LoadingHide();
        if(response.rs){
            let data = response.data;
            toastr.success("Thành công", "Cập nhật thành công");
            getAllMachine();
            $("#modalUpdateMachine").modal("hide");
        }
        else{
            toastr.error(response.msg, "Thất bại");
        }
    });
}

// get machine detail
function getRequestDetail(id){
    let action = baseUrl + 'machine/' + id;
    LoadingShow();
    GetDataAjax(action, function (response) {
        LoadingHide();
        if(response.rs){
            let data = response.data;

            $("#txtUMachineId").val(data.id);
            $("#txtUMachineName").val(data.name);
            $("#txtUMachineCode").val(data.code);
            $("#txtUMachineType").val(data.type);
            $("#txtUMachineActive").val(data.active);
        }
        else{
            toastr.error(response.msg, "Thất bại");
        }
    });
    
    $("#modalUpdateMachine").modal("show");
}