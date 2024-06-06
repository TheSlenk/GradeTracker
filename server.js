const PORT = 3000;
const express = require('express');
const app = express();
const mongo = require('mongodb');
const session = require('express-session');
const mongoClient = mongo.MongoClient;
let db;
let accounts;

// USE
app.use(session({
    secret: "audbaiupwdbauidbawiudbddsjmbdnfyfeshbjshfbla",
    saveUninitialized:true,
    cookie: { username: undefined,
              email: undefined,
              loggedin: false
            },
    resave: false
}));

// Setting paths for static files such as style, scripts and etc
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
    if(req.session.loggedin) {
        res.redirect('/home');
        return;
    }
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


// PUT

app.put('/login', async (req,res,next) => {
    if(req.session.loggedin) {
        res.redirect('/home');
        return;
    }
    const email = req.query.email;
    const password = req.query.password;
    db.collection('accounts').find({username: email, password: password}).toArray((err, result) => {
        if(err) throw err;
        if(result.length > 0) {
            req.session.username = result[0].username;
            req.session.email = result[0].email; 
            req.session.loggedin = true;
            res.status(200).send('Logged in via Username!');
        } else {
            db.collection('accounts').find({email: email, password: password}).toArray((err, result) => {
                if(err) throw err;
                if(result.length > 0) {
                    req.session.username = result[0].username;
                    req.session.email = result[0].email; 
                    req.session.loggedin = true;
                    res.status(200).send('Logged in via Email!');
                } else {
                    res.status(400).send('Account Not Found!');
                }
            });
        }
    });
});

app.put('/updatecourse', (req, res) => {
    req.on('data', (data) => {
        
    });
});

//POST 

app.post('/signup', (req, res, next) => {
    if(req.session.loggedin) {
        res.redirect('/home');
        return;
    }
    req.on('data', (data) => {
        data = JSON.parse(data);
        
        db.collection('accounts').find({email: data['email']}).toArray((err, result) => {
            if(err) throw err;

            if(result <= 0) {
                db.collection('accounts').find({username: data['username']}).toArray((err, result) => {
                    if(err) throw err;

                    if(result <= 0) {
                        data.courses = {"fall": [], "winter": [], "summer": []};
                        db.collection('accounts').insertOne(data, (err, result) => {
                            if(err) throw err;
                            req.session.username = data.username;
                            req.session.email = data.email; 
                            req.session.loggedin = true;
                            res.status(200).send('Account Created Successfully!');
                        });
                    } else {
                        res.status(400).send('An Account with this Username Already Exists!');
                    }
                });
            } else {
                res.status(400).send('An Account with this Email Already Exists!');
            }
        });

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