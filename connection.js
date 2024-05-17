const mongoose = require('mongoose');

async function connectMongoDB(url){
    return mongoose.connect(url)
        .then(() => console.log('MongoDB Connected Successfully.'))
        .catch((err) => console.log('Error while connecting to DB ', err));
}

module.exports = {
    connectMongoDB
}