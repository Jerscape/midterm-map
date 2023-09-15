// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 8080;
const app = express();
app.use(cookieParser())

app.set('view engine', 'ejs');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(
  '/styles',
  sassMiddleware({
    source: __dirname + '/styles',
    destination: __dirname + '/public/styles',
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static('public'));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own

const pinApiRoutes = require('./routes/pins-api');
const mapsApiRoutes = require('./routes/maps-api')
const favApiRoutes = require('./routes/favs-api')


// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/api/pins', pinApiRoutes);
app.use('/api/maps', mapsApiRoutes)
app.use('/api/favs', favApiRoutes)
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get('/', (req, res) => {
  res.render('index');
});

//moved here on Gary's advice
app.get('/login/:id', (req, res) => {
res.cookie('user_id', req.params.id);
return res.redirect("/")
});


app.post('/logout',(req,res) => {
console.log("hello logout route")
  //.cookies["user_id"])
res.clearCookie('user_id');
return res.redirect("/")
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});


