const express = require('express');
const router  = express.Router();
const favQueries = require('../db/queries/favs');


// Middleware for parsing JSON data
router.use(express.json());


// GET a list of all favourites of a user
// router.get('/', (req, res) => {
//   favQueries.getFavourites()
//     .then((favourites) => {
//       res.json({ favourites });
//   })

// });

//GET a favourite map with map id - working!!!
router.get("/:mapid", (req, res) => {

  favQueries.getFavourites(req.params.mapid)
    .then((favourites) => {
      res.json({ favourites });
    });
});


//POST a favourite map with mapid

router.post("/:id", (req, res) => {
  const mapId = req.params.id;

  res.redirect (`/api/favs/${mapId}`)

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
