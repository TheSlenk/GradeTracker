const PORT = 3000;
const app = require('express')();
const mongoClient = require('mongodb').MongoClient;
let db;

app.get('/', (req,res, next) => {
    res.redirect('/home');
})



mongoClient.connect('mongodb://127.0.0.1:27017', {useNewUrlParser: true}, (err, client) => {
    if(err) throw err;
    
    db = client.db('GradeTracker');
    console.log('Connected to Database!');

    app.listen(PORT);
    console.log(`Connected to localhost:${PORT}...`);
});