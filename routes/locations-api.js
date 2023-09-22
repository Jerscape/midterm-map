const express = require("express");
const router = express.Router();
const locQueries = require("../db/queries/locations");

// Read all GET
router.get("/", (req, res) => {

  locQueries.getLocations().then((locations) => {

    res.json({ locations });
  });
});

//GET all locations for a map id
router.get("/:mapid", (req, res) => {

  locQueries
    .getLocsByMapId(req.params.mapid)

    .then((locations) => {
      res.json({ locations });
    });
});


//edit/update map
//like, you have to retrieve the map but also update it....
router.post("/:id", (req, res) => {
  const mapId = req.params.id;
  res.redirect (`/api/locs/${mapId}`)

});



module.exports = router;
