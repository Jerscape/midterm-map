

//Client facing script, displays the list of all available maps

// Initializes the google map API and displays the city map in the div container
function initMap(city_location) {

  const map = new google.maps.Map(document.getElementById("locs-container"), {
  zoom: 8,
  center: city_location,
  });

  const marker = new google.maps.Marker({
    position: city_location,
    map: map,
  });

};

//--copying from locsjs----------------------------------------------------------------
// Initializes the google map API and displays the markers/different locations in the city map

function initMapLoc(mapLocs) {
  // Check if mapLocs is an empty array or doesn't exist
  if (!mapLocs || mapLocs.length === 0) {
    console.error("No location data available.");
    return;
  }

  const fetchMapCenter = mapLocs[0];
  const mapCenter = fetchMapCenter.center;

  const map = new google.maps.Map(document.getElementById("locs-container"), {
    zoom: 13,
    center: mapCenter,
  });

  for (let loc of mapLocs) {

    let marker = new google.maps.Marker({
      position: new google.maps.LatLng(loc.lat, loc.lng),
      map: map,
      title: loc.title,
      animation: google.maps.Animation.DROP,
    });


    // Create an InfoWindow for each marker
    const infoWindow = new google.maps.InfoWindow({
      content: `<h3> ${loc.title}</h3><p>${loc.description}</p>`,
    });

    //Display infoWindow on mouseover
    marker.addListener("mouseover", () => {
      infoWindow.open(map, marker);
    });

    //Hide infoWindow on mouseout
    marker.addListener("mouseout", () => {
      infoWindow.close();
    });


    //Toggle the animation of a marker between bouncing and not bouncing when clicked on
    marker.addListener("click", () => {
      toggleBounce(marker);
    });

    marker.setMap(map);
  }
}

//Toggle the animation of a marker between bouncing and not bouncing
function toggleBounce(marker) {
  if (marker.getAnimation() === null) {
    // if marker is not animated, make it bounce
    marker.setAnimation(google.maps.Animation.BOUNCE);

    // Stop bouncing after  1 sec
    setTimeout(() => {
      marker.setAnimation(null);
    }, 1000);
  }
}



//function to show map locations for a map
function showMapLocations(mapId) {

  // Make an AJAX (asynchronous) GET request to the '/api/locs' endpoint on the server.
  $.ajax({
    method: "GET",
    url: `/api/locs/${mapId}`,
    dataType: "json",
  })
    .done((response) => {

      // When the AJAX request is successful, this callback function is executed.

      let mapLocs = []; //create an array to store multiple locations for a map



      // Loop through the array of available locations in the response and add to the map.
      for (const loc of response.locations) {

        //Create an object to hold each location's necessary details
        const locationDetails = {
          lat: loc.latitude,
          lng: loc.longitude,
          title: loc.title,
          description: loc.description,
          center: { lat: loc.center_latitude, lng: loc.center_longitude },
          draggable: true,
          clickable: true,
          animation: google.maps.Animation.DROP,
        };

        mapLocs.push(locationDetails);
      }


      initMapLoc(mapLocs);


    })

    .fail((xhr, status, error) => {
      console.error("Ajax request failed:", status, error);
    });
}



// console.log("stringified value:", JSON.stringify(favouriteMaps[mapId]));


// This code runs when the DOM is ready
$(() => {
  const $mapsContainer = $("#maps-container");

  let location = {};



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
        <div>
          <h3> <a href="#" id="showLoc" onclick="javascript:showMapLocations(${map.id}, ${map.user_id})"> ${map.title} </h3> </a>

          <button id="fav-button_${map.id}" data-map-id="${map.id}" data-user-id="${map.user_id}" class="fav-button">Add to Favorite</button>

        </div>`;


      // Append the each map's container to the 'maps-container' div.
      $($mapsContainer).append(eachMapContainer);

      // Define the location for each map
      location = { lat: map.center_latitude, lng: map.center_longitude };


      initMap(location);

      // Attach a click event listener to the "Add to Favorite" button for each map
      $(`#fav-button_${map.id}`).on('click', function () {
        const mapId = $(this).data('map-id');
        const userId = $(this).data('user-id');

        handleAddToFavouriteClick(map);

        // renderFavouriteMaps(mapId);
      });

    }



  });

});



 // Function to render the list of favourite maps
// function renderFavouriteMaps(mapId) {
//   const $favouritesContainer = $("#favourites-container");

//   // Clear the existing favorites
//   $favouritesContainer.empty();

//     const favouriteMapContainer = `
//       <div>
//         <h3>${mapId}</h3>
//       </div>`;
//     $favouritesContainer.append(favouriteMapContainer);

// };

 // Function to handle the "Add to Favorite" button click
function handleAddToFavouriteClick(map) {
  const mapId = map.id;

    //Make an AJAX (asynchronous) POST request to the '/favs' endpoint on the server.
    $.ajax({
      method: "GET",
      url: `/api/favs/${mapId}`,
      data: { mapId },
    }).done((response) => {

      console.log("This is my favourite map:", response.favourites);
      for (const fav of response.favourites) {
        const mapid = fav.id;


        $.ajax({
          method: "POST",
          url: `/api/locs/${mapid}`,
        }).done((response) => {

          console.log("This is my map with it's locations:", response.locations);

          const $favsContainer = $("favourites-container");

          $favsContainer.empty();


          const eachFavContainer = `
            <div>
              <h3> <a href="#" id="showLoc" onclick="javascript:showMapLocations(${map.id}, ${map.user_id})"> ${map.title} </h3> </a>

            </div>`;


          $($favsContainer).append(eachFavContainer);


          showMapLocations(mapid);

        });
      }


    });



};







