require('dotenv').config(); //read env files

const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

const { getArtwork, addNewArtwork, updateArtwork, deleteArtwork, getUsers, addNewUser } = require('./lib/service');


const dbUrl = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ds251598.mlab.com:51598/artshop`;

mongoose.Promise = Promise;

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(fileUpload());

//Set public folder as root
app.use(express.static('public'));
app.use('/uploads', express.static(`${__dirname}/public/artwork/`));

app.use('/scripts', express.static(`${__dirname}/node_modules/`)); //combine js files later


const errorHandler = (err, req, res) => {
    if (err.response) {
        res.status(403).send({ title: 'Server responded with an error', message: err.message });
    } else if (err.request) {
        res.status(503).send({ title: 'Unable to communicate with the server', message: err.message });
    } else {
        res.status(500).send({ title: 'An unexpected error occured', message: err.message });
    }
};


app.get('/api/artwork', async (req, res) => {

    try {
        const data = await getArtwork();
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    } catch (error) {
        errorHandler(error, req, res);
    }
});

app.get('/api/artwork/:id', async (req, res) => {

    let id = parseInt(req.params.id, 10);

    try {
        const data = await getArtwork(id);
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    } catch (error) {
        errorHandler(error, req, res);
    }
});

app.post('/api/addnew', async (req, res) => {

    try {

        await addNewArtwork(req.body);
        res.setHeader('Content-Type', 'application/json');
        res.send('Added successfully');

    } catch (error) {

        errorHandler(error, req, res);

    }
});

app.post('/api/upload', (req, res) => {

    if (Object.keys(req.files).length === 0) {

        return res.status(400).send('No files uploaded. ');

    }

    try {

        let artworkFile = req.files.artwork;
        artworkFile.mv(`${__dirname}/public/artwork/${req.files.artwork.name}`, err => {

            if (err) {
                return res.status(500).send({ title: 'An unexpected error occured', message: err.message });
            } else {
                res.send('File was uploaded successfully!');
            }

        });


    } catch (error) {

        errorHandler(error, req, res);
    }
});

app.put('/api/artwork/:id', async (req, res) => {

    let id = parseInt(req.params.id, 10);

    try {

        await updateArtwork(req.body, id);
        res.send('update completed successfully');

    } catch (error) {

        errorHandler(error, req, res);

    }
});

app.delete('/api/artwork/:id', async (req, res) => {

    let id = parseInt(req.params.id, 10);

    try {

        await deleteArtwork(id);
        res.send('delete completed successfully');

    } catch (error) {

        errorHandler(error, req, res);

    }
});

app.get('/api/users', async (req, res) => {

    try {
        const data = await getUsers();
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    } catch (error) {
        errorHandler(error, req, res);
    }
});

app.get('/api/users/:username', async (req, res) => {

    try {
        const data = await getUsers(req.params.username);
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    } catch (error) {
        errorHandler(error, req, res);
    }
});

app.post('/api/users', async (req, res) => {

    try {

        await addNewUser(req.body);
        res.setHeader('Content-Type', 'application/json');
        res.send('Added successfully');

    } catch (error) {

        errorHandler(error, req, res);

    }
});





app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`));

mongoose.connect(dbUrl, { useNewUrlParser: true }, (err) => {
    console.log('mongo db connection', err)
})

app.listen(port, () => {
    console.log('listening on %d', port);
});

const test = async () => {
	const response = await addNewArtwork({
        medium: "acrylic on canvas",
        orientation: "porttrait",
        price: "50000000",
        size: "14\" X 28.5\"",
        status: "completed",
        subject: "sugar",
        title: "Pinks",
        type: "black and white portrait",
        url: "pinks.jpg"
    });
	console.log(response);
}
test();