const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const model = require('./model.js');
const user = require('./users.js');

var app = express();
app.use(bodyParser.urlencoded( {extended: false}));
app.use(cors());


//LIST Action

app.get('/books', (req, res) => {
    if (req.query.completed == "true") {
        model.Book.find({ completed: true }).then(function (books) {
            res.json(books);
        });
    } else if (req.query.completed == "false") {
        model.Book.find({ completed: false }).then(function (books) {
            res.json(books);
        });
    } else {
        model.Book.find().then(function (books) {
            res.json(books);
        });
    }
});

app.get('/users', (req, res) => {
    User.findOne().then(function (users) {
    res.json(users);
    });
});

// RETRIEVE Action

    //books
    app.get('/books/:id', (req, res) => {
        console.log('the id:', req.params.id); 
        
        model.Book.findOne({ _id: req.params.id }).then(function (book) {
            if (book) {
                res.json(book);
            } else {
                res.sendStatus(404); 
                console.log('This ID does not exsist. Try again'); 
            }
        }, function (err) {
        res.sendStatus(400); 
        console.log('The format of the ID is incorrect, Check your ID and try again');
        });
    }); 

    //users
    app.get('/users/:id', (req, res) => {
        console.log('the id:', req.params.id); 
        
        User.findOne({ _id: req.params.id }).then(function (user) {
            if (user) {
                res.json(user);
            } else {
                res.sendStatus(404); 
                console.log('This ID does not exsist. Try again'); 
            }
        }, function (err) {
        res.sendStatus(400); 
        console.log('The format of the ID is incorrect, Check your ID and try again');
        });
    }); 

// DELETE ACTION
app.delete('/books/:id', (req, res) => {
    console.log('the id:', req.params.id);
    
    model.Book.findOne({ _id: req.params.id }).then(function (book) {
        if (book) {
            book.delete().then(function () {
            res.json(book);
            res.sendStatus(200); 
            console.log('ID was deleted')
            });
        } else {
            res.sendStatus(404); 
            console.log('This ID does not exsist. Try again'); 
        }
    }, function (err) {
    res.sendStatus(400); 
    console.log('The format of the ID is incorrect, Check your ID and try again');
    });
});

// CREATE ACTIONS

    //books
app.post('/books', (req, res) => {
    console.log("the body" , req.body);

    if(!req.body.title || !req.body.author || !req.body.dated || !req.body.rating) {
        res.sendStatus(442);
        return;

    }

let book = new model.Book ({
    title: req.body.title,
    author: req.body.author,
    dated: req.body.dated,
    rating: req.body.rating,
});

book.save();
 res.sendStatus(201);
 console.log("Book was created")
});


    //users
app.post('/users', (req, res) => {
    console.log("the user body" , req.body);

    if(!req.body.name || !req.body.email ) {
        res.sendStatus(442);
        return;

    }

let user = new User ({
    name: req.body.name,
    email: req.body.email,
});

USERS.push(user);
 res.sendStatus(201);
 console.log ('user was created');
});





app.listen(8080, () => {
    console.log("Server is listening.");
});