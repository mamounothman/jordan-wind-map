var fs = require('fs');
var http = require('http');
var express = require('express');
var when = require("when");
var config = require('nconf');
var swig = require('swig');
var tools = require('./tools');
var stationsData = require("./stations-data");
const querystring = require('querystring');
var current = {};
current.date = new Date();
config.argv().env().file({ file: 'config.json' });
var app = express();

function buildStationData (stations) {
    var deferreds = [];
    current.samples = [];
    for(var i = 0, len = stations.length; i < len; i++) {
      var newStation = {
        id: stations[i][0], 
        name: stations[i][1],
        // address: stations[i][2],
        latitude: stations[i][2],
        longitude: stations[i][3]
      };
      deferreds.push(buildStationSample(newStation).then(function gotIt(sampleData) {
        current.samples.push(sampleData);
      }));
    }
    return when.all(deferreds);
}

function buildStationSample(station) {
  var deferred = when.defer();
  var options = {
      host: 'stations.arabiaweather.com',
      path: '/weatherstation/api/get?ws='+station.id+'&attr=*',
      method: 'GET',

  };
  http.get(options, function(res) {
      res.setEncoding('utf8');
      var body = '';
      res.on('data', function(d) {
          body += d;
      });

      res.on('end', function() {
        try {
          if(body != 'Not Found') {
            sampleData = tools.parseToJson(JSON.parse(body));

            
            SampleObj = {
              stationId: station.id,
            };

            if(res.statusCode === 200 && typeof sampleData.windspeed != 'undefined') {
              SampleObj.wv = parseFloat(sampleData.windspeed);
              SampleObj.wd = tools.cardinalToDegrees(sampleData.winddir);
            }
            else {
              SampleObj.wv = 0;
              SampleObj.wd = 0;
            }

            
          }
          deferred.resolve(SampleObj);
          
        } catch (err) {
          deferred.reject(new Error('Unable to parse response as JSON' + err));
        }
      });

  }).on('error', function(err) {
    deferred.reject(new Error('Unable to parse response as JSON' + err.message));
  });
  return deferred.promise;
}

function startView() {
  app.use(express.static(__dirname + "/public"));

  app.engine('html', swig.renderFile);

  app.set('view engine', 'html');
  app.set('views', __dirname + '/views');
  app.set('view cache', false);

  swig.setDefaults({ cache: false });

  app.get('/', function(req, res) {
    res.render('index.html');
  });
  app.listen(3000);
  console.info("Listening on port ..." +  3000);
}


buildStationData(stationsData)
.then(function pushToCurrent(stations) {
        fs.writeFileSync(__dirname + '/public/data/current.json', JSON.stringify(current));
})
.then(startView());

var interval = setInterval( function() {
  buildStationData(stationsData)
  .then(function pushToCurrent(stations) {
          fs.writeFileSync(__dirname + '/public/data/current.json', JSON.stringify(current));
  });
}, 1000 * 60);