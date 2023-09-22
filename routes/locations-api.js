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



//LARRY AI BOT SAID TRADITIONALLY YOU USE PUT ROUTES TO UPDATE DATA
//edit/update map
//like, you have to retrieve the map but also update it....

router.post("/:id", (req, res) => {
  const mapId = req.params.id;
  res.redirect (`/api/locs/${mapId}`)

});


//post map markers on saved maps to favourites
router.post("/", (req, res) => {
  console.log("router post to locations triggered")

  const title = req.body.title;
  const description = req.body.description;
  const map_id = req.body.map_id;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;

  let markerData = {title, description, map_id, latitude, longitude};
  locQueries.addLocations(markerData)
  .then((locations) => {
    res.send(locations);
    //console.log("locations returned:", locations)
  })
  .catch((err) => {
    res.send(err)
    //console.log("error from post to locs route:", err)
  })


});

//   let mapData = {user_id: user_id, uid: uid, title: title, center_latitude: latitude, center_longitude: longitude, zoom_level: zoom_level}
//   mapQueries.createMap(mapData)
//   .then((map) => {
//     //res.json(map)//will this correctly convert the returned sql rows to json?
//     console.log(res)
//     //would I conver tot json here
//     //res.redirect('/create');
//     res.json(map)
//   }).catch((err)=>{
//     console.log("There was an error creating the map")
//   })

// });

// Read one GET
//get a specific map?
//Jeremy (based on map id?)


module.exports = router;
