var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


//mongoose connection
mongoose.connect('mongodb://kris:web4200@ds143953.mlab.com:43953/web4200demon', {useNewUrlParser: true});
mongoose.set('useCreateIndex', true);

const bookSchema = new mongoose.Schema({
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
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'}

});
const Book = mongoose.model('Book', bookSchema);



const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, 'Name is required for new user']},
    email: {
        type: String,
        unique: true, 
        required: [true, 'Email is required for new user'] },
    encryptedPassword: {
        type: String,
        required: [true, "You must have a password."]
    }
});

userSchema.methods.setEncryptedPassword = function (plainPassword, callback) {
    // this the user
    bcrypt.hash(plainPassword, 12).then(hash => {
      // this: something else
      // this (with arrow function): the user
      this.encryptedPassword = hash;
      callback();
    });
  };
  
  userSchema.methods.verifyPassword = function (plainPassword, callback) {
      bcrypt.compare(plainPassword, this.encryptedPassword).then(function (valid) {
          if (valid) {
              callback(valid);
          }
      });
  };

const User = mongoose.model('User', userSchema);



module.exports = {
    Book: Book, User: User
};
