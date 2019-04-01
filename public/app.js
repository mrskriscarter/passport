//var ROOT_URL = "https://bookclubweb.herokuapp.com";
var ROOT_URL ="http://localhost:8080";
var getGoogleBookInfo = function (bookName) {
    // https://www.googleapis.com/books/v1/volumes?q=intitle:fire&key=AIzaSyDAC0_WOd94tVrnHii1zNP7VCDBdUBhrzc
    return fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${bookName}&key=AIzaSyDAC0_WOd94tVrnHii1zNP7VCDBdUBhrzc`);
}


var createBook = function (book) {
    var data = `title=${encodeURIComponent(book.title)}`;
    data += `&author=${encodeURIComponent(book.author)}`;
    data += `&dated=${encodeURIComponent(book.dated)}`;
    data += `&rating=${encodeURIComponent(book.rating)}`;
    data += `&completed=${encodeURIComponent(book.completed)}`;
    data += `&image=${encodeURIComponent(book.image)}`;

    return fetch(`${ROOT_URL}/books`, {
        method: "POST",
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        },
        credentials: 'include',
        body: data
    });
};

var createUser = function (user) {
    var data = `name=${encodeURIComponent(user.name)}`;
    data += `&email=${encodeURIComponent(user.email)}`;
    data += `&plainPassword=${encodeURIComponent(user.plainPassword)}`;

    return fetch(`${ROOT_URL}/users`, {
        method: "POST",
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        },
        credentials: 'include',
        body: data
    });
};



var getBooks = function () {
    return fetch(`${ROOT_URL}/books`, {
        credentials: 'include'
    });
};

var getCompletedBooks = function () {
    return fetch(`${ROOT_URL}/books?completed=true`, {
        credentials: 'include'
    });
};

var getToReadBooks = function () {
    return fetch(`${ROOT_URL}/books?completed=false`, {
        credentials: 'include'
    });
};

var getTopBooks = function () {
    return fetch(`${ROOT_URL}/books?rating=3`, {
        credentials: 'include'
    });
}

var getUsers = function () {
    return fetch(`${ROOT_URL}/users`, {
        credentials: 'include'
    });
};

var deleteBook = function (book){
    return fetch(`${ROOT_URL}/books/` + book._id, {
        method: "DELETE",
        credentials: 'include'
    });
};    

var deleteUser = function (user){
    return fetch(`${ROOT_URL}/users/` + user._id, {
        method: "DELETE",
        credentials: 'include',
    });
};   


// App

var app = new Vue({
    el: '#app',
    data: {
        isHidden: false,
        isLogPage: false,
        isSignPage: false,
        isCompletedList: false,
        isToReadList: false,
        isLandingButtons: true,
        isLandingPage: true,
        isMainPageButtons: false,
        isCompletedChecked: false,
        isAddBookPage: false,
        isSearchResults: false,
        isMainPage: false,
        isAddBookShow: false,
        isAddForm: false,
        isSearchForm: false,
        isSearchResultsPage: false,
        isTopBooks: false,

        newBook: {
            title: "",
            author: "",
            dated: "",
            rating: "",
            completed: false,
            image: "",
        },

        name: "",
        email: "",
        plainPassword: "",

        logemail: "",
        logpassword: "",
        signname: "",
        signemail: "",
        signpass: "",


        completedBooks: getCompletedBooks(),
        toreadBooks: getToReadBooks (),
        topBooks: getTopBooks (),


        bookSearchResults: [],
        books: [],
        users: [],
        errors : [],
       
    },

    methods: {
        validateBook: function () {
            this.errors = [];
            if (this.newBook.title.length == 0 ) {
                this.errors.push("You must Enter a title of a book.")
                //fail
            }
            if (this.newBook.author.length == 0){
                this.errors.push("You have to have a Author selected")
                //fail 
            }
            
        },


        formatDate: function(dated) {
            return moment(dated).format("MMM Do YYYY");
        },

        addBook: function () { 
            this.validateBook();
            if (this.errors.length > 0) {
                console.log(this.errors);
                return;
            }
            //this.validateUser ();
            //if (this.errors.length == 0) {
             //   return;
            //}

            createBook(this.newBook). then(response => {
                console.log("Book was created.");
                this.isTopBooks = true;
                this.refreshBooks();
                

            });

            this.newBook = {
                title: "",
                author: "",
                dated: "",
                rating: "",
                completed: false,
                image: "",
            };

            this.isAddBookPage = false;
            this.isAddForm = false;
            this.ismainpage = true;
            
        },

        validateUser: function () {
            this.errors = [];
            if (this.name.length == 0 ) {
                this.errors.push("Name is required")
            }
            if (this.email.length == 0){
                this.errors.push("Email is required")
            }

            return this.errors.length > 0;
        },

        addUser: function () {
            createUser({
                name: this.name,
                email: this.email,
                plainPassword: this.plainPassword
            }). then(response => {
                if (response.status == 422) {
                    // validation errors
                    response.json().then(function (errors){
                        console.log(errors);
                    });
                } else if (response.status == 201){
                    // succesfully created
                    this.refreshUsers();
                    console.log("User was created");
                } else {
                        alert ("Bad things happened")
                    }
                
            });
            
            this.name = "";
            this.email = "";
            this.isMainPageButtons = true;
            this.isLogPage = false;
            this.isLandingPage = false;
            this.isMainPage = true;
            this.isCompletedList = false;
            this.isToReadList = false;
            this.isTopBooks = true;
        },


        showCompletedList: function () {
            this.isToReadList = false;
            this.isCompletedList = true;
            this.isSearchResults = false;
            this.isSearchForm = false;
            this.isSearchResultsPage = false;
            getCompletedBooks()
                .then(result => result.json())
                .then(json => {
                this.completedBooks = json
                console.log(this.completedBooks);
            });
        },

        showToReadList: function () {
            this.isToReadList = true;
            this.isCompletedList = false;
            this.isSearchResults = false;
            this.isSearchForm = false;
            this.isTopBooks = false;
            getToReadBooks()
                .then(result => result.json())
                .then(json => {
                this.toreadBooks = json
                console.log(this.toreadBooks);
            });
        },
        login: function() {
            this.errors = [];
            var data = `email=${encodeURIComponent(this.logemail)}`;
            data += `&plainPassword=${encodeURIComponent(this.logpassword)}`;

            if(this.logemail.length == 0 ) {
                this.errors.push("Email is required");
            }
            if(this.logpassword.length == 0) {
                this.errors.push("Password is required");
            }

            if(this.errors > 0) {
                return;
            }

            fetch(`${ROOT_URL}/session`, {
                method: "POST",
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                },
                credentials: 'include',
                body: data
            }).then((value) => {
                debugger;
                if (value.status === 201) {
                    this.showTopBookList();
                } else {
                    //this.errors.push("Bad username/password. Try again.")
                    console.log("You done screwed up homes.");
                }
            }).catch((ex) => {
                debugger;
            });
        }, 
        showTopBookList: function () {
           this.isTopBooks = true;
           this.isSearchForm = false;
           this.isMainPageButtons = true;
           this.isLogPage = false;
           this.isLandingPage = false;
           this.isMainPage = true;
           this.isCompletedList = false;
           this.isToReadList = false;
            getTopBooks()
                .then(result => result.json())
                .then(json => {
                this.topBooks = json
                console.log(this.topBooks);
            });
        },



        deletebook: function (book) { 
            deleteBook(book).then(response => {
                this.refreshBooks();
                console.log("book was deleted");
              });
              this.refreshBooks();
          },



        loginbutton: function () {
            this.isLogPage = true;
            this.isLandingButtons = false;

        },


        signupbutton: function () {
            this.isSignPage = true;
            this.isLandingButtons = false;
        },

        showmore: function () {
            this.iscompletedchecked = true;
        },


        showAddBook: function () {
            this.isAddBookPage = true;
            this.isCompletedList = false;
            this.isToReadList = false;
            this.isSearchForm = true;
            this.isTopBooks = false;

        },


        
        showAddForm: function () {
            this.isAddForm = true;
            this.isSearchResultsPage = false;
            this.isAddBookShow = true;
            this.isToReadList = false;
            this.isCompletedList = false;
            this.isTopBooks = false;
        },

        refreshUsers: function() {
            getUsers().then(response => {
                response.json().then(data => {
                    this.users = data;
                });
            });
        },

        refreshBooks: function() {
            getBooks().then(response => {
                response.json().then(data => {
                    this.books = data;
                });
            });
            getToReadBooks()
                .then(result => result.json())
                .then(json => {
                this.toreadBooks = json
                console.log(this.toreadBooks);
            });
        },


        selectSearchResult: function (result) {
            this.newBook.title = result.title;
            this.newBook.author = result.author;
            this.newBook.image = result.image;
            
        },

    

        searchBooks: function () {
            this.isSearchResultsPage = true;
            this.isAddForm = false;
            this.isSearchForm = false;
            this.isAddBookPage = false;
            getGoogleBookInfo(this.newBook.title).then(response => {
                response.json().then(data => {
                    console.log(data);
                    this.bookSearchResults = [];
                    data.items.forEach(book => {
                        console.log(book.volumeInfo.title, book.volumeInfo.authors && book.volumeInfo.authors[0], book.volumeInfo.imageLinks.thumbnail);
                        this.bookSearchResults.push({
                            title: book.volumeInfo.title,
                            author: book.volumeInfo.authors[0],
                            image: book.volumeInfo.imageLinks.thumbnail
                        });
                        
                    });
                });
            });
        }


    },
    created: function () {
        console.log("Vue is Ready.");
         this.refreshBooks();
         this.refreshUsers();



    }
})