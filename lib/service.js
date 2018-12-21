require('dotenv').config();
const axios = require('axios');

const symbols = process.env.SYMBOLS || 'EUR,USD,GBP';

// Axios client declaration
const api = axios.create({
	baseURL: 'http://localhost:3001/',
	timeout: 1000,
});

/* jshint ignore:start */
// Get Artwork request
const getArtwork = async (url) => {

	try{

		const response = await api.get('/artwork');
		return response.data;
	
	} catch (error) {

		console.error(error);
	}
}

// Get users
const getUsers = async (url) => {

	try{

		const response = await api.get('/users');
		return response.data;
	
	} catch (error) {

		console.error(error);
	}
}

const addNewArtwork = async(data) => {
	try {

		const response = await api.post('/artwork', data);
		return response;

	} catch {
		console.error(error);
	}
};
/* jshint ignore:end */

module.exports = {
	getArtwork: () => getArtwork(),
	getUsers: () => getUsers(),
	addNewArtwork: data => addNewArtwork(data),
};