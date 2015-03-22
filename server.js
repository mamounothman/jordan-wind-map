var fs = require('fs');
var http = require('http');
var express = require('express');
var config = require('nconf');
var swig = require('swig');
var tools = require('./tools');
var stationsData = require("./stations-data");
var current = {};
current.date = new Date();
current.samples = [];

config.argv().env().file({ file: 'config.json' });


var port =  config.get('server').port;
var app = express();

var stations = [];
var samples = [];

stationsData.forEach(function(stationData, index) {
  var newStation = {
    id: stationData[0], 
    name: stationData[1],
    address: stationData[2],
    latitude: stationData[3],
    longitude: stationData[4]
  };
  stations.push(newStation);
});


stations.forEach(function(station, index){
  http.get({
    host: 'pro.arabiaweather.com',
    path: '/data/' + station.name + '/realtime.txt?' + (Math.floor(new Date()/1000))
  }, function(res) {
      res.setEncoding('utf8');
      var body = '';
      res.on('data', function(d) {
          body += d;
      });

      res.on('end', function() {
        try {
          sampleData = tools.parseToJson(body);
          SampleObj = {
            date: new Date(Math.floor(new Date()/1000)), 
            stationId: station.id,
          };
          if(res.statusCode === 200) {
            SampleObj.wv = parseFloat(sampleData.wspeed) * 0.2;
            SampleObj.wd = tools.cardinalToDegrees(sampleData.currentwdir);
          }
          else {
            SampleObj.wv = 1;
            SampleObj.wd = 0;
          }
          current.samples.push(SampleObj);
          fs.writeFileSync('./public/data/current.json', JSON.stringify(current));
        } catch (err) {
          console.error('Unable to parse response as JSON', err);
        }
      });

  }).on('error', function(err) {
    console.error('Error with the request:', err.message);
  });
});

app.use(express.static(__dirname + "/public"));

app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('view cache', false);

swig.setDefaults({ cache: false });

app.get('/', function(req, res) {
  res.render('index.html');
});

app.listen(port);
console.log('Application Started on http://localhost:' + port + "/");