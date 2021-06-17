var baseUrl = "/innovation/";

// Refresh data
function refresh() {
    window.location.href = '/innovation';
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

    getAllRequest();
})

function getAllRequest(){
    var status =  $("#txtStatus").val();
    var date = $("#processing-date").val();
    var action = baseUrl + 'getPartRequest';
    var datasend = {
        status: status,
        date: date
    };
    LoadingShow();
    PostDataAjax(action, datasend, function (response) {
        LoadingHide();
        if (response.rs){
            let data = response.data;
            let html = "";
            for (let i = 0; i < data.length; i++) {
                let ele = data[i];
                html += "<tr>"
                        + "<td width='10%'>"+ ele.id +"</td>"
                        + "<td width='20%'>"+ ele.part_code +"</td>"
                        + "<td width='20%'>"+ ele.part_name +"</td>"
                        + "<td width='20%'>"+ (ele.manager_status == '0' ? "<i class='text-success fa fa-check-circle'></i>" : "<i class='text-danger fa fa-times-circle'></i>") +"</td>"
                        + "<td width='20%'>"+ (ele.clerk == '0' ? "<i class='text-success fa fa-check-circle'></i>" : "<i class='text-danger fa fa-times-circle'></i>") +"</td>"
                        + "<td width='10%'><a href='javascript:void(0)'><i class='fa fa-edit' style='font-size: 14px'></i></a></td>"
                        + "</tr>";
            }
            $("#processing-table-body").html('');
            $("#processing-table-body").html(html);
            $("#processing-part-count").text("(" + data.length + ")");
        }
        else{

        }
    });
}    

// Thêm yêu cầu vặt tư
function addRequest(){
    toastr.success("create request uccess");
}

// Tải báo cáo
function report(){
    toastr.success("download success");
}

// tìm kiếm part
$("#txtPartName").on("keyup", $.debounce(250, searchPart));
var partArr = [];

function searchPart(){
    var keyword = $("#txtPartName").val();
    setTimeout(function () {
        if (keyword.length >= 1) {
            let datasend = {
                keyword: keyword,
                pageSize: 5
            }
            let action = baseUrl + "suggest";
            PostDataAjax(action, datasend, function (response) {
                LoadingHide();
                setTimeout(function () {
                    if (response.rs) {
                        if (response.data.length >= 1) {
                            let data = response.data;
                            partArr = data;
                            let html = "";
                            for (let i = 0; i < data.length; i++) {
                                let ele = data[i];
                                html += "<div class='d-flex part-result' onclick='selectPart("+ele.id+")'>"
                                            +"<img class='search-image' src='/Image/"+ele.id+".jpg' width='75px' />"
                                            +"<div class=''>"
                                                +"<h5>Tên: <strong>"+ele.name+"</strong></h5>"
                                                +"<p class='m-0'>Mã: <strong>"+ele.part_code+"</strong></p>"
                                            +"</div>"
                                        +"</div>";
                            }
                            $(".search-result-panel").removeClass('d-none');
                            $(".search-result-panel").html('');
                            $(".search-result-panel").html(html);
                        }
                        else{
                            $(".search-result-panel").addClass('d-none');
                            $(".search-result-panel").html('');
                        }
                    }
                    else{
                        $(".search-result-panel").addClass('d-none');
                        $(".search-result-panel").html('');
                    }
                });
            });
        } else {
            $(".search-result-panel").addClass('d-none');
            $(".search-result-panel").html('');
        }
    });
}

// select part
function selectPart(id){
    let listPart = partArr.filter(function(ele){
        return ele.id == id;
    })

    let selectedPart = listPart[0];
    // full fill to input
    $("#txtPartName").val(selectedPart.name);
    $("#txtPartCode").val(selectedPart.part_code);
    $("#txtPartLocation").val(selectedPart.location);
    
    // close search result panel
    $(".search-result-panel").addClass('d-none');
    $(".search-result-panel").html('');
}

// Warning part
function getWarningPart(){
    let keyword = $("#txtWarningPart").val();
    let action = baseUrl + 'warning';
    let datasend = {
        keyword: keyword == "" ? "" : keyword
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
                        + "<td width='20%'>"+ ele.part_code +"</td>"
                        + "<td width='30%'>"+ ele.name +"</td>"
                        + "<td width='20%'>"+ ele.quantity +"</td>"
                        + "<td width='20%'>"+ ele.min_quantity +"</td>"
                        + "</tr>";
            }
            $("#warning-table-body").html('');
            $("#warning-table-body").html(html);
            $("#warning-part-count").text("(" + data.length + ")");
        }
        else{

        }
    });
}

// Warning part
function getAllPart(){
    let keyword = $("#txtAllPart").val();
    let action = baseUrl + 'parts';
    let datasend = {
        keyword: keyword == "" ? "" : keyword
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
                        + "<td width='20%'>"+ ele.part_code +"</td>"
                        + "<td width='20%'>"+ ele.name +"</td>"
                        + "<td width='20%'>"+ ele.quantity +"</td>"
                        + "<td width='20%'>"+ ele.location +"</td>"
                        + "<td width='10%'><a href='javascript:void(0)' onclick='getPartDetail("+ele.id+")'><i class='fa fa-edit'></i></s></td>"
                        + "</tr>";
            }
            $("#all-table-body").html('');
            $("#all-table-body").html(html);
            $("#all-part-count").text("(" + data.length + ")");             
        }
        else{

        }
    });
}

// get part detail
function getPartDetail(id){
    let action = baseUrl + 'parts/' + id;
    LoadingShow();
    GetDataAjax(action, function (response) {
        LoadingHide();
        if(response.rs){
            let data = response.data;

            $("#txtDPartId").val(data.id);
            $("#txtDPartName").val(data.name);
            $("#txtDPartCode").val(data.part_code);
            $("#txtDPartQty").val(data.quantity);
            $("#txtDPartLocation").val(data.location);
            $("#txtDPartDes").val(data.description);
        }
        else{

        }
    });
    
    $("#modalUpdatePart").modal("show");
}

// add part 
function addPart(){
    let name =  $("#txtAPartName");
    let code =  $("#txtAPartCode");
    let qty =  $("#txtAPartQty");
    let min_qty = $("#txtAPartMinQty");
    let location =  $("#txtAPartLocation");
    let des = $("#txtAPartDes");
    let img = $("#part-image-upload").val();

    if (!CheckNullOrEmpty(name, "Tên loại máy không được để trống"))
        return false;
    if (!CheckNullOrEmpty(code, "Tên mã máy không được để trống"))
        return false;

    let action = baseUrl + 'parts/add';
    let datasend = {
        name: name.val(),
        code: code.val(),
        qty: qty.val(),
        min_qty: min_qty.val(),
        location: location.val(),
        des: des.val(),
        img: img
    };
    LoadingShow();
    PostDataAjax(action, datasend, function (response) {
        LoadingHide(); 
        if(response.rs){
            toastr.success("Thành công", "Thêm thành công");
            getAllPart();
            $("#modalAddPart").modal("hide");
        }
        else{
            toastr.error(response.msg, "Thất bại");
        }
    });
}

// update part 
function updatePart(){
    let id = $("#txtDPartId");
    let name =  $("#txtDPartName");
    let code =  $("#txtDPartCode");
    let qty =  $("#txtDPartQty");
    let location =  $("#txtDPartLocation");
    let des = $("#txtDPartDes");

    if (!CheckNullOrEmpty(name, "Tên loại máy không được để trống"))
        return false;
    if (!CheckNullOrEmpty(code, "Tên mã máy không được để trống"))
        return false;

    let action = baseUrl + 'parts/update';
    let datasend = {
        id: id.val(),
        name: name.val(),
        code: code.val(),
        qty: qty.val(),
        location: location.val(),
        des: des.val()
    };
    LoadingShow();
    PostDataAjax(action, datasend, function (response) {
        LoadingHide();
        if(response.rs){
            toastr.success("Thành công", "Cập nhật thành công");
            getAllPart();
            $("#modalUpdatePart").modal("hide");
        }
        else{
            toastr.error(response.msg, "Thất bại");
        }
    });
}

// upload image 
function uploadImage(event){

    var files = event.target.files;
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var reader = new FileReader();
        reader.onload = function (event) {
            setTimeout(function () {
                var img = event.target.result;
                $("#part-img").attr("src", img);
                
                // var file = event.target.files[0];
                var imageType = /image.*/;
            
                if (!file.type.match(imageType)) return;
            
                var form_data = new FormData();
                form_data.append('file', file);
            
                for (var key of form_data.entries()) {
                    console.log(key[0] + ', ' + key[1]);
                }
            
                $.ajax({
                    url: baseUrl + "part/upload",
                    cache: false,
                    contentType: false,
                    processData: false,
                    data: form_data,
                    type: 'POST',
                    success: function(response) {
                        console.log(response);
                    },
                    error: function(error) {
                        console.log(error);
                    }
                });

            }, 100);
        };
        reader.readAsDataURL(file);
    }
}