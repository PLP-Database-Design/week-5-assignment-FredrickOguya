

const express = require('express');
const app = express();
const mysql = require('mysql2');
const dotenv =require('dotenv');
const cors = require('cors');

app.use(express.json());
app.use(cors());
dotenv.config();

// database connection

const db = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME
});
 

db.connect((err)=>{

    if(err) return console.log('error connecting to mysql db');
 
 
    console.log('mysql connected,,,as id: ',db.threadId);

    app.set('view engine', 'ejs');
    app.set('views',__dirname + '/views');

    app.get('/patients', (req,res)=>{
        db.query('SELECT * FROM patients',(err,results) =>{
            if(err){
                console.error(err);
                res.status(500).send('Error retrieving data');
            }else{
                res.render('patients',{results: results});
            }
        })
    })

    app.get('/provider', (req,res)=>{
        db.query('SELECT * FROM providers',(err,results)=>{
            if(err){
                console.error(err);
                res.status(500).send('Error retrieving data')
            }else{
                res.render('provider',{results:results})
            }
        })
    });
    app.get('/filtered_patients', (req,res) =>{
        db.query('SELECT * FROM patients ORDER BY first_name', (err,results)=>{
            if(err){
                console.log(err);
                res.status(500).send('Error retrieving data')
            }else{
                res.render('filtered_patients',{results: results})
            }
        })
    })
    app.get('/filtered_providers', (req,res) =>{
        db.query('SELECT * from providers ORDER BY provider_specialty',(err,results)=>{
            if(err){
                console.log('Error retrieving data')
            }else{
                res.render('filtered_providers',{results: results})
            }
        })
    })
    
    
    app.listen( process.env.PORT, ()=> {
    console.log(`Server listening on port: http://localhost:${process.env.PORT}`);


    console.log('sending message to browser...');
    app.get('/', (req,res)=> {
        res.send('Server started successfully!')
    }) 
});  
});
 


