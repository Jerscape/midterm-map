//Renders ejs templates (client's view)

const express = require('express');
const router = express.Router();
const apiKey = process.env.GOOGLE_MAPS_API_KEY;

const { getFavourites, addFavourites, checkIfMapIsInFavourites } = require('../db/queries/favs');

//Render the favourite page
router.get('/', (req, res) => {
  const mapId = req.query.mapid; // Access mapid from the query parameter in post route /:mapid below
  const userid = req.cookies.user_id;

  getFavourites(userid).then((favourites) => {
    res.render("favs", { apiKey, favourites, mapId }); // Pass to EJS template
  });
});

router.post('/:mapid', (req, res) => {
  const mapid = req.params.mapid;
  const userid = req.cookies.user_id;

  // Check if the map is already in the user's favorites
  checkIfMapIsInFavourites(userid, mapid)
    .then((mapExists) => {
      if (mapExists) {
        res.redirect("/favs"); // Redirect back to the favorites page
      } else {
        // Map doesn't exist in favorites, add it
        addFavourites(userid, mapid)

          .then((mapid) => {
            res.redirect(`/favs?mapid=${mapid}`); // Pass mapid as a query parameter to be accessed in the /favs get route above
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
