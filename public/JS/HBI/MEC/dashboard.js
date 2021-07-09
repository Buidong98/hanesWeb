var baseUrl = "/innovation/dashboard/";

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
        clear: true
    });

    // initing data
    getAllRequest();
})

function getAllRequest(){
     
    let action = baseUrl + 'get-count';
    let datasend = {
        
    };
    LoadingShow();
    PostDataAjax(action, datasend, function (response) {
        LoadingHide();
        if(response.rs) {
           $("#partCount").text(response.data.part);
           $("#requestCount").text(response.data.request);
           $("#exportFee").text(response.data.exportFee.toLocaleString('en-US'));
           $("#importFee").text(response.data.importFee.toLocaleString('en-US'));
        }
        else{
            toastr.error(response.msg, "Thất bại");
        }
    });
}    

setInterval(function(){
    getAllRequest();
}, 60000)