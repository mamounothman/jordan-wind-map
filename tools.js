exports.cardinalToDegrees =  function (s) {
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


exports.parseToJson = function(data) {
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