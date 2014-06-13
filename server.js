var express = require('express'); 
var app = express();


app.get('/weather/:id', function(req, res) {
    	var http = require("https");
    	var request = require('request');
    	for(var item in req.query)
    	console.log("Passing query param ==>  "+item+" : "+req.query[item]);
		// Set the headers
		var headers = {
		    'User-Agent':       'Super Agent/0.0.1',
		    'Content-Type':     'application/x-www-form-urlencoded'
		};

		// Configure the request
		var options = {
		    url: 'http://api.wunderground.com/api/0e59bfb8e72fd074/forecast/conditions/q/'+req.query.state+'/'+req.query.city+'.json',
		    method: 'GET',
		    headers: headers,
		};

		// Start the request
		request(options, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
		        // Print out the response body
		        var jsonObject = JSON.parse(body);

		        // Only showing limited fields are this point
                var fields = ["icon","weather","temperature_string","relative_humidity","wind_string","pressure_mb","dewpoint_string","feelslike_string"];
                var html = "";
                html += '<table class="table"><thead><tr>';
                for (var i = 0; i < fields.length; i++)   html+='<th align="center">  '+fields[i]+'   </th>';
                html += "</td></thead><tbody><tr>";
                for (var i = 0; i < fields.length; i++) 
                    html += '<td align = "center"> '+jsonObject.current_observation[fields[i]]+"   </td>  ";
                html += "</tr></tbody></table>";
		        //res.send(html);
		        res.send(jsonObject.current_observation["forecast_url"]);
		    }
		});
	
});


app.listen(3000);
console.log('Listening on port 3000...');
