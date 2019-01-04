const mongoose = require('mongoose');
var ArtworkSchema = new mongoose.Schema({
	title: {
		type: String,
		unique: true,
		trim: true
	},
	status: {
		type: String,
		trim: true
	},
	medium: {
		type: String,
		trim: true
	},
	subject: {
		type: String,
		trim: true
	},
	type: {
		type: String,
		trim: true
	},
	size: {
		type: String,
		trim: true
	},
	orientation: {
		type: String,
		trim: true
	},
	price: {
		type: Number
	},
	url: {
		type: String,
		unique: true,
		trim: true
	}

});

const Artwork = mongoose.model('Artwork', ArtworkSchema);
module.exports = Artwork;