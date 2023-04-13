var data = {};

function drawChart() {
  var chart_data = []
  for(var key in data) {
    chart_data.push(data[key].levels);
    chart_data.push(data[key].deaths);
  }
  var layout = {
    title: 'PoE client log parser levels\deaths',
    xaxis: {
      autorange: true,
      rangeselector: {buttons: [
          {
            count: 1,
            label: '1d',
            step: 'day',
            stepmode: 'backward'
          },
          {
            count: 7,
            label: '1w',
            step: 'day',
            stepmode: 'backward'
          },
          {
            count: 1,
            label: '1m',
            step: 'month',
            stepmode: 'backward'
          },
          {step: 'all'}
        ]},
      rangeslider: {},
      type: 'date'
    },
    yaxis: {
      autorange: true,
      type: 'linear'
    }
  };
  Plotly.newPlot('chart_div', chart_data, layout);
}

function initCharacterData (name) {
  t_color = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
  data[name] = {
    levels: {
      type: "scatter",
      mode: "lines",
      name: name + ' levels',
      x: [],
      y: [],
      line: {color: t_color}
    },
    deaths: {
      type: "scatter",
      mode: "lines",
      name: name + ' deaths',
      x: [],
      y: [],
      line: {color: t_color}
    }
  };
}

function handleFileSelect(evt) {
  var file = evt.target.files[0];
  var reader = new FileReader();
  reader.onload = function(file) {
    var rows = file.target.result.split(/[\r\n|\n]+/);
    for (var i = 0; i < rows.length; i++){
      var m = rows[i].match(/(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2}):(\d{2}) [^:]+: ([^ ]+) \([^)]+\) is now level (\d+)/);
      if (m !== null) {
        t_color = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
        if (!(m[7] in data)) { 
          initCharacterData(m[7]);
        }
        data[m[7]].levels.x.push(new Date(m[1], m[2]-1, m[3], m[4], m[5], m[6]));
        data[m[7]].levels.y.push(parseInt(m[8]));
      }
      var m = rows[i].match(/(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2}):(\d{2}) [^:]+: ([^ ]+) \([^)]+\) достигает (\d+) уровня/);
      if (m !== null) {
        t_color = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
        if (!(m[7] in data)) { 
          initCharacterData(m[7]);
        }
        data[m[7]].levels.x.push(new Date(m[1], m[2]-1, m[3], m[4], m[5], m[6]));
        data[m[7]].levels.y.push(parseInt(m[8]));
      }
      m = rows[i].match(/(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2}):(\d{2}) [^:]+: ([^ ]+) has been slain/);
      if (m !== null) {
        t_color = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
        if (!(m[7] in data)) { 
          initCharacterData(m[7]);
        }
        data[m[7]].deaths.x.push(new Date(m[1], m[2]-1, m[3], m[4], m[5], m[6]));
        data[m[7]].deaths.y.push(-data[m[7]].deaths.x.length);
      }
      m = rows[i].match(/(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2}):(\d{2}) [^:]+: ([^ ]+) был повержен/);
      if (m !== null) {
        t_color = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
        if (!(m[7] in data)) { 
          initCharacterData(m[7]);
        }
        data[m[7]].deaths.x.push(new Date(m[1], m[2]-1, m[3], m[4], m[5], m[6]));
        data[m[7]].deaths.y.push(-data[m[7]].deaths.x.length);
      }
    }
    drawChart();
  };
  reader.readAsText(file);
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);