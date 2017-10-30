const path = require('path');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
// const db = require('./db');

const PORT = process.env.PORT || 8888; 

const app = express();

const server = app.listen(PORT, ()=> console.log(`Server listening on ${PORT}`))

module.exports = app;

// db.sync().then(()=> console.log('Database party on! '))

//logginig middleware
app.use(morgan('dev'));

//static middleware
app.use(express.static(path.join(__dirname, '..', 'node_modules')));

app.use(express.static(path.join(__dirname, '..', 'public')))


//body parser middleware 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

// API routes 

// app.use('/api', require('./api'));

//404 middleware
app.use((req,res,next) => {
	path.extname(req.path).length > 0 ? 
	res.status(404).send('Not found') : next()
})

app.use('*', (req,res,next) => res.sendFile(path.join(__dirname, '..', 'public/index.html'))
	);

//error handling endware 
app.use((err,req,res,next) => res.status(err.status || 500).send(err.message || 'Internal sercer error :(')
	);