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

// downloa request
function downloadRequest() {
    LoadingShow();
    let keyword =  $("#txtMachine").val();
    let machineType = $("#txtFilterMachineType").val();

    let action = baseUrl + 'machine/download';
    let datasend = {
        keyword: keyword,
        type: machineType
    };

    fetch(action, {
            method: 'POST',
            body: JSON.stringify(datasend),
            headers: {
                'Content-Type': 'application/json'
        },
    }).then(function (resp) {
        return resp.blob();
    }).then(function (blob) {
        LoadingHide();
        return download(blob, GetTodayDate() + "_machine.xlsx");
    });
}


// add request 
function addRequest(){
    let name =  $("#txtMachineName");
    let code =  $("#txtMachineCode");
    let type =  $("#txtMachineType");

    if (!CheckNullOrEmpty(name, "Tên loại máy không được để trống"))
        return false;
    if (!CheckNullOrEmpty(code, "Tên mã máy không được để trống"))
        return false;

    let action = baseUrl + 'machine/add';
    let datasend = {
        name: name.val(),
        code: code.val(),
        type: type.val()
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