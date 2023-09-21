const express = require('express');
const router  = express.Router();
const favQueries = require('../db/queries/favs');


// Middleware for parsing JSON data
router.use(express.json());


// GET a list of all favourites of a user
router.get('/', (req, res) => {
  favQueries.getFavourites()
    .then((favourites) => {
      res.json({ favourites });
  })

});

//POST or Add to the list of favourite maps. Currently only fetching mapid
router.post('/', (req, res) => {

  res.json(req.body)

});

// Allows authenticated users to favourite a map
// router.get('/favourites', (req, res) => {
//   // if (req.session.user_id) {
//   //   res.send ('User is logged in!')
//   // }

//   //Extract user_id and map_id from the request
//   const { user_id, map_id } = req.body;
//   res.send ('This is the favourites page!')
// })





module.exports = router;
