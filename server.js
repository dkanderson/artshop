require('dotenv').config(); //read env files

const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const fs = require('fs');
// const MongoStore = require('connect-mongo')(session);

var User = require('./lib/user');

const { getArtwork, addNewArtwork, updateArtwork, deleteArtwork, getUsers, addNewUser } = require('./lib/service');

const dbUrl = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ds251598.mlab.com:51598/artshop`;

mongoose.Promise = Promise;

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(fileUpload());


//Set public folder as root
app.use(express.static('public'));

// Set static routes
app.use('/uploads', express.static(`${__dirname}/public/artwork/`));
app.use('/scripts', express.static(`${__dirname}/node_modules/`)); //combine js files later

// Handle errors
const errorHandler = (err, req, res) => {
    if (err.response) {
        res.status(403).send({ title: 'Server responded with an error', message: err.message });
    } else if (err.request) {
        res.status(503).send({ title: 'Unable to communicate with the server', message: err.message });
    } else {
        res.status(500).send({ title: 'An unexpected error occured', message: err.message });
    }
};


// Use sessions
app.use(session({
    secret: 'davinci',
    resave: true,
    saveUninitialized: false
    // store: new MongoStore({
    //     mongooseConnection: mongoose.connection
    // })
}));


//---------------------------------------------------------------------------------------

//  Routes

//---------------------------------------------------------------------------------------


// Get Artwork
app.get('/api/artwork', async (req, res) => {

    console.log(req.session);

    try {
        const data = await getArtwork();

        if (data) {
            res.setHeader('Content-Type', 'application/json');
            res.send(data);
        } else {
            res.status(500).send({ title: 'An unexpected error occured', message: "No records found" });
        }

    } catch (error) {
        errorHandler(error, req, res);
    }
});

// Get Artwork by Title
app.get('/api/artwork/:title', async (req, res) => {

    try {

        const data = await getArtwork(req.params.title);

        if (data.hasOwnProperty("type")) {

            throw data;

        } else {

            res.setHeader('Content-Type', 'application/json');
            res.send(data);
        }

    } catch (error) {
        errorHandler(error, req, res);
    }
});

// Add new artwork
app.post('/api/addnew', async (req, res) => {

    try {

        const response = await addNewArtwork(req.body);

        if (response.hasOwnProperty("type")) {
            throw response;
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.send('Added successfully');
        }

    } catch (error) {

        errorHandler(error, req, res);

    }
});

// Upload artwork image
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

// Update Artwork
app.put('/api/artwork/:title', async (req, res) => {

    try {

        const response = await updateArtwork(req.body, req.params.title);

        if (response.hasOwnProperty("type")) {
            throw response;
        } else {
            res.send('update completed successfully');
        }

    } catch (error) {

        errorHandler(error, req, res);

    }
});

// Delete artwork
app.delete('/api/artwork/:title', async (req, res) => {

    try {

        const artwork = await getArtwork(req.params.title);

        if (artwork.url) {
            fs.unlink(`${__dirname}/public/artwork/${artwork.url}`, (err) => {
                if (err) {
                    throw err;
                }
            });
        }

        const response = await deleteArtwork(req.params.title);

        if (response.hasOwnProperty("type")) {
            throw response;
        } else {

            res.send('delete completed successfully');
        }

    } catch (error) {

        errorHandler(error, req, res);

    }
});

// Get Users
app.get('/api/users', async (req, res) => {

    try {
        const data = await getUsers();
        if (data) {
            res.setHeader('Content-Type', 'application/json');
            res.send(data);
        } else if (data.hasOwnProperty("type")) {
            throw data;
        } else {
            res.status(500).send({ title: 'An unexpected error occured', message: `No Records Found` });
        }

    } catch (error) {
        errorHandler(error, req, res);
    }
});

// Get user by username
app.get('/api/users/:username', async (req, res) => {

    try {
        const data = await getUsers(req.params.username);

        res.setHeader('Content-Type', 'application/json');
        res.send(data);

    } catch (error) {
        errorHandler(error, req, res);
    }
});

// Add new user
app.post('/api/users', async (req, res) => {

    try {

        const response = await addNewUser(req.body);

        if (response.hasOwnProperty("type")) {
            throw response;
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.send('Added successfully');
        }


    } catch (error) {

        errorHandler(error, req, res);

    }
});

// Handle login
app.post('/api/login', async (req, res, next) => {

    User.authenticate(req.body.username, req.body.password, (error, user) => {
        if ( error || !user ) {
            let err = new Error('User login failed');
            err.status = 401;
            return next(err);
        } else {
            req.session.userId = user._id;
            res.send(user.username);
        }
    })
});

app.post('/api/logout', (req, res, next) => {
    if ( req.session ) {

        req.session.destroy((err) => {
            if( err ) {
                console.log(err);
                return next(err);
            } else {
                res.send('logged out successfully');
            }
        });
    }
});

//Custom middleware
function requiresLogin(req, res, next){
    if ( req.session && req.session.userId ) {
        return next();
    } else {
        let err = new Error("You must be logged in to view this page");
        err.staus = 401;
        return next(err);
    }
}


// Set main html file
app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`));

// Connect to mongoDB
mongoose.connect(dbUrl, { useNewUrlParser: true }, (err) => {
    console.log('mongo db connection', err)
});


// Start server
app.listen(port, () => {
    console.log('listening on %d', port);
});