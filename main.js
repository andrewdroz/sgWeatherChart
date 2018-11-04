let weatherJson;
let chartInitiated = false;

function httpGetAsync(theUrl, callback) {
  let xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  };
  xmlHttp.open("GET", theUrl, true); // true for asynchronous
  xmlHttp.send(null);
}

function processResponse(response) {
  weatherJson = JSON.parse(response);
  if (!chartInitiated) {
    initChart(weatherJson);
    chartInitiated = true;
  } else {
    updateChart(weatherJson);
  }
}

function getHttpStr() {
  let httpStr = "";
  let d = new Date();
  let theDate =
    d.getDate().toString().length === 1 ? "0" + d.getDate() : d.getDate();
  let dateStr = `${d.getFullYear()}-${d.getMonth() + 1}-${theDate}`;

  httpStr =
    "https://api.data.gov.sg/v1/environment/air-temperature?date=" + dateStr;

  return httpStr;
}

httpGetAsync(getHttpStr(), processResponse);

setInterval(function() {
  httpGetAsync(getHttpStr(), processResponse);
  updateChart(weatherJson);
}, 60 * 1 * 1000);
