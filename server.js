var express = require('express'); 
var app = express();
var fs = require('fs');

app.use('/public', express.static(__dirname + '/public'));

app.all('*', function(req, res, next){
	fs.readFile('locations.json', function(err, data){
		res.locals.locations = JSON.parse(data);
		next();
	});
});

app.get('/weather', function(req, res){
	res.render('index.ejs', res.locals.locations);
});


app.get('/api/locations', function(req, res){
  res.json(res.locals.locations);
});


app.get('/weather/:city', function(req, res, next){

	var http = require("https");
	var request = require('request');
	for(var item in req.query)
	console.log("Passing query parameter %s : %s", item , req.query[item]);
	
	// Configure the request
	var options = {
	    url: 'http://api.wunderground.com/api/0e59bfb8e72fd074/forecast/conditions/q/'+req.query.state+'/'+req.query.city+'.json',
		method: 'GET'
	};

	// Start the request
	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			// Print out the response body
			var jsonObject = JSON.parse(body);
			// Only showing limited fields are this point
			var fields = ["icon","weather","temperature_string","relative_humidity","wind_string","pressure_mb","dewpoint_string","feelslike_string"];
			res.locals.locations.forEach(function(location){
				if (req.query.city === location.city){
				  res.render('location.ejs', { location: location, jsonObject : jsonObject, fields : fields });
				}
			})
		}
	});
  
});

app.listen(3000);
console.log('Listening on port 3000...');
