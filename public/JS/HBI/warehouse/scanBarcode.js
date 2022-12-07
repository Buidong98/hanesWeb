const baseUrl = "/warehouse/scanBarcode/";



$(document).ready(function () {
    $('#changeUser').modal('show');
   // document.getElementById("#changeUser").focus();
   $( "#changeUser" ).on('shown.bs.modal', function(){
    document.getElementById("idCode").focus();
    });

});

window.onload = function() {
  //  $('#changeUser').focus();
    //document.getElementById("idCode").focus();
    console.log( document.getElementById("caseCode").value );
  }
async function  uploadExcel(){
    if (window.FormData !== undefined) {
        console.log( document.getElementById('FilePo').files.length );
        const file = document.getElementById('FilePo').files[0];
        var dataJson = {};
        await file.arrayBuffer().then((res) => {
            let data = new Uint8Array(res);
            let workbook = XLSX.read(data,{type:"array"});
            let first_sheet_name = workbook.SheetNames[0];
            let worksheet = workbook.Sheets[first_sheet_name];
            dataJson = XLSX.utils.sheet_to_json(worksheet);
        })
        //LoadingShow();
        if(typeof dataJson[0].WAREHOUSE != "undefined" && typeof dataJson[0].PR_NUM != "undefined" && typeof dataJson[0].ITEM_STYLE != "undefined"){           
            $.ajax({
                url: baseUrl + 'poUpdate',
                method: 'POST',
                data:{'dataJson':dataJson},
                dataType: 'json',
                success: function (result) {
                    console.log(result);
                   // LoadingHide();
                   toastr.success("Upload file po thành công");
                }
            })
        }
        else{
            //LoadingHide();
            toastr.error("File po sai định dạng");
        }
    }
}
function Download_po(url){
    window.open(url, '_blank').focus();
}
function ScanId(){
    var id =  document.getElementById("idCode").value;
    $.ajax({
        url: baseUrl + 'CheckId',
        method: 'POST',
        data:{'id':id},
        dataType: 'json',
        success: function (result) {
            if(result.rs){
                console.log(result.msg);
                toastr.success(result.msg);
                $('#changeUser').modal('hide');
                $( "#changeUser" ).on('hidden.bs.modal', function(){
                    document.getElementById("caseCode").focus();
                });
                document.getElementById("DLOid").innerHTML = id;
                document.getElementById("DLOName").innerHTML = result.data[0]["Name"];
            }
            else{
                toastr.warning(result.msg);
                document.getElementById("idCode").value = "";
            }
           
        }
    })


    
}
function SaveId(){
    $('#changeUser').modal('hide');
    document.getElementById("caseCode").focus();
    
}
var a="";
function AddCaseCode(){
    var idCase = document.getElementById("caseCode").value;
    let length = a.length;
    let indexOf = idCase.indexOf(a);
    let result = idCase.substring(indexOf+length);
    a= result;
    console.log(a);
    console.log(result);
    toastr.remove();
    document.getElementById("caseCode").value = result;
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
      }
    toastr.success(`Đã thêm thùng ${result} thành công`);
}