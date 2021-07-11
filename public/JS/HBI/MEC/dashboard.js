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
    reDrawPieChart(["Part 1", "Part 2", "Part 3"], [50, 30, 15]);
})

function getAllRequest(){
     
    let action = baseUrl + 'get-count';
    let datasend = {
        
    };
    PostDataAjax(action, datasend, function (response) {
        if(response.rs) {
           $("#partCount").text(response.data.part);
           $("#requestCount").text(response.data.request);
           $("#exportFee").text(number_format(response.data.exportFee));
           $("#importFee").text(number_format(response.data.importFee));
           redrawBarChart(response.data.barChartData.data1, response.data.barChartData.data2);
        }
        else{
            toastr.error(response.msg, "Thất bại");
        }
    });
}    

setInterval(function(){
    getAllRequest();
}, 60000)

// Bar chart
function redrawBarChart(importData, exportData) {
    // Area Chart Example
    var ctx = document.getElementById("myAreaChart");
    var myLineChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [{
                label: "Outcoming",
                data: importData,
                borderColor: "#4e73df",
                backgroundColor: "#4e73df",
                hoverBorderWidth: 5,
                hoverBorderColor: '#4e73df',
            },
            {
                label: "Incoming",
                data: exportData,
                borderColor: "#20c9a6",
                backgroundColor: "#20c9a6",
                hoverBorderWidth: 5,
                hoverBorderColor: '#20c9a6',
            }],

        },
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 25,
                    bottom: 0
                }
            },
            scales: {
                xAxes: [{
                    time: {
                        unit: 'date'
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        maxTicksLimit: 12
                    }
                }],
                yAxes: [{
                    ticks: {
                        maxTicksLimit: 10,
                        padding: 2,
                        // Include a dollar sign in the ticks
                        callback: function (value, index, values) {
                            return '$' + number_format(value);
                        }
                    },
                }],
            },
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                titleMarginBottom: 10,
                titleFontColor: '#6e707e',
                titleFontSize: 14,
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                intersect: false,
                mode: 'index',
                caretPadding: 10,
                callbacks: {
                    label: function (tooltipItem, chart) {
                        var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                        return datasetLabel + ': $' + number_format(tooltipItem.yLabel);
                    }
                }
            }
        }
    });
}

// Pie Chart
function reDrawPieChart(labels, data) {
    var ctx = document.getElementById("myPieChart");
    var myPieChart = new Chart(ctx, {
        // type: 'doughnut',
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
                hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
            }],
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                borderColor: '#dddfeb',
                borderWidth: 2,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                caretPadding: 10,
            },
            cutoutPercentage: 70,
        },
    });
}
