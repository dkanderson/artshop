const mongoose = require('mongoose');
var ArtworkSchema = new mongoose.Schema({
	title: {
		type: String,
		unique: true,
		trim: true,
		required: true
	},
	status: {
		type: String,
		trim: true,
		required: true
	},
	medium: {
		type: String,
		trim: true,
		required: true
	},
	subject: {
		type: String,
		trim: true,
		required: true
	},
	type: {
		type: String,
		trim: true,
		required: true
	},
	size: {
		type: String,
		trim: true,
		required: true
	},
	orientation: {
		type: String,
		trim: true,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	url: {
		type: String,
		unique: true,
		trim: true,
		required: true
	}

});

const Artwork = mongoose.model('Artwork', ArtworkSchema);
module.exports = Artwork;