//Renders ejs templates (client's view)

const express = require('express');
const router = express.Router();
const apiKey = process.env.GOOGLE_MAPS_API_KEY;

const { getFavourites, addFavourites, checkIfMapIsInFavourites } = require('../db/queries/favs');

//Render the favourite page
router.get('/', (req, res) => {

  const userId = req.cookies.user_id;
  const username = req.cookies.username;

  getFavourites(userId)
    .then(() => {
    res.render("favs", { apiKey, userId, username }); // Pass to EJS template
  });
});

router.post('/:mapid', (req, res) => {
  const mapid = req.params.mapid;
  const userId = req.cookies.user_id;

  // Check if the map is already in the user's favorites
  checkIfMapIsInFavourites(userId, mapid)
    .then((mapExists) => {
      if (mapExists) {
        res.redirect("/favs"); // Redirect back to the favorites page
      } else {
        // Map doesn't exist in favorites, add it
        addFavourites(userId, mapid)

          .then(() => {
            res.redirect('/favs');
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
