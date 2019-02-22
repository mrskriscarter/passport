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

    return fetch("http://localhost:8080/books", {
        method: "POST",
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        },
        body: data
    });
};

var createUser = function (user) {
    var data = `name=${encodeURIComponent(user.name)}`;
    data += `&email=${encodeURIComponent(user.email)}`;

    return fetch("http://localhost:8080/users", {
        method: "POST",
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        },
        body: data
    });
};

var getBooks = function () {
    return fetch("http://localhost:8080/books");
};

var getUsers = function () {
    return fetch("http://localhost:8080/users");
};

var deleteBook = function (book){
    fetch("http://localhost:8080/books/" + book._id, {
        method: "DELETE"
    });
};    

var deleteUser = function (user){
    fetch("http://localhost:8080/users/" + user._id, {
        method: "DELETE"
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

        newBook: {
            title: "",
            author: "",
            dated: "",
            rating: "",
            completed: false
        },

        name: "",
        email: "",

        logemail: "",
        logpass: "",
        signname: "",
        signemail: "",
        signpass: "",


        bookSearchResults: [],
        books: [],
        users: [],
    },

    methods: {
        addBook: function () { //make sure not to use an arrow here
            createBook(this.newBook). then(response => {
                console.log("Book was created.");
                this.refreshBooks();

            });

            this.newBook = {
                title: "",
                author: "",
                ISBN: "",
                dated: "",
                rating: "",
                completed: false,
            };

            this.isAddBookPage = false;
            this.isCompletedList = true;
            this.isAddBookPage = false;
            
        },

        addUser: function () {
            createUser({
                name: this.name,
                email: this.email,
            }). then(response => {
                this.refreshUsers();
                console.log("User was created");
            });

            this.name = "";
            this.email = "";
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

        mainpage: function () {
            this.isLandingButtons = false;
            this.isMainPageButtons = true;
            this.isLogPage = false;
            this.isLandingPage = false;
            this.isCompletedList = true;
            this.isMainPage = true;
        

        },

        showCompletedList: function () {
            this.isCompletedList = true;
            this.isToReadList = false;
        },

        showToReadList: function () {
            this.isToReadList = true;
            this.isCompletedList = false;
        },

        showAddBook: function () {
            this.isAddBookPage = true;
            this.isCompletedList = false;
            this.isToReadList = false;
            this.isSearchForm = true;

        },


        
        showAddForm: function () {
            this.isAddForm = true;
            this.isSearchResultsPage = false;
            this.isAddBookShow = true;
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
            getGoogleBookInfo(this.newBook.title).then(response => {
                response.json().then(data => {
                    console.log(data);
                    this.bookSearchResults = [];
                    data.items.forEach(book => {
                        console.log(book.volumeInfo.title, book.volumeInfo.authors && book.volumeInfo.authors[0], book.volumeInfo.imageLinks.thumbnail);
                        this.bookSearchResults.push({
                            title: book.volumeInfo.title,
                            author: book.volumeInfo.authors,
                            image: book.volumeInfo.imageLinks.thumbnail
                        });
                        
                    });
                });
            });
        }


    },
    created: function () {
        console.log("Vue is Ready.");
        // this.refreshCompletedBooks();
        // this.refreshToReadBooks();
        // this.refreshUsers();



    }
})