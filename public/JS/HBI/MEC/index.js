const baseUrl = "/innovation/";

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

// Load khi tải trang xong
$(document).ready(function () {
    // init time picker
    let html = "";
    for (let i = 0; i < Timepickers.length; i++) {
        let ele = Timepickers[i];
        html += `<option value='${ele.value}'>${ele.text}</option>`
    }
    $("#txtTime").append(html);

    // init datepicker for all input date type
    $('.isDate').datepicker({
        format: "dd/mm/yyyy",
    });

    $('.modal').on('shown.bs.modal', function () {
        $(this).find('[autofocus]').focus();
    });

    let date = new Date().toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    $('.isDate').val(date);

    getAllRequest();
})

function getAllRequest() {
    let status = $("#txtStatus").val();
    let date = $("#processing-date").val();
    let action = baseUrl + 'getPartRequest';
    let datasend = {
        status: status,
        date: date
    };
    LoadingShow();
    PostDataAjax(action, datasend, function (response) {
        LoadingHide();
        if (response.rs) {
            let data = response.data;
            let html = "";
            for (let i = 0; i < data.length; i++) {
                let ele = data[i];
                html += "<tr>"
                    + "<td width='10%'>" + ele.id + "</td>"
                    + "<td width='20%'>" + ele.code + "</td>"
                    + "<td width='20%'>" + ele.name + "</td>"
                    + "<td width='20%'>" + (ele.manager_status == '1' ? "<i class='text-success fa fa-check-circle'></i>" : "<i class='text-danger fa fa-times-circle'></i>") + "</td>"
                    + "<td width='20%'>" + (ele.clerk_status == '1' ? "<i class='text-success fa fa-check-circle'></i>" : "<i class='text-danger fa fa-times-circle'></i>") + "</td>"
                    + "<td width='10%'><a href='javascript:void(0)' onclick='getRequestDetail(" + ele.id + ")'><i class='fa fa-edit' style='font-size: 14px'></i></a></td>"
                    + "</tr>";
            }
            $("#processing-table-body").html('');
            $("#processing-table-body").html(html);
            $("#processing-part-count").text("(" + data.length + ")");
        }
        else {

        }
    });
}

// get request detail
function getRequestDetail(id) {
    let action = baseUrl + 'request/' + id;
    LoadingShow();
    GetDataAjax(action, function (response) {
        LoadingHide();
        if (response.rs) {
            let data = response.data;

            $("#txtURId").val(data.id);
            $("#txtURPartName").val(data.name);
            $("#txtURPartCode").val(data.code);
            $("#txtURPartQty").val(data.qty);
            $("#txtURPartLocation").val(data.location);
            $("#txtDPartDes").val(data.description);
            $("#txtURPartQtyExport").val(data.export_qty == 0 ? data.qty : data.export_qty);
        }
        else {

        }
    });

    $("#modalUpdateRequest").modal("show");
}

// Thêm yêu cầu vặt tư
function addRequest() {
    let name = $("#txtRPartName");
    let code = $("#txtRPartCode");
    let qty = $("#txtRPartQty");
    let location = $("#txtRPartLocation");
    let reason = $("#txtRPartReason");
    let tag = $("#txtRPartTag");

    if (!CheckNullOrEmpty(name, "Tên loại máy không được để trống"))
        return false;
    if (!CheckNullOrEmpty(code, "Tên mã máy không được để trống"))
        return false;
    let remainQty = parseInt($("#txtPartRemainQty").text());
    if (remainQty < parseInt(qty.val())) {
        toastr.error("Trong kho không đủ số lượng.");
        return false;
    }

    let action = baseUrl + 'request/add';
    let datasend = {
        name: name.val(),
        code: code.val(),
        qty: qty.val(),
        location: location.val(),
        reason: reason.val(),
        tag: tag.val()
    };
    LoadingShow();
    PostDataAjax(action, datasend, function (response) {
        LoadingHide();
        if (response.rs) {
            toastr.success("Thành công", "Thêm thành công");
            getAllRequest();
            $("#modalAddRequest").modal("hide");
            socket.emit('add-part-request', { user: "", message: "" });
        }
        else {
            toastr.error(response.msg, "Thất bại");
        }
    });
}

// Cập nhật yêu cầu vặt tư
function updateRequest() {
    let id = $("#txtURId");
    let export_qty = $("#txtURPartQtyExport");

    let action = baseUrl + 'request/update';
    let datasend = {
        id: id.val(),
        export_qty: export_qty.val()
    };
    LoadingShow();
    PostDataAjax(action, datasend, function (response) {
        LoadingHide();
        if (response.rs) {
            toastr.success("Thành công", "Cập nhật thành công");
            getAllRequest();
            $("#modalUpdateRequest").modal("hide");
            socket.emit('update-part-request', { user: "", message: "" });
        }
        else {
            toastr.error(response.msg, "Thất bại");
        }
    });
}

// Tải báo cáo
function report() {
    LoadingShow();
    let status = $("#txtStatus").val();
    let fromDate = $("#txtReportFrom").val();
    let toDate = $("#txtReportTo").val();
    let action = baseUrl + 'request/download';
    let datasend = {
        status: status,
        fromDate: fromDate,
        toDate: toDate
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
        return download(blob, GetTodayDate() + "_spare_part_request.xlsx");
    });
}

// tìm kiếm part
$("#txtRPartName").on("keyup", $.debounce(250, searchPart));
var partArr = [];

function searchPart() {
    let keyword = $("#txtRPartName").val();
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
                                html += "<div class='d-flex part-result' onclick='selectPart(" + ele.id + ")'>"
                                    + "<img class='search-image' src='/Image/Parts/" + (ele.image == "" ? "no_image.png" : ele.image) + "' width='75px' />"
                                    + "<div class=''>"
                                    + "<h5>Tên: <strong>" + ele.name + "</strong></h5>"
                                    + "<p class='m-0'>Mã: <strong>" + ele.code + "</strong></p>"
                                    + "</div>"
                                    + "</div>";
                            }
                            $(".search-result-panel").removeClass('d-none');
                            $(".search-result-panel").html('');
                            $(".search-result-panel").html(html);
                        }
                        else {
                            $(".search-result-panel").addClass('d-none');
                            $(".search-result-panel").html('');
                        }
                    }
                    else {
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
function selectPart(id) {
    let listPart = partArr.filter(function (ele) {
        return ele.id == id;
    })

    let selectedPart = listPart[0];
    // full fill to input
    $("#txtRPartName").val(selectedPart.name);
    $("#txtRPartCode").val(selectedPart.code);
    $("#txtRPartLocation").val(selectedPart.location);
    $("#txtPartRemainQty").text(selectedPart.quantity);

    // close search result panel
    $(".search-result-panel").addClass('d-none');
    $(".search-result-panel").html('');
}

// Warning part
function getWarningPart() {
    let keyword = $("#txtWarningPart").val();
    let action = baseUrl + 'warning';
    let datasend = {
        keyword: keyword == "" ? "" : keyword
    };
    LoadingShow();
    PostDataAjax(action, datasend, function (response) {
        LoadingHide();
        if (response.rs) {
            let data = response.data;
            let html = "";
            for (let i = 0; i < data.length; i++) {
                let ele = data[i];
                html += "<tr>"
                    + "<td width='10%'>" + ele.id + "</td>"
                    + "<td width='20%'>" + ele.code + "</td>"
                    + "<td width='30%'>" + ele.name + "</td>"
                    + "<td width='20%'>" + ele.quantity + "</td>"
                    + "<td width='20%'>" + ele.min_quantity + "</td>"
                    + "</tr>";
            }
            $("#warning-table-body").html('');
            $("#warning-table-body").html(html);
            $("#warning-part-count").text("(" + data.length + ")");
        }
        else {

        }
    });
}

// download warning part
function downloadWarningPart() {
    LoadingShow();
    let keyword = $("#txtWarningPart").val();
    let action = baseUrl + 'warning/download';
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
        return download(blob, GetTodayDate() + "_warning_part.xlsx");
    });
}

// All part
function getAllPart() {
    let keyword = $("#txtAllPart").val();
    let action = baseUrl + 'parts';
    let datasend = {
        keyword: keyword == "" ? "" : keyword
    };
    LoadingShow();
    PostDataAjax(action, datasend, function (response) {
        LoadingHide();
        if (response.rs) {
            let data = response.data;
            let html = "";
            for (let i = 0; i < data.length; i++) {
                let ele = data[i];
                html += "<tr>"
                    + "<td width='10%'>" + ele.id + "</td>"
                    + "<td width='20%'>" + ele.code + "</td>"
                    + "<td width='20%'>" + ele.name + "</td>"
                    + "<td width='20%'>" + ele.quantity + "</td>"
                    + "<td width='20%'>" + ele.location + "</td>"
                    + "<td width='10%'><a href='javascript:void(0)' onclick='getPartDetail(" + ele.id + ")'><i class='fa fa-edit'></i></s></td>"
                    + "</tr>";
            }
            $("#all-table-body").html('');
            $("#all-table-body").html(html);
            $("#all-part-count").text("(" + data.length + ")");
        }
        else {

        }
    });
}

// download warning part
function downloadPart() {
    LoadingShow();
    let keyword = $("#txtAllPart").val();
    let action = baseUrl + 'part/download';
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
        return download(blob, GetTodayDate() + "_part.xlsx");
    });
}


// get part detail
function getPartDetail(id) {
    let action = baseUrl + 'parts/' + id;
    LoadingShow();
    GetDataAjax(action, function (response) {
        LoadingHide();
        if (response.rs) {
            let data = response.data;

            $("#txtDPartId").val(data.id);
            $("#txtDPartName").val(data.name);
            $("#txtDPartCode").val(data.code);
            $("#txtDPartQty").val(data.quantity);
            $("#txtDPartLocation").val(data.location);
            $("#txtDPartDes").val(data.description);
        }
        else {

        }
    });

    $("#modalUpdatePart").modal("show");
}

// add part 
function addPart() {
    let name = $("#txtAPartName");
    let code = $("#txtAPartCode");
    let qty = $("#txtAPartQty");
    let min_qty = $("#txtAPartMinQty");
    let location = $("#txtAPartLocation");
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
        if (response.rs) {
            toastr.success("Thành công", "Thêm thành công");
            getAllPart();
            $("#modalAddPart").modal("hide");
        }
        else {
            toastr.error(response.msg, "Thất bại");
        }
    });
}

// update part 
function updatePart() {
    let id = $("#txtDPartId");
    let name = $("#txtDPartName");
    let code = $("#txtDPartCode");
    let qty = $("#txtDPartQty");
    let location = $("#txtDPartLocation");
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
        if (response.rs) {
            toastr.success("Thành công", "Cập nhật thành công");
            getAllPart();
            $("#modalUpdatePart").modal("hide");
        }
        else {
            toastr.error(response.msg, "Thất bại");
        }
    });
}

// upload image 
function uploadImage(event) {

    let files = event.target.files;
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        let reader = new FileReader();
        reader.onload = function (event) {
            setTimeout(function () {
                let img = event.target.result;
                $("#part-img").attr("src", img);

                // let file = event.target.files[0];
                let imageType = /image.*/;

                if (!file.type.match(imageType)) return;

                let form_data = new FormData();
                form_data.append('file', file);

                for (let key of form_data.entries()) {
                    console.log(key[0] + ', ' + key[1]);
                }

                $.ajax({
                    url: baseUrl + "part/upload",
                    cache: false,
                    contentType: false,
                    processData: false,
                    data: form_data,
                    type: 'POST',
                    success: function (response) {
                        console.log(response);
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });

            }, 100);
        };
        reader.readAsDataURL(file);
    }
}

// Socket
const socket = io();

socket.on('add-part-request', (data) => {
    getAllRequest();
});

socket.on('update-part-request', (data) => {
    getAllRequest();
});