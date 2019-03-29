const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const model = require('./model.js');
const passport = require('passport');
const passportLocal = require('passport-local');
const session = require('express-session');

var app = express();
app.set('port', (process.env.PORT || 8080));

app.use(express.static('public'));
app.use(bodyParser.urlencoded( { extended: false }));
app.use(cors({ credentials: true, origin: 'null, bookclubweb.herokuapp.com' })); 
app.use(session({ secret: 'keyboard fish', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

////////
/////PASSPORT
////////

passport.use(new passportLocal.Strategy({
    usernameField: 'email',
    passwordField: 'plainPassword'
  }, function (email, plainPassword, done) {
  
    model.User.findOne({ email: email }).then(function (user) {
      if (!user) {
        // failed authentication, report back
        return done(null, false);
      }
      user.verifyPassword(plainPassword, function (valid) {
        if (valid) {
          // successful authentication, report back
          return done(null, user);
        } else {
          // failed authentication, report back
          return done(null, false);
        }
      });
    }, function (err) {
      // something bad happened while finding the user
      return done(err);
    });
  }));
  
  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });
  
  passport.deserializeUser(function (id, done) {
    model.User.findOne({ _id: id }).then(function (user) {
      done(null, user);
    }, function (err) {
      done(err);
    });
  });
  
  
  // authenticate action
  app.post('/session', passport.authenticate('local'), function (req, res) {
    // on successful authentication: 
    res.sendStatus(201);
  });
  
  
  // me action
  app.get('/session', function (req, res) {
    if (req.user) {
      res.sendStatus(200);
      //user is logged in

    } else {
        //user not logged in
      res.sendStatus(401);
    }
  });
  

///////
///// USERS /////////
///////

// List  User
app.get('/users/', (req, res) => {
    model.User.find().then(function (user) {
    res.json(user);
    });
});

// Retrieve User
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

app.post('/users/', (req, res) => {
    console.log("the user body" , req.body);

    let user = new model.User ({
        name: req.body.name,
        email: req.body.email,
        plainPassword: req.body.plainPassword

    });

    user.setEncryptedPassword(req.body.plainPassword, function () {

 //make sure it links to client
// when the encrypted password is eventually set, then:

//Create User 
    user.save().then(function () {
        res.sendStatus(201);
        console.log("User was created"); 
        }, function (err) {
            if (err.errors) {
                var messages = {};
                for (var e in err.errors) {
                    messages[e] = err.errors[e].messages;
                }
                console.log("error saving user", messages);
                res.status(422).json(messages);
            } else if (err.code == 11000 ){
                res.status(422).json({
                    email: "Someone has already registered with that email. Consider signing in instead"
                });

             } else {
                console.log("unexpected error saving user", err);
                res.sendStatus(500);
            }

        }); 
    });       
    });




///////
///// BOOKS /////////
///////

//List Book


app.get('/books/', (req, res) => {
    if (!req.user) {
        res.sendStatus(401);
        return;
    }
    
    if (req.query.completed == "true") {
        model.Book.find({ user: req.user._id, completed: true }).populate('user').then(function (books) {
            res.json(books);
        });
    } else if (req.query.completed == "false") {
        model.Book.find({ user: req.user._id, completed: false }).then(function (books) {
            res.json(books);
        });
    } else if (req.query.rating) {
        model.Book.find({ user: req.user._id, rating: req.query.rating }).then(function (books){
            res.json(books);
        });
    } else {
        model.Book.find({user: req.user._id}).then(function (books) {
            res.json(books);
        });
    }
});

///Retrieve Book

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

   

// DELETE Book
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

// CREATE Book

app.post('/books/', (req, res) => {
    if (!req.user) {
        res.sendStatus(401);
        return;
    }
    //Boring but it would work. 

    let book = new model.Book ({
        title: req.body.title,
        author: req.body.author,
        dated: req.body.dated,
        rating: req.body.rating,
        completed: req.body.completed,
        image: req.body.image,
        user: req.user._id
    });



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



app.listen(8080, () => {
    console.log("Server is listening.");
});