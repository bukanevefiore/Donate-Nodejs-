const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();


const mysql = require('mysql');
 
const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'node_crud'
});
 
connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Connected!');
}); 

//set views file
app.set('views',path.join(__dirname,'views'));
			
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/',(req, res) => {
    // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
    let sql = "SELECT * FROM donation";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('user_index', {
            title : 'User Records',
            users : rows
        });
    });
});

app.get('/add',(req, res) => {
    res.render('user_add', {
        title : 'User Donations'
    });
});
 
app.post('/save',(req, res) => { 
    let data = {name: req.body.name, amount: req.body.amount, verification: req.body.verification,
        date: req.body.date};
    let sql = "INSERT INTO donation SET ?";
    let query = connection.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});

app.get('/edit/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `Select * from donation where id = ${userId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('user_edit', {
            title : 'Record Update',
            user : result[0]
        });
    });
});
 
 
app.post('/update',(req, res) => {
    const userId = req.body.id;
    let sql = "update donation SET name='"+req.body.name+"',  amount='"+req.body.amount+"',  verification='"+req.body.verification+"',  date='"+req.body.date+"' where id ="+userId;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});
 
 
app.get('/delete/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `DELETE from donation where id = ${userId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});


 
// Server Listening
app.listen(3000, () => {
    console.log('Server is running at port 3000');
});