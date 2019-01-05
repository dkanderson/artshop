require('dotenv').config();
var User = require('./user');
var Artwork = require('./artwork');


/* jshint ignore:start */
// Get Artwork request
const getArtwork = async (title) => {

    let error = undefined;

    if (title) {

        const data = await Artwork.findOne({ title: title }, (err) => {

            if (err) {
                error = err;
                error.type = "error";
            }
        });

        return error ? error : data;

    } else {

        const data = await Artwork.find({}, (err) => {
            if (err) {
                error = err;
                error.type = "error";
            }
        });

        return error ? error : data;

    }

};

// Get users
const getUsers = async (username) => {

    let error = undefined;

    if (username) {

        const data = await User.findOne({ username: username }, (err) => {

            if (err) {
                error = err;
                error.type = "error";
            }

        });

        return error ? error : data;

    } else {

        const data = await User.find({}, (err) => {
            if (err) {
                error = err;
                error.type = "error";
            }
        });

        return error ? error : data;

    }

};


const addNewArtwork = async (data) => {

    let error = undefined;


    const response = await Artwork.create(data, function(err, user) {

        if (err) {

            error = err;
            error.type = "error";

        }

        return user;

    });

    return error ? error : response;


};

const addNewUser = async (data) => {

    let error = undefined;

    const response = await User.create(data, (err) => {

        if (err) {
            error = err;
            error.type = "error";
        }

    });

    return error ? error : response;

};

// change to title
const updateArtwork = async (data, title) => {

    let error = undefined;

    const response = await Artwork.updateOne({ title: title }, data, (err) => {

        if (err) {
            error = err;
            error.type = "error";
        }

    });

    return error ? error : response;
};

// change to title
const deleteArtwork = async (title) => {

    let error = undefined;

    const response = await Artwork.deleteOne({ title: title }, (err) => {
        if (err) {
            error = err;
            error.type = "error";
        }
    });

    return error ? error : response;
};

/* jshint ignore:end */

module.exports = {
    getArtwork: title => getArtwork(title),
    getUsers: (username) => getUsers(username),
    addNewArtwork: data => addNewArtwork(data),
    addNewUser: data => addNewUser(data),
    updateArtwork: (data, title) => updateArtwork(data, title),
    deleteArtwork: (title) => deleteArtwork(title),
};