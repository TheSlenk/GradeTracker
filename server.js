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
    if(req.session.loggedin) {
        res.status(200).render('home', {'data': JSON.stringify({'email': req.session.email, 'username': req.session.username})});
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
    const id = req.params.id;
    db.collection('courses').find({'courseId': id}).toArray((err, result) => {
        if(err) throw err;
        
        if(result.length <= 0)
            res.status(404).send('Course Not Found!');
        else {
            delete result[0]['_id'];
            res.status(200).render('course', {"data": JSON.stringify(result[0])});
        }    
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

//Complete
app.put('/logout', (req, res) => {
    req.session.email = undefined;
    req.session.username = undefined;
    req.session.loggedin = false;
    res.status(200).send('Logged Out!');
});
//Complete
app.put('/updatecourse', (req, res) => {
    req.on('data', (data) => {
        data = JSON.parse(data);
        db.collection('courses').replaceOne({'courseId': data['courseId']}, data, (err, result) => {
            if(err) throw err;
            res.status(200).send('Course updated Succesully!');
        });
        res.status(200);
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
    if(req.session.loggedin) {
        req.on('data', (data) => {
            data = JSON.parse(data);
            let id = new mongo.ObjectId().toString();
            mock_course['courseId'] = id;
            mock_course['owner'] = req.session.username;
            mock_course['term'] = data['term'];
            db.collection('courses').insertOne(mock_course, (err, result) => {
                if(err) throw err;
                console.log(result['insertedId'].toString());
                res.status(200).send(id);
            });
        });
    } else {
        res.status(403).redirect('/reg');
    };
});




mongoClient.connect('mongodb://127.0.0.1:27017', {useNewUrlParser: true}, (err, client) => {
    if(err) throw err;
    
    db = client.db('GradeTracker');
    accounts = db.collection('accounts');
    console.log('Connected to Database!');

    app.listen(PORT);
    console.log(`Connected to localhost:${PORT}...`);
});