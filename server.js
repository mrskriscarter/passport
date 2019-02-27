const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const model = require('./model.js');

var app = express();
app.use(bodyParser.urlencoded( {extended: false}));
app.use(cors());


//LIST Action

app.get('/books/', (req, res) => {
    if (req.query.completed == "true") {
        model.Book.find({ completed: true }).populate('user').then(function (books) {
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

app.get('/users/', (req, res) => {
    model.User.find().then(function (user) {
    res.json(user);
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
        
        model.User.findOne({ _id: req.params.id }).then(function (user) {
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
    
    model.Book.findOne({_id: req.params.id }).then(function (book) {
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
app.post('/books/', (req, res) => {
    console.log("the body" , req.body);

    let book = new model.Book ({
        title: req.body.title,
        author: req.body.author,
        dated: req.body.dated,
        rating: req.body.rating,
        completed: req.body.completed,
        image: req.body.image
    });

    // hack to set a random user (for now)
    if (Math.random() > 0.5) {
        model.User.findOne().then(function (user) {
            book.user = user;
        });
    } else {
        model.User.findOne().skip(1).then(function (user) {
            book.user = user;
        });
    }

    book.save().then(function () {
        res.sendStatus(201);
        console.log("Book was created"); 
    }, function (err) {
        if (err.errors) {
            var message = {};
            for (var e in err.errors) {
                messages[e] = err.errors[e].message;
            }
            console.log("error saving book", message);
            res.status(422).json(message);
        } else {
            console.log("unexpected error saving book", err);
            res.sendStatus(500);
        }
    });        
});


    //users
app.post('/users/', (req, res) => {
    console.log("the user body" , req.body);

let user = new model.User ({
    name: req.body.name,
    email: req.body.email,
});

user.save().then(function () {
    res.sendStatus(201);
    console.log("User was created"); 
    }, function (err) {
        if (err.errors) {
            var message = {};
            for (var e in err.errors) {
                messages[e] = err.errors[e].message;
            }
            console.log("error saving user", message);
            res.status(422).json(message);
        } else {
            console.log("unexpected error saving user", err);
            res.sendStatus(500);
        }

    });        
});






app.listen(8080, () => {
    console.log("Server is listening.");
});