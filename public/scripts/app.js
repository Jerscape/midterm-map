// Client facing scripts here

let markersList = [];

let map;

const resetMap = function (map) {

  // const map = new google.maps.Map(container, {zoom: 5})

  //find current location
  navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    const center = { lat: lat, lng: long };
    map.setCenter(center);
    //addCenterMarker(map)

  });

  return map;

};


const handleCreateMap = async function(){
  // alert("showing the form")

  $('.create-map-form').removeClass("hidden")
  $('#maps-container').removeClass("hidden")
  // $('#fav-button').addClass("hidden")
  // $('h2').addClass("hidden")

  const { Map } = await google.maps.importLibrary('maps');
  map = new Map(document.getElementById("locs-container"), {
    center: { lat: 51.00, lng: 0.221 },
    zoom: 10,
  });

  resetMap(map);
  //addCenterMarker(map)

  //let markersList = [];
  google.maps.event.addListener(map, "click", function (event) {

    // Get the latitude and longitude from the click event
    console.log("click event fired");
    //note, got the lat() and lng() methods from stackoverflow
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    console.log("Latitude: " + lat + "\nLongitude: " + lng);

    //create marker
    const marker = new google.maps.Marker({
      position: { lat: lat, lng: lng },
      map: map,
      title: "Example marker",
    });

    markersList.push(marker);
    // console.log("Markers list: ", markersList);


  }); //end event listenr

}


$("#save-map-button").click(function (event) {
  event.preventDefault();
  let mapData = {};

  let title = $('#input-title').val();
  console.log("retrieved title: ", title);

  let center = map.getCenter();

  //hard code the UID as I dont know what it is
  mapData["uid"] = 1;
  //hard code the title until I can figure out how to capture it
  mapData['title'] = title;
  mapData['center_latitude'] = center.lat();
  mapData['center_longitude'] = center.lng();
  mapData['zoom_level'] = map.getZoom();

  //AJAX post request here to create post
  $.post('/api/maps', mapData)
    .then((newMapData) => {

      console.log("Response data line 70: ", newMapData);

      console.log("longitude test: ", markersList[0].internalPosition.lng());
      async function postLocations(markersList, newMapData) {
        for (const marker of markersList) {
          let count = 1;
          //console.log("Response data line 75 inside asynch function: ", newMapData);
          console.log("processing marker", marker);
          //console.log("newMapData id: ", newMapData['id'])
          //let id = newMapData['id']
          const dataToLocations = {
            'title': 'demo title',
            'description': "demo description",
            'map_id': newMapData.id,
            'latitude': markersList[count].internalPosition.lat(),
            'longitude': markersList[count].internalPosition.lng(),

          };
          console.log('latitude', markersList[count].internalPosition.lat(),
            'longitude', markersList[count].internalPosition.lng());
          count++;
          //console.log("latitude in asynch function", latitude)
          //console.log("longitude in asynch function", longitude)
          try {
            const newFavouritesData = await $.post('/api/locs', dataToLocations);
            console.log("new favourites returned data", newFavouritesData);
            

          } catch (error) {
            console.log("Error message from post to locations", error);
          }
        }
      }

      // Usage
      // This assumes newMapData
          postLocations(markersList, newMapData)
          .then(()=>{
            const $mapsContainer = $("#maps-container");
            var location = {};
            // Make an AJAX (asynchronous) GET request to the '/api/maps' endpoint on the server.
            $.ajax({
              method: "GET",
              url: "/api/maps",
            }).done((response) => {
              // When the AJAX request is successful, this callback function is executed.

              $mapsContainer.empty(); // Empty the content of the 'maps-container' div.

              // Loop through the array of available maps in the response and create a map for each.
              for (const map of response.maps) {
                const eachMapContainer = `

                  <h3> <a href="#" id="showLoc" onclick="javascript:showMapLocations(${map.id})"> ${map.title} </h3> </a>
                </div>`;
                // Append the each map's container to the 'maps-container' div.
                $($mapsContainer).append(eachMapContainer);

                // // Define the location for each map
                location = { lat: map.center_latitude, lng: map.center_longitude };
              }
              // Call the initMap function to initialize the Google Map for this location
              initMap(location); //temporarily displaying the last map location (until user's currentl location functionality is done)
            });
          })
        .catch((error) => {
          console.log("UNsuccessful post request to create route", error);
        });



      //create and load object with locations to send to route/query

      // const dataToLocations = {};

      // dataToLocations['title'] = newMapData['title'];
      // dataToLocations['description'] = "demo description";
      // dataToLocations['map_id'] = newMapData['id'];
      // dataToLocations['latitude'] = markersList[0].internalPosition.lat(); //this number would need to escalate
      // dataToLocations['longitude'] = markersList[0].internalPosition.lng();

      // $.post('/api/locs', dataToLocations)
      //   .then((newFavouritesData) => {
      //     console.log("new favourites returned data", newFavouritesData);
      //   }).catch((error) => {
      //     console.log("Error messge from post to locations", error);
      //   });

    })//end outside then
    .catch((error) => {
      console.log("UNsuccesful post reques to create route", error);
    });//end outdie catch
}); //end save map button

$(() => {
  //call loadmaps()
  console.log("Start")
  //click event for CREATE MAP button
  $('.new-map').on('click', handleCreateMap);


  console.log("test");

  //define createmap function

  //rename to rendermaps()
  // const createMap = function () {
  //   const $aMap = $(`
  //   <div>
  //     This is a map div. Eventually a map will go here.
  //   </div>`);

  //   return $aMap;
  // };

  // const renderMaps = function (placeholder) {
  //   let $aMap = createMap(); //rename it to createMapElement()
  //   $(".map-container").append($aMap);
  // };

  // renderMaps(); // call it inside the loadMap()
});





// const loadMaps = function(){

//   $ajax({
//     url: '/index.ejs',
//     succes: () => {
//       renderMaps()
//     }
//   })
// }

//loadTweets()

//ajax example from tweeter

// const loadTweets = function() {

//   $.ajax({
//     url: '/tweets',
//     success: (tweets) => {
//       renderTweet(tweets)

//     },
//     error: (err) =>  { console.log(err)}
//   })
