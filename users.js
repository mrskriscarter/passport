var mongoose = require('mongoose');

//mongoose connection
mongoose.connect('mongodb://kris:web4200@ds143953.mlab.com:43953/web4200demon', {useNewUrlParser: true});

const User = new mongoose.model('User', {
    name: String,
    email: String,
});

module.exports = {
    User: User };