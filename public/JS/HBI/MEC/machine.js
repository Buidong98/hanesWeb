var baseUrl = "/innovation/";
var machineArr = []; // danh sách machine

// Refresh data
function refresh() {
    window.location.href = '/innovation/machine';
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
        format: "mm-dd-yyyy",
    });

    getAllMachine();

    setTimeout(() => {
        if (machineArr.length > 0) {
            let html = "<option value='' selected>Tất cả</option>";
            for (let i = 0; i < machineArr.length; i++) {
                let ele = machineArr[i];
                html += "<option value='"+ele.id+"'>"+ele.name+"</option>";
            }

            $("#txtFilterMachine, #txtModelMachine, #txtUModelMachine").html('');
            $("#txtFilterMachine, #txtModelMachine, #txtUModelMachine").append(html);
            
        }
    }, 500)
})

function getAllMachine(){
    let keyword =  $("#txtMachine").val();
    let machineType = $("#txtFilterMachineType").val();

    let action = baseUrl + 'machine/get';
    let datasend = {
        keyword: keyword,
        type: machineType
    };
    LoadingShow();
    PostDataAjax(action, datasend, function (response) {
        LoadingHide();
        if(response.rs){
            let data = response.data;
            machineArr = data;
            let html = "";
            for (let i = 0; i < data.length; i++) {
                let ele = data[i];
                html += "<tr>"
                        + "<td width='10%'>"+ ele.id +"</td>"
                        + "<td width='20%'>"+ ele.code +"</td>"
                        + "<td width='40%'>"+ ele.name +"</td>"
                        + "<td width='20%'>"+ (ele.type == 1 ? "May" : "Cắt") +"</td>"
                        + "<td width='10%'><a href='javascript:void(0)' onclick='getMachineDetail("+ele.id+")'><i class='fa fa-edit' style='font-size: 14px'></i></a></td>"
                        + "</tr>";
            }
            $("#machine-table-body").html('');
            $("#machine-table-body").html(html);
            $("#machine-count").text("(" + data.length + ")");
        }
        else{
            toastr.error(response.msg, "Thất bại");
        }
    });
}    

// download machine
function downloadMachine() {
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


// add machine 
function addMachine(){
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
function updateMachine(){
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
function getMachineDetail(id){
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

/*
    MODEL
*/

function getAllModel(){
    let keyword =  $("#txtModel").val();
    let machine = $("#txtFilterMachine").val();

    let action = baseUrl + 'model/get';
    let datasend = {
        keyword: keyword,
        machine: machine
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
                        + "<td width='20%'>"+ ele.code +"</td>"
                        + "<td width='40%'>"+ ele.name +"</td>"
                        + "<td width='20%'>"+ ele.description +"</td>"
                        + "<td width='10%'><a href='javascript:void(0)' onclick='getModelDetail("+ele.id+")'><i class='fa fa-edit' style='font-size: 14px'></i></a></td>"
                        + "</tr>";
            }
            $("#model-table-body").html('');
            $("#model-table-body").html(html);
            $("#model-count").text("(" + data.length + ")");
        }
        else{
            toastr.error(response.msg, " ");
        }
    });
}    

// download model
function downloadModel() {
    LoadingShow();
    let keyword = $("#txtModel").val();
    let action = baseUrl + 'model/download';
    let datasend = {
        keyword: keyword == "" ? "" : keyword
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
        return download(blob, GetTodayDate() + "_model.xlsx");
    });
}

// add machine 
function addModel(){
    let name =  $("#txtModelName");
    let code =  $("#txtModelCode");
    let machine =  $("#txtModelMachine");
    let des =  $("#txtModelDes");
    let qty =  $("#txtModelQty");

    if (!CheckNullOrEmpty(name, "Tên model không được để trống"))
        return false;
    if (!CheckNullOrEmpty(code, "Mã model không được để trống"))
        return false;

    let action = baseUrl + 'model/add';
    let datasend = {
        name: name.val(),
        code: code.val(),
        machine: machine.val(),
        des: des.val(),
        qty: qty.val()
    };
    LoadingShow();
    PostDataAjax(action, datasend, function (response) {
        LoadingHide();
        if(response.rs){
            let data = response.data;
            toastr.success("Thành công", "Thêm thành công");
            getAllModel();
            $("#modalAddModel").modal("hide");
        }
        else{
            toastr.error(response.msg, "Thất bại");
        }
    });
}

// update machine 
function updateModel(){
    let id = $("#txtUModelId");
    let name =  $("#txtUModelName");
    let code =  $("#txtUModelCode");
    let qty =  $("#txtUModelQty");
    let des =  $("#txtUModelDes");
    let machine =  $("#txtUModelMachine");
    let active =  $("#txtUModelActive");

    if (!CheckNullOrEmpty(name, "Tên model không được để trống"))
        return false;
    if (!CheckNullOrEmpty(code, "Tên model không được để trống"))
        return false;

    let action = baseUrl + 'model/update';
    let datasend = {
        id: id.val(),
        name: name.val(),
        code: code.val(),
        machine: machine.val(),
        qty: qty.val(),
        des: des.val(),
        active: active.val()
    };
    LoadingShow();
    PostDataAjax(action, datasend, function (response) {
        LoadingHide();
        if(response.rs){
            let data = response.data;
            toastr.success("Thành công", "Cập nhật thành công");
            getAllModel();
            $("#modalUpdateModel").modal("hide");
        }
        else{
            toastr.error(response.msg, "Thất bại");
        }
    });
}

// get machine detail
function getModelDetail(id){
    let action = baseUrl + 'model/' + id;
    LoadingShow();
    GetDataAjax(action, function (response) {
        LoadingHide();
        if(response.rs){
            let data = response.data;

            $("#txtUModelId").val(data.id);
            $("#txtUModelName").val(data.name);
            $("#txtUModelCode").val(data.code);
            $("#txtUModelQty").val(data.quantity);
            $("#txtUModelDes").val(data.description);
            $("#txtUModelMachine").val(data.machine_id);
            $("#txtUModelActive").val(data.active);
        }
        else{
            toastr.error(response.msg, "Thất bại");
        }
    });
    
    $("#modalUpdateModel").modal("show");
}

// download model
function downloadModel() {
    LoadingShow();
    let keyword =  $("#txtModel").val();
    let machine = $("#txtFilterMachine").val();

    let action = baseUrl + 'model/download';
    let datasend = {
        keyword: keyword,
        machine: machine
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
        return download(blob, GetTodayDate() + "_model.xlsx");
    });
}