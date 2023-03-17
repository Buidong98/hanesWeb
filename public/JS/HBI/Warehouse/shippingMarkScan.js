const baseUrl = "/warehouse/scanBarcode/";



$(document).ready(function () {
     $('#changeUser').modal('show');
   $( "#changeUser" ).on('shown.bs.modal', function(){
    document.getElementById("idCode").focus();
    });

});

async function  uploadExcel(){
    if (window.FormData !== undefined) {
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
                   document.getElementById('FilePo').value = "";
                }
            })
        }
        else{
            //LoadingHide();
            toastr.error("File po sai định dạng");
            document.getElementById('FilePo').value = "";
        }
    }
}
function Download_po(url){
    window.open(url, '_blank').focus();
}
function ScanId(){
    toastr.options = {
    "positionClass": "toast-bottom-right"
  }
    var id =  document.getElementById("idCode").value;
    $.ajax({
        url: baseUrl + 'CheckId',
        method: 'POST',
        data:{'id':id},
        dataType: 'json',
        success: function (result) {
            if(result.rs){
                console.log(result.msg);
                
                toastr.remove()
                toastr.success(result.msg);
                
                $('#changeUser').modal('hide');
                $( "#changeUser" ).on('hidden.bs.modal', function(){
                    document.getElementById("caseCode").focus();
                });
                document.getElementById("DLOid").innerHTML = id;
                document.getElementById("DLOName").innerHTML = result.data[0]["Name"];
            }
            else{
                toastr.remove()
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
var beforeScan="";
function AddCaseCode(){
    var idCase = document.getElementById("caseCode").value;
    let length = beforeScan.length;
    let indexOf = idCase.indexOf(beforeScan);
    let caseScan = idCase.substring(indexOf+length);
    beforeScan= caseScan;
    toastr.remove();
    document.getElementById("caseCode").value = caseScan;
    toastr.options = {
        "positionClass": "toast-bottom-right"
      }
    toastr.success(`Đã thêm thùng ${caseScan} thành công`);
}