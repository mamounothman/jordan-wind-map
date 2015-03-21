var fs = require('fs');
var http = require('http');
var express = require('express');
var config = require('nconf');
var swig = require('swig');
var mongoose = require('mongoose');
var stationsData = require("./stations-data");
config.argv().env().file({ file: 'config.json' });

var current = {};
current.date = new Date();
current.samples = [];


function cardinalToDegrees(s) {
  switch (s) {
    case "N":   return 0;
    case "NNE": return 22.5;
    case "NE":  return 45;
    case "ENE": return 67.5;
    case "E":   return 90;
    case "ESE": return 112.5;
    case "SE":  return 135;
    case "SSE": return 157.5;
    case "S":   return 180;
    case "SSW": return 202.5;
    case "SW":  return 225;
    case "WSW": return 247.5;
    case "W":   return 270;
    case "WNW": return 292.5;
    case "NW":  return 315;
    case "NNW": return 337.5;
    case "C":   return 360;  // calm; map to 360 to distinguish from 0 (N) and null (no sample)
    default: return s;
  }
}


var port =  config.get('server').port;
var app = express();

mongoose.connect('mongodb://' + config.get('db').host + '/' + config.get('db').name);
var db = mongoose.connection;

db.db.dropCollection('stations', function(){
  console.log('Dropped stations collection');
});

db.db.dropCollection('samples', function(){
  console.log('Dropped samples collection');
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  var StationSchema = mongoose.Schema(config.get('db').schemas.stations);
  var SamplesSchema = mongoose.Schema(config.get('db').schemas.samples);
  var Station = mongoose.model('Station', StationSchema);
  var Sample = mongoose.model('Sample', SamplesSchema);
  
  var stations = [];
  var samples = [];

  stationsData.forEach(function(stationData, index) {
    var newStation = new Station({
      id: stationData[0], 
      name: stationData[1],
      address: stationData[2],
      latitude: stationData[3],
      longitude: stationData[4]
    });
    stations.push(newStation);
    newStation.save();
  });

  function parseToJson(data) {
    var _fields = {
      date: 0, time: 1, temp: 2, hum: 3, dew: 4, wspeed: 5, wlatest: 6, bearing: 7, rrate: 8, rfall: 9,
      press: 10, currentwdir: 11, beaufortnumber: 12, windunit: 13, tempunitnodeg: 14, pressunit: 15,
      rainunit: 16, windrun: 17, presstrendval: 18, rmonth: 19, ryear: 20, rfallY: 21, intemp: 22,
      inhum: 23, wchill: 24, temptrend: 25, tempTH: 26, TtempTH: 27, tempTL: 28, TtempTL: 29, windTM: 30,
      TwindTM: 31, wgustTM: 32, TwgustTM: 33, pressTH: 34, TpressTH: 35, pressTL: 36, TpressTL: 37,
      version: 38, build: 39, wgust: 40, heatindex: 41, humidex: 42, UV: 43, ET: 44, SolarRad: 45,
      avgbearing: 46, rhour: 47, forecastnumber: 48, isdaylight: 49, SensorContactLost: 50, wdir: 51,
      cloudbasevalue: 52, cloudbaseunit: 53, apptemp: 54, SunshineHours: 55, CurrentSolarMax: 56, IsSunny: 57
    };
    var newData = data.split(" ");
    var fields =_fields;
    for(var field in fields){
      fields[field] = newData[fields[field]];
    }
    return(fields);
  }

  stations.forEach(function(station, index){
    http.get({
      host: 'pro.arabiaweather.com',
      path: '/data/' + station.name + '/realtime.txt?' + (Math.floor(new Date()/1000))
    }, function(res) {
      //if(res.statusCode == 200) {
        res.setEncoding('utf8');
        var body = '';
        res.on('data', function(d) {
            body += d;
        });

        // do whatever we want with the response once it's done
        res.on('end', function() {
          try {
            sampleData = parseToJson(body);
            //console.log(sampleData);

            //samplesData.forEach(function(sampleData) {
            SampleObj = {
              date: new Date(Math.floor(new Date()/1000)), 
              stationId: station.id,
            };
            if(res.statusCode === 200) {
              SampleObj.wv = parseFloat(sampleData.wspeed)/10;
              SampleObj.wd =cardinalToDegrees(sampleData.currentwdir);
            }
            else {
              SampleObj.wv = 1;
              SampleObj.wd = 0;
            }
            
            newSample = new Sample(SampleObj);
            samples.push(newSample);
            newSample.save();
            current.samples.push(SampleObj);
            fs.writeFileSync('./public/data/current.json', JSON.stringify(current));
          } catch (err) {
            console.error('Unable to parse response as JSON', err);
            //return cb(err);
          }
        });
      //}
    }).on('error', function(err) {
      console.error('Error with the request:', err.message);
    });
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