const mongo = require('mongodb');
const client = mongo.MongoClient;
const fs = require('fs');
let db;

client.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true}, async (err, c) => {
    if(err) throw err;
    db = c.db('GradeTracker');

    await db.collection('accounts').deleteMany({});
    //admin user
    await db.collection('accounts').insertOne({username: 'admin', password: 'admin', courses: []}, (err, result) => {
        if (err) throw err;
    });
    fs.readFile('mock-users.json', async (err, data) => {
        data = JSON.parse(data);
        await db.collection('accounts').insertOne(data, (err, result) => {
            if(err) throw err;
        });
    });
    console.log('Database Created!');
});