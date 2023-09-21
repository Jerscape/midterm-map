//Renders ejs templates (client's view)

const express = require('express');
const router = express.Router();
const apiKey = process.env.GOOGLE_MAPS_API_KEY;

//Get the list of favourite maps
router.get('/', (req, res) => {
  res.render('favs');

});



module.exports = router;
