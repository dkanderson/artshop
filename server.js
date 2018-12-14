require('dotenv').config();  //read env files

const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

//Set public folder as root
app.use(express.static('public'));

app.use('/scripts', express.static(`${__dirname}/node_modules/`));  //combine js files later

app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`));

app.listen(port, () => {
	console.log('listening on %d', port);
});