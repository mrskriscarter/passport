const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');

var app = express();
app.use(bodyParser.urlencoded( {extended: false}));
app.use(cors());

let BOOKS = [];

//LIST Action

app.get('/books', (req, res) => {
    if (req.query.completed == "true") {
        Book.find({ completed: true }).then(function (books) {
            res.json(BOOKS);
        });
    } else if (req.query.completed == "false") {
        Book.find({ completed: false }).then(function (books) {
            res.json(BOOKS);
        });
    } else {
        Book.find().then(function (books) {
            res.json(BOOKS);
        });
    }
});

// RETRIEVE Action

    app.get('/books/:id', (req, res) => {
        console.log('the id:', req.params.id); 
        
        Book.findOne({ _id: req.params.id }).then(function (book) {
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

// DELETE ACTION
app.delete('/books/:id', (req, res) => {
    console.log('the id:', req.params.id);
    
    Book.findOne({ _id: req.params.id }).then(function (book) {
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

// CREATE ACTION
app.post('/books', (req, res) => {
    console.log("the body" , req.body);

    if(!req.body.title || !req.body.fname || !req.body.lname || !req.body.ISBN) {
        res.sendStatus(442);
        return;

    }

let book = {
    title: req.body.title,
    fname: req.body.fname,
    lname: req.body.lname,
    ISBN: req.body.ISBN,
};

BOOKS.push(book);
 res.sendStatus(201);
});





app.listen(8080, () => {
    console.log("Server is listening.");
});