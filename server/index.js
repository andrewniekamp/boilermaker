const path = require('path');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const db = require('./db/db');
const session = require('express-session');
const passport = require('passport');

// configure and create our database store
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const dbStore = new SequelizeStore({ db: db });
// sync so that our session table gets created
dbStore.sync();

const PORT = process.env.PORT || 8888;

const app = express();

const server = app.listen(PORT, ()=> console.log(`Server listening on ${PORT}`))

module.exports = app;

app.use(session({
  secret: process.env.SESSION_SECRET || 'a wildly insecure secret',
  store: dbStore,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

db.sync({force: true}).then(()=> console.log('Database party on! '))

//logginig middleware
app.use(morgan('dev'));

//static middleware
app.use(express.static(path.join(__dirname, '..', 'node_modules')));

app.use(express.static(path.join(__dirname, '..', 'public')))


//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

// API routes
app.use('/api', require('./api'));

passport.serializeUser((user, done) => {
  try {
    done(null, user.id);
  } catch (err) {
    done(err);
  }
});

passport.deserializeUser((id, done) => {
  db.model('user').findById(id)
    .then(user => done(null, user))
    .catch(done);
});

//404 middleware
app.use((req,res,next) => {
	path.extname(req.path).length > 0 ?
	res.status(404).send('Not found') : next()
})

app.use('*', (req,res,next) => res.sendFile(path.join(__dirname, '..', 'public/index.html'))
	);

//error handling endware
app.use((err,req,res,next) => res.status(err.status || 500).send(err.message || 'Internal server error :(')
	);
