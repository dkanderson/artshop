require('dotenv').config();
const axios = require('axios');

// Axios client declaration
const api = axios.create({
    baseURL: 'http://localhost:3001/',
    timeout: 1000,
});

/* jshint ignore:start */
// Get Artwork request
const getArtwork = async (id) => {

    try {

        const response = await api.get('/artwork');

        if (id) {

            return response.data[id - 1];

        } else {

            return response.data;

        }


    } catch (error) {

        console.error(error);
    }
}

// Get users
const getUsers = async (username) => {

    try {

        const response = await api.get('/users');

        if (username) {

            let res = undefined;

            response.data.forEach((user) => {
                if (user.username === username) {
                    res = user;
                }
            });

            return res;

        } else {

            return response.data;

        }

    } catch (error) {

        console.error(error);
    }
}

const addNewArtwork = async (data) => {
    try {

        const response = await api.post('/artwork', data);
        return response;

    } catch (error) {

        console.error(error);

    }
};

const addNewUser = async (data) => {
    try {

        const response = await api.post('/users', data);
        return response;

    } catch (error) {

        console.error(error);

    }
};

const updateArtwork = async (data, id) => {

    try {

        const response = await api.put(`/artwork/${id}`, data);
        return response;

    } catch (error) {

        console.error(error);

    }
}

const deleteArtwork = async (id) => {

    try {

        const response = await api.delete(`/artwork/${id}`);
        return response;

    } catch (error) {

        console.error(error);

    }
}
/* jshint ignore:end */

module.exports = {
    getArtwork: id => getArtwork(id),
    getUsers: (username) => getUsers(username),
    addNewArtwork: data => addNewArtwork(data),
    addNewUser: data => addNewUser(data),
    updateArtwork: (data, id) => updateArtwork(data, id),
    deleteArtwork: (id) => deleteArtwork(id),
};