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
  data = data[0];
  key = Object.keys(data)[0];
  var _fields = {
    temp: 1, humidity: 1, windspeed: 1, winddir: 1, windchill: 1, windgust: 1, rainin: 1, dailyrain: 1, 
    monthlyrain: 1, yearlyrain: 1, dewpt: 1, UV: 1, light: 1, baromin: 1,
    last_updated: 1, windspeedins: 1, windgustins: 1, winddirins: 1, connected: 1
  };

  var fields =_fields;
  for(var field in fields){
    fields[field] = data[key][field];
  }
  return(fields);
}