const express = require('express');
const router  = express.Router();
const favQueries = require('../db/queries/favs');


//GET a list of all favourites of a user
router.get('/', (req, res) => {
  //(userid)
  favQueries.getFavourites(1)
    .then((favourites) => {
      res.json({ favourites });
  })

});


module.exports = router;
