const PORT = 3000;
const express = require('express');
const app = express();
const mongo = require('mongodb');
const session = require('express-session');
const mongoClient = mongo.MongoClient;
let db;

// USE
app.use(session({
    secret: "audbaiupwdbauidbawiudbddsjmbdnfyfeshbjshfbla",
    saveUninitialized:true,
    cookie: { username: undefined,
              email: undefined},
    resave: false
}));


// EXPRESS CONFIG
app.set('views', 'view');
app.set('view engine', 'pug');



// GET
app.get('/', (req,res, next) => {
    res.redirect('/home');
});

app.get('/reg', (req, res, next) => {
    res.status(200).render('signup');
});


// SENDING FILES
app.get('/login.css', (req,res,next) => {
    res.sendFile('style/login.css', {root: __dirname});
});

app.get('/signup.js', (req,res,next) => {
    res.sendFile('scripts/signup.js', {root: __dirname});
});




mongoClient.connect('mongodb://127.0.0.1:27017', {useNewUrlParser: true}, (err, client) => {
    if(err) throw err;
    
    db = client.db('GradeTracker');
    console.log('Connected to Database!');

    app.listen(PORT);
    console.log(`Connected to localhost:${PORT}...`);
});