const PORT = 3000;
const express = require('express');
const app = express();
const mongo = require('mongodb');
const session = require('express-session');
const mongoClient = mongo.MongoClient;


const mock_course = {
    "courseId": null,
    "courseName": "Untitled",
    "categories": [
        {"name": "Exam", "grade": 80, "weight": 50}
    ], 
    "owner": null, 
    "readonly": [],
    "term": null
};

let db;

// USE
app.use(session({
    secret: "audbaiupwdbauidbawiudbddsjmbdnfyfeshbjshfbla",
    saveUninitialized:true,
    cookie: { 
                username: undefined,
                email: undefined,
                loggedin: false,
                lastTermVisited: null
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
    if(req.session.loggedin) {
        res.status(200).render('home', {'data': JSON.stringify({'email': req.session.email, 'username': req.session.username, 'term': req.session.lastTermVisited})});
    } else {
        res.status(403).redirect('/reg');
    }
});

app.get('/reg', (req, res, next) => {
    if(req.session.loggedin) {
        res.redirect('/home');
        return;
    }
    res.status(200).render('signup');
});

//Complete
app.get('/course/:id', (req, res) => {
    if(!req.session.loggedin) {
        res.status(403).redirect('/reg');
        return;
    }

    const id = req.params.id;
    db.collection('courses').find({'courseId': id}).toArray((err, result) => {
        if(err) throw err;
        
        if(result.length <= 0 || result[0]['owner'] != req.session.username)
            res.status(404).send('Course Not Found!');
        else {
            delete result[0]['_id'];
            res.status(200).render('course', {"data": JSON.stringify(result[0])});
        }    
    });
});

app.get('/usercourses', (req, res) => {
    const username = req.query.username;
    const term = parseInt(req.query.term);
    if(!req.session.loggedin) {
        res.status(403).redirect('/reg');
        return
    }   
    if(req.session.username != username) {
        res.status(403).send('You are currently not logged into this account!');
        return;
    }
    db.collection('courses').find({'owner': username, 'term': term}).toArray((err, result) => {
        if(err) throw err;
        req.session.lastTermVisited = term;
        res.status(200).send(JSON.stringify(result));
    });
});


// PUT

// Complete
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
            req.session.lastTermVisited = 0;
            res.status(200).send('Logged in via Username!');
        } else {
            db.collection('accounts').find({email: email, password: password}).toArray((err, result) => {
                if(err) throw err;
                if(result.length > 0) {
                    req.session.username = result[0].username;
                    req.session.email = result[0].email; 
                    req.session.loggedin = true;
                    req.session.lastTermVisited = 0;
                    res.status(200).send('Logged in via Email!');
                } else {
                    res.status(400).send('Account Not Found!');
                }
            });
        }
    });
});

//Complete
app.put('/logout', (req, res) => {
    req.session.email = undefined;
    req.session.username = undefined;
    req.session.loggedin = false;
    req.session.lastTermVisited = null;
    res.status(200).send('Logged Out!');
});

//Complete
app.put('/updatecourse', (req, res) => {
    if(!req.session.loggedin) {
        res.status(403).redirect('/reg');
        return;
    }

    req.on('data', (data) => {
        data = JSON.parse(data);
        if(data['owner'] != req.session.username) {
            res.status(404).redirect('/home');
            return;
        }
        db.collection('courses').updateOne({'courseId': data['courseId']}, {$set: data}, (err, result) => {
            if(err) throw err;
            res.status(200).send('Course updated Succesully!');
        });
    });
});

app.put('/deletecourse', (req, res) => {
    req.on('data', (data) => {
        data = JSON.parse(data);
        db.collection('courses').deleteOne(data, (err, result) => {
            if(err) throw err;
            res.status(200).send();
        });
    });
});

//POST 
// Complete
app.post('/signup', (req, res, next) => {
    if(req.session.loggedin) {
        res.redirect('/home');
        return;
    }
    req.on('data', (data) => {
        data = JSON.parse(data);
        
        db.collection('accounts').find({email: data['email']}).toArray((err, result) => {
            if(err) throw err;

            if(result.length <= 0) {
                db.collection('accounts').find({username: data['username']}).toArray((err, result) => {
                    if(err) throw err;

                    if(result.length <= 0) {
                        data.fall = [];
                        data.winter = [];
                        data.summer = [];
                        db.collection('accounts').insertOne(data, (err, result) => {
                            if(err) throw err;
                            req.session.username = data.username;
                            req.session.email = data.email; 
                            req.session.loggedin = true;
                            req.session.lastTermVisited = 0;
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

//TODO 'remove id and use _id instead'
app.post('/addcourse', (req, res) => {
    if(!req.session.loggedin) {
        res.status(403).redirect('/reg');
        return;
    }

    req.on('data', (data) => {
        data = JSON.parse(data);
        const id = new mongo.ObjectId().toString();
        delete mock_course['_id'];
        mock_course['courseId'] = id;
        mock_course['owner'] = req.session.username;
        mock_course['term'] = data['term'];
        db.collection('courses').insertOne(mock_course, (err, result) => {
            if(err) throw err;
            const _id = result['insertedId'];
            res.status(200).send(id);
        });
    });
});



console.log('Connecting to database...');
mongoClient.connect('mongodb://127.0.0.1:27017', {useNewUrlParser: true}, (err, client) => {
    if(err) throw err;
    
    db = client.db('GradeTracker');
    accounts = db.collection('accounts');
    console.log('Connected to Database!');

    console.log("Starting Server...");
    app.listen(PORT);
    console.log(`Connected to http://localhost:${PORT}/`);
});