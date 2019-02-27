var mongoose = require('mongoose');

//mongoose connection
mongoose.connect('mongodb://kris:web4200@ds143953.mlab.com:43953/web4200demon', {useNewUrlParser: true});

const Book = new mongoose.model('Book', {
    title: {
        type: String,
        required: [true, 'Title is required to find book'] },
    author:{
        type: String,
        required: [true, 'Author is required' ] },
    dated: {
        type: Date, },
    rating: {
        type: Number, 
        Min: 1,
        Max: 5 },
    completed: {
        type: Boolean, },
    image: {
        type: String, },
    //user: { type: Schema.Types.ObjectId, ref: 'User' }
    

});


const User = new mongoose.model('User', {
    name: {
        type: String, 
        required: [true, 'Name is required for new user']},
    email: {
        type: String,
        required: [true, 'Email is required for new user'] }
});

module.exports = {
    Book: Book, User: User
};