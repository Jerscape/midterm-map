//Renders ejs templates (client's view)

const express = require('express');
const router = express.Router();
const apiKey = process.env.GOOGLE_MAPS_API_KEY;

const { getFavourites, addFavourites, checkIfMapIsInFavourites } = require('../db/queries/favs');
const userid = 1;

//Render the favourite page
router.get('/', (req, res) => {

  getFavourites(userid)
    .then((favourites) => {
      console.log("Favourite maps:", favourites);
      res.render ('favs', { apiKey, favourites });

  })
});

router.post('/:mapid', (req, res) => {

  // Check if the map is already in the user's favorites
  checkIfMapIsInFavourites(userid, req.params.mapid)
    .then((mapExists) => {
      if (mapExists) {
        res.redirect("/favs"); // Redirect back to the favorites page
      } else {
        // Map doesn't exist in favorites, add it
        addFavourites(userid, req.params.mapid).then(() => {
          res.redirect("/favs");
        });
      }
    })
    .catch((error) => {
      // Handle any database error
      console.error(error);
      res.status(500).send("Internal Server/Database Error"); // Respond with an appropriate error status
    });

});





module.exports = router;
