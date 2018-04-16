var googleMapsClient = require('@google/maps').createClient({
	key: 'AIzaSyAy4grLuONSG-gN4UuAAi-5lWZPXWO5nbM'
});

module.exports.getGeoData = function(req, res) {
	let address = req.body['address'];
	googleMapsClient.geocode({
		address: address
	}, function(err, response) {
		if (!err) {
			res.send({
				data: response.json.results,
				msg: 'Geo data found'
			});
		}
	});
};