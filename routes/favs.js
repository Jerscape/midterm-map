//Renders ejs templates (client's view)

const express = require('express');
const router = express.Router();
const apiKey = process.env.GOOGLE_MAPS_API_KEY;

//Render the favourite page
router.get('/', (req, res) => {
  res.render('favs');

});

//Get the list of favourite maps
router.get('/:mapid', (req, res) => {

  res.redirect('/favs');

});



module.exports = router;
