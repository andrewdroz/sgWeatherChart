let data = [];
let timestamps = [];
let ctx = document.getElementById("myChart");
let myLineChart;

function initChart(weatherJson) {
  for (let item of weatherJson.items) {
    if (item.readings[0].station_id === "S109") {
      data.push(item.readings[0].value);
    } else {
      data.push(data[data.length - 1]);
    }
    timestamps.push(item.timestamp);
  }
  myLineChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: timestamps,
      datasets: [
        {
          label: "Ang Mo Kio Avenue 5",
          data: data,
          pointRadius: 0,
          borderColor: "#A22",
          fill: false
        }
      ]
    }
  });
}

function updateChart(weatherJson) {
  let lineChartData = myLineChart.data.datasets[0].data;
  let oldTimeStampIndex = myLineChart.data.labels.length-1;
  let oldTimeStamp = myLineChart.data.labels[oldTimeStampIndex];

  let newLastTimestamp = weatherJson.items[weatherJson.items.length-1].timestamp;
  if (newLastTimestamp !== oldTimeStamp) {
    let minuteDiff = +newLastTimestamp.substring(14, 16) - oldTimeStamp.substring(14, 16);

    for (; minuteDiff > 0; minuteDiff--) {
      let index = weatherJson.items.length-minuteDiff;
      let newTimestamp = weatherJson.items[index].timestamp;
      myLineChart.data.labels.push(newTimestamp);
      console.log(index + ' is the index');
      if (weatherJson.items[index].readings[0].station_id === 'S109') {
        let newTemp = weatherJson.items[index].readings[0].value;
        lineChartData.push(newTemp);
        console.log('stn = S109');
      } else {
        let prevIndex = lineChartData.length - 1;
        lineChartData.push(lineChartData[prevIndex]);
        console.log('stn != S109');
      }
      console.log(minuteDiff);
    }

    myLineChart.update();
  }
}

function addData(chart, label, data) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach(dataset => {
    dataset.data.push(data);
  });
  chart.update();
}
