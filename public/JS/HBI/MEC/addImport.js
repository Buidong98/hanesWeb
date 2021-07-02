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
            toastr.success(response.msg, "Thành công");
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
                    <td>
                        <input type="text" class="form-control partName" data-value='${idx}' id='name-${idx}'>
                        <div class="d-none search-result-panel" style="border: 1px dotted yellowgreen; width: 100%; height: auto; border-radius: 3px; background: whitesmoke;">
                        </div>
                    </td>
                    <td><input type="text" class="form-control partCode" id='code-${idx}'></td>
                    <td><input type="text" class="form-control unit" id='unit-${idx}'></td>
                    <td><input type="number" class="form-control qtyPO"></td>
                    <td><input type="number" class="form-control qtyImport"></td>
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

// tìm kiếm part
// $(".partName").on("keyup", $.debounce(250, searchPart));
$(document).on("keyup", ".partName", $.debounce(250, searchPart));
var partArrSearch = [];

function searchPart() {
    let currentInput = $(this);
    let dataValue = currentInput.attr("data-value");
    let keyword = currentInput.val();
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
                            partArrSearch = data;
                            let html = "";
                            for (let i = 0; i < data.length; i++) {
                                let ele = data[i];
                                html += "<div class='d-flex part-result' onclick='selectPart(" + ele.id + ", "+ dataValue +")'>"
                                    + "<img class='search-image' src='/Image/Parts/" + (ele.image == "" ? "no_image.png" : ele.image) +"' width='75px' />"
                                    + "<div class=''>"
                                    + "<h5>Tên: <strong>" + ele.name + "</strong></h5>"
                                    + "<p class='m-0'>Mã: <strong>" + ele.code + "</strong></p>"
                                    + "</div>"
                                    + "</div>";
                            }

                            currentInput.next().removeClass('d-none');
                            currentInput.next().html('');
                            currentInput.next().html(html);
                        }
                        else {
                            currentInput.next().addClass('d-none');
                            currentInput.next().html('');
                        }
                    }
                    else {
                        currentInput.next().addClass('d-none');
                        currentInput.next().html('');
                    }
                });
            });
        } else {
            currentInput.next().addClass('d-none');
            currentInput.next().html('');
        }
    });
}

// select part
function selectPart(id, value) {
    let listPart = partArrSearch.filter(function (ele) {
        return ele.id == id;
    })

    let selectedPart = listPart[0];
    // full fill to input
    $("#name-" + value).val(selectedPart.name);
    $("#code-" + value).val(selectedPart.code);
    $("#unit-" + value).val(selectedPart.unit);

    // close search result panel
    $(".search-result-panel").addClass('d-none');
    $(".search-result-panel").html('');
}

