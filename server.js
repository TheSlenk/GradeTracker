const PORT = 3000;
const express = require('express');
const app = express();
const mongo = require('mongodb');
const session = require('express-session');
const mongoClient = mongo.MongoClient;
let db;
let accounts;

class course {
    categories;

};

// USE
app.use(session({
    secret: "audbaiupwdbauidbawiudbddsjmbdnfyfeshbjshfbla",
    saveUninitialized:true,
    cookie: { username: undefined,
              email: undefined},
    resave: false
}));

app.use(express.static('style'));
app.use(express.static('scripts'));


// EXPRESS CONFIG
app.set('views', 'view');
app.set('view engine', 'pug');



// GET
app.get('/', (req,res, next) => {
    res.redirect('/home');
});

app.get('/home', (req, res) => {
    res.status(200).render('home');
});

app.get('/reg', (req, res, next) => {
    res.status(200).render('signup');
});

app.get('/course/:id', (req, res) => {
    const id = req.params.id;
    res.status(200).render('course', {"data": JSON.stringify({"categories": [{'name': 'meow', 'grade': 100, 'weight': 5}, {'name': 'dog', 'grade': 54, 'weight': 65}]})});
    return;
    accounts.find({'id': id}).toArray((err, result) => {
        if(err) throw err;
        
        if(result.length == 0)
            res.status(404).send('Course Not Found!');
        else
            res.status(200).render('course', {"data": result[0]});
    });
});



mongoClient.connect('mongodb://127.0.0.1:27017', {useNewUrlParser: true}, (err, client) => {
    if(err) throw err;
    
    db = client.db('GradeTracker');
    accounts = db.collection('accounts');
    console.log('Connected to Database!');

    app.listen(PORT);
    console.log(`Connected to localhost:${PORT}...`);
});