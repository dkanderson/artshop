require('dotenv').config();
const axios = require('axios');

const symbols = process.env.SYMBOLS || 'EUR,USD,GBP';

// Axios client declaration
const api = axios.create({
	baseURL: 'http://localhost:3001/',
	timeout: 1000,
});

// Get request
const getArtwork = async (url) => {

	try{

		return await api.get('/artwork')
	
	} catch (error) {

		console.error(error);
	}
}

module.exports = {
	getArtwork: () => getArtwork(),
	getMyUsers: () => getUsers(),
}