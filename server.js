require('dotenv').config();  //read env files

const express = require('express');
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router(`${__dirname}/db.json`);
const middleware = jsonServer.defaults();
const { getArtwork, getMyUsers } = require('./lib/service');



const app = express();
const port = process.env.PORT || 3000;
const serverPort = process.env.SERVER_PORT || 3001;


//Set public folder as root
app.use(express.static('public'));

app.use('/scripts', express.static(`${__dirname}/node_modules/`));  //combine js files later

const errorHandler = (err, req, res) => {
	if (err.response) {
		res.status(403).send({title: 'Server responded with an error', message: err.message});
	} else if (err.request) {
		res.status(503).send({title: 'Unable to communicate with the server', message: err.message});
	}else{
		res.status(500).send({title: 'An unexpected error occured', message: err.message});
	}
};

app.get('/api/artwork', async (req, res) => {
	try {
		const data = await getArtwork();
		res.setHeader('Content-Type', 'application/json');
		res.send(data.data);
	}catch (error) {
		errorHandler(error, req, res);
	}
});

app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`));

app.listen(port, () => {
	console.log('listening on %d', port);
});

server.use(router);
server.use(middleware);

server.listen(serverPort, () => {
	console.log('json server running on %d', serverPort);
});


const test = async() => {
	const data = await getArtwork();
	console.log(data);
}

test();