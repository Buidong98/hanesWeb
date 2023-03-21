const baseUrl = "/warehouse/scanBarcode/";
var dataScan=[];
var id = "";
var licensePlates = "";
var palletId="";
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
    id =  document.getElementById("idCode").value;
    console.log(id)
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
      if(caseScan.length > 15){
        let data = caseScan.split(";");
        
        let po = (typeof data[0]!=='undefined' ? data[0] :"");
        
        let code = (typeof data[1]!=='undefined' ? data[1] :"");
        let quantity = (typeof data[2]!=='undefined' ? data[2] :"0");
        let box = (typeof data[3]!=='undefined' ? data[3] :"0");
        addBoxToPallet(po,code,quantity,box);
        toastr.success(`Đã thêm thùng po:  ${po} thành công`);
      }
      if(caseScan.length == 9){
        palletId = caseScan;
        console.log("close pallet")
        closePallet();
      }
}


var boxQuantity = 0;
function addLicense(){
  licensePlates = document.getElementById("licensePlatesCode").value;
  
  if(licensePlates != ""){
    toastr.success("Thay đổi biển số xe thành công");
  }
  else
  toastr.warning("Bạn cần nhập vào biển số xe");
  
}
function addBoxToPallet(po,code,quantity,box){
  
  boxQuantity= boxQuantity+1;
  dataScan.push({
      id:boxQuantity,
      po: po,
      code:code ,
      quantity: quantity,
      box:box,
      id_employee:id
    });
    document.getElementById("itemCode").innerHTML =code;
    document.getElementById("quantityCode").innerHTML =quantity;
    document.getElementById("poCode").innerHTML =po;

    initTable();
}
function deleteScan(row,data){
    console.log(dataScan.length);
    dataScan=[];
    boxQuantity = 0;
    data.forEach(function(item, index) { 
        
        if(item.id != row.id) {
            boxQuantity += 1;
            console.log("id   "+index);
            dataScan.push({
                id:boxQuantity,
                po: item.po,
                code:item.code,
                quantity: item.quantity,
                box:item.box,
                id_employee:id

            })
        }
        initTable();
    });
    
}
function DeleteAll(){
    dataScan=[];
    boxQuantity=0;
    initTable();
}
function closePallet(){
  if(dataScan.length>0){
    $.ajax({
      url: baseUrl + 'UploadPallet',
      method: 'POST',
      data:{'dataScan':dataScan,'palletId':palletId,'licensePlates':licensePlates},
      dataType: 'json',
      success: function (result) {
        if(result.rs){
          dataScan=[];
          boxQuantity=0;
          initTable();
          toastr.success(result.msg);
        }
        else
            toastr.error(result.msg);
      }
    })
  }
  else
    toastr.error("Pallet rỗng, bạn cần thêm thùng vào pallet");
 
}
 function initTable() {
    console.log("fdf")
    document.getElementById("box/pallet").innerHTML =dataScan.length;
    $table.bootstrapTable('destroy').bootstrapTable({
        height: 740,
        locale: $('#locale').val(),
      
        columns: [
         
          {
            title: '#',
            field: 'id'
          },
          {
            title: 'PO',
            field: 'po'
          },
          {
            field: 'code',
            title: 'HBI Code'
          },
          {
            field: 'quantity',
            title: 'Quantity'
          },
          {
            field: 'box',
            title: 'Box/Carton#'
          },
          {
            field: 'action',
            title: 'Actions',
            align: 'center',
            formatter: function () {
               
              return '<button type="button" class="like btn btn-danger bnt-delete_item">Xoá</button>'
            },
            events: {
              'click .like': function (e, value, row) {
                deleteScan(row,dataScan);
               
              }
            }
          }
        ],
        data:dataScan
      
    })
 }
 $(function() {
     initTable();
     $('#locale').change(initTable)
   })
