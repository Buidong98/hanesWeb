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

function filterRequest(){
    var status =  $("#txtStatus").val();
    var date = $("#processing-date").val();

    var action = baseUrl + 'filter';
    var datasend = {
        status: status,
        date: date
    };
    LoadingShow();
    PostDataAjax(action, datasend, function (response) {
        let data = response;
        let html = "";
        for (let i = 0; i < data.length; i++) {
            let ele = data[i];
            html += "<tr>"
                    + "<td>"+ ele.id +"</td>"
                    + "<td>"+ ele.part_code +"</td>"
                    + "<td>"+ ele.part_name +"</td>"
                    + "<td>"+ (ele.manager_status == '0' ? "Chưa duyệt" : "Duyệt") +"</td>"
                    + "<td>"+ (ele.clerk == '0' ? "Chưa duyệt" : "Duyệt") +"</td>"
                    + "<td><a href='javascript:void(0)' onclick='alert("+ele.id+")' class='btn btn-link' >Chi tiết</a></td>"
                    + "</tr>";
        }
        $("#processing-table-body").html('');
        $("#processing-table-body").html(html);
        LoadingHide();
    });
}

function getAllRequest(){
    var action = baseUrl + 'getPartRequest';
    var datasend = JSON.stringify({
      
    });
    PostDataAjax(action, datasend, function (response) {
        let data = response;
        let html = "";
        for (let i = 0; i < data.length; i++) {
            let ele = data[i];
            html += "<tr>"
                    + "<td>"+ ele.id +"</td>"
                    + "<td>"+ ele.part_code +"</td>"
                    + "<td>"+ ele.part_name +"</td>"
                    + "<td>"+ (ele.manager_status == '0' ? "Chưa duyệt" : "Duyệt") +"</td>"
                    + "<td>"+ (ele.clerk == '0' ? "Chưa duyệt" : "Duyệt") +"</td>"
                    + "<td><a href='javascript:void(0)' onclick='alert("+ele.id+")' class='btn btn-link' >Chi tiết</a></td>"
                    + "</tr>";
        }
        $("#processing-table-body").html('');
        $("#processing-table-body").html(html);
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
$("#search-part").on("keyup", $.debounce(250, searchPart));

function searchPart(){
    var keyword = $("#search-part").val();
    let url = baseUrl + "suggest";
    setTimeout(function () {
        if (keyword.length >= 1) {
            $.ajax({
                url: url,
                type: "POST",
                async: false,
                data: { keyword: keyword, pageSize: 5 },
                success: function (result) {
                    setTimeout(function () {
                        if (result) {
                            result = JSON.parse(result);
                            if (result.rs) {
                                if (result.data.length >= 1) {
                                    let data = result.data;
                                    let html = "";
                                    for (let i = 0; i < data.length; i++) {
                                        let ele = data[i];
                                        html += "<div class='p-2'><span class='text-left'>"+ ele.name +"</span><span class='text-right'><img src='/Image/"+ele.id+".jpg' width='50px' /></span></div>";
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
                        }
                        else{
                            $(".search-result-panel").addClass('d-none');
                            $(".search-result-panel").html('');
                        }
                    });
                }
            });
        } else {
            $(".search-result-panel").addClass('d-none');
            $(".search-result-panel").html('');
        }
    });
}