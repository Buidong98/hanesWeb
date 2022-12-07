let labels = [1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8];

let data = {
  labels: labels,
  datasets: [{
    label: 'cn1',
    data: [65, 59, 80, 81, 56, 55, 40,1,2,3,4,5,6,7,8,65, 59, 80, 81, 56, 55, 40,1,2,3,4,5,6,7,8],
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 205, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(201, 203, 207, 0.2)'
    ],
    borderColor: [
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(201, 203, 207)'
    ],
    borderWidth: 1
  },
  {
    label: 'cn2',
    data: [45, 39, 30,81, 56, 25, 45,1,2,3,4,5,6,7,8,45, 39, 30,81, 56, 25, 45,1,2,3,4,5,6,7,8],
    backgroundColor: [
      'rgba(255, 29, 132, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 205, 86, 0.2)',
      'rgba(175, 192, 192, 0.2)',
      'rgba(34, 162, 235, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(201, 23, 207, 0.2)'
    ],
    borderColor: [
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(201, 203, 207)'
    ],
    borderWidth: 1
  },
]
};

let configChart1 = {
  type: 'line',
  data: data,
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: true,
            font: {
                size: 30
            },
            text: 'Real time output box scanned'
        }
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        min: 0,
        ticks: {
          // Include a dollar sign in the ticks
          callback: function(value, index, ticks) {
              return value + " pcs";
          }
      },
      }
    }
  }
  };