//Renders ejs templates (client's view)

const express = require('express');
const router = express.Router();
const apiKey = process.env.GOOGLE_MAPS_API_KEY;

const { getFavourites, addFavourites } = require('../db/queries/favs');

//Render the favourite page
router.get('/', (req, res) => {
  //(userid)
  getFavourites(1)
    .then((favourites) => {
      console.log("Favourite maps:", favourites);
      res.render ('favs', { apiKey, favourites });

  })
});

router.post('/:mapid', (req, res) => {
  //(userid, mapid)
  addFavourites(1, req.params.mapid)
    .then(() => {
      res.redirect('/favs');
    })

})





module.exports = router;
