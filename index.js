const fetch = require('node-fetch');
const HTMLParser = require('node-html-parser');

const charts = require('./charts.json');

const params = {
  area: undefined,
  indicator: undefined,
  filetype: undefined
};

exports.diviApi = async function (req, res) {
  const query = req.query;
  const validParams = Object.keys(params);
  const invalidParams = Object.keys(query).filter(key => !validParams.includes(key));

  // Handle unknown parameters
  if (invalidParams.length) {
    handleError(req, res, {
      error: `Invalid query: Unknown parameter ${invalidParams.join(', ')}. Keys are lower-case, values are upper-case.`
    });
  } else {
    handleQuery(req, res);
  }
};

async function handleQuery(req, res) {
  // Set query parameters
  Object.keys(params).forEach(key => {
    params[key] = req.query[key] || undefined;
  });
  
  const chart = charts.filter(
    chart => chart.areaId === params.area && chart.indicator == params.indicator
  )[0];

  if (chart) {
    const data = await getData(req, res, chart.chartId);

    if (data && data.length) {
      handleResponse(req, res, data);
    } else {
      handleError(req, res, {
        error: 'Query failed: No data received.'
      });
    }
  } else {
    handleError(req, res, {
      error: 'Query failed: Please check your area and indicator parameters'
    });
  }
}

async function getData(req, res, chartId) {
  const chartUrl = `https://datawrapper.dwcdn.net/${chartId}/`;
  const redirectHtml = await fetch(chartUrl)
    .then(body => body.text())
    .catch(error => handleError(req, res, error));
  const redirectDom = HTMLParser.parse(redirectHtml);
  const redirectMeta = redirectDom.querySelector('head > meta');
  const redirectUrl = redirectMeta.getAttribute('content').split('url=')[1];
  const chartVersion = redirectUrl.replace(/\/$/, '').split('/').pop();
  const csvUrl = `https://datawrapper.dwcdn.net/${chartId}/${chartVersion}/dataset.csv`;
  const csv = await fetch(csvUrl)
    .then(body => body.text())
    .catch(error => handleError(req, res, error));
  const json = csvToJson(csv);
  const jsonSorted = json.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  return jsonSorted;
}

function handleResponse(req, res, data) {
  res.set('Access-Control-Allow-Origin', '*');

  if (params.filetype === 'csv') {
    res.send(jsonToCsv(data));
  } else {
    res.send(data);
  }
}

function handleError(req, res, error) {
  const errorMessage = error.error || error.message || error;
  const errorString = `${error.name ? (error.name + ': ') : ''}${errorMessage}`;
  
  res.set('Access-Control-Allow-Origin', '*');

  if (params.filetype === 'csv') {
    res.send(errorString);
  } else {
    res.send({ error: errorString});
  }
}

function csvToJson(csv, columnSeparator = ',', rowSeparator = '\n') {
  const inferType = (str) => {
    if (!str) {
      return;
    } else if (!isNaN(str) || !isNaN(str.replace(',', '.'))) {
      return parseFloat(str.replace(',', '.'));
    } else if (Date.parse(str.replace(/"/g, ''))) {
      const date = new Date(str.replace(/"/g, ''));
      return date.toISOString().split('T')[0];
    } else {
      return str.replace(/"/g, '');
    }
  };
  const [firstLine, ...lines] = csv.split(rowSeparator)
    .filter(line => line.length);

  return lines.map(line =>
    firstLine.split(columnSeparator).reduce(
      (curr, next, index) => {
        return {
          ...curr,
          [next]: inferType(line.split(columnSeparator)[index])
        };
      },
      {}
    )
  );
}

function jsonToCsv(json) {
  const replaceEmpty = (key, value) => {
    return value === null ? '' : value;
  };
  const parseRow = row => {
    return header.map(fieldName =>
      JSON.stringify(row[fieldName], replaceEmpty)
    ).join(',');
  };
  const header = Object.keys(json[0]);
  const rows = json.map(parseRow);
  const rowsWithHeader = [header.join(','), ...rows];
  const csv = rowsWithHeader.join('\r\n');
  
  return csv;
}
