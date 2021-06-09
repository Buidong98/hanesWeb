// Refresh data
function Refresh() {
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
        format: "mm/dd/yyyy",
    });
})

function filterRequest(){
    alert("filter request");
}