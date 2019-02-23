var mongoose = require('mongoose');

//mongoose connection
mongoose.connect('mongodb://kris:web4200@ds143953.mlab.com:43953/web4200demon', {useNewUrlParser: true});

const Book = new mongoose.model('Book', {
    title: String,
    author: String,
    dated: Date,
    rating: Number,
    completed: Boolean,
    image: String,
    

});

module.exports = {
    Book: Book
};