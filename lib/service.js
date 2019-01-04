require('dotenv').config();
var User = require('./user');
var Artwork = require('./artwork');


/* jshint ignore:start */
// Get Artwork request
const getArtwork = async (id) => {

    let error = undefined;

    if (id) {

        const data = await Artwork.findOne({ id: id }, (err, artwork) => {
            if (err) {
                error = err;
            }
        });

        return error ? error : data;

    } else {

        const data = await Artwork.find({}, (err, artwork) => {
            if (err) {
                error = err;
            }
        });

        return error ? error : data;

    }

};

// Get users
const getUsers = async (username) => {

    let error = undefined;

    if (username) {

        const data = await User.findOne({ username: username }, (err, user) => {

            if (err) {
                error = err;
            }

        });

        return error ? error : data;

    } else {

        const data = await User.find({}, (err, user) => {
            if (err) {
                error = err;
            }
        });

        return error ? error : data;

    }

};


const addNewArtwork = async (data) => {

    let error = undefined;

    const response = await Artwork.create(data, (err, artwork) => {
        if ( err ) {
            error = err;
        }
    });

    return error ? error : response;
};

const addNewUser = async (data) => {

    let error = undefined;

    const response = await User.create(data, (err, user) => {
        if (err) {
            error = err;
        }
    });

    return error ? error : response;

};

// change to title
const updateArtwork = async (data, id) => {

    let error = undefined;

    const response = await Artwork.updateOne({id: id}, data, (err, artwork) => {
        if (err) {
            error = err;
        }
    });

    return error ? error : response;
};

// change to title
const deleteArtwork = async (id) => {

    let error = undefined;

    const response = await Artwork.deleteOne({id:id}, (err, artwork) => {
        if (err) {
            console.log(err);
            error = err;
        }
    });

    return error ? error : response;
};

/* jshint ignore:end */

module.exports = {
    getArtwork: id => getArtwork(id),
    getUsers: (username) => getUsers(username),
    addNewArtwork: data => addNewArtwork(data),
    addNewUser: data => addNewUser(data),
    updateArtwork: (data, id) => updateArtwork(data, id),
    deleteArtwork: (id) => deleteArtwork(id),
};