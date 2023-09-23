// Initializes the google map API and displays the city map in the div container

function initMap(city_location, container_id) {
  //const map = new google.maps.Map(document.getElementById("locs-container"), {
  const map = new google.maps.Map(document.getElementById(container_id), {
    zoom: 8,
    center: city_location,
  });

  const marker = new google.maps.Marker({
    position: city_location,
    map: map,
  });
}

//--copying from locs.js----------------------------------------------------------------
// Initializes the google map API and displays the markers/different locations in the city map

function initMapLoc(mapLocs, container_id) {
  // Check if mapLocs is an empty array or doesn't exist
  if (!mapLocs || mapLocs.length === 0) {
    console.error("No location data available.");
    return;
  }

  const fetchMapCenter = mapLocs[0];
  const mapCenter = fetchMapCenter.center;

  const map = new google.maps.Map(document.getElementById(container_id), {
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
function showMapLocations(mapId, container_id) {
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

      initMapLoc(mapLocs, container_id);
    })

    .fail((xhr, status, error) => {
      console.error("Ajax request failed:", status, error);
    });
}

//Checks if a cookie was set from the server
function getIsAuthenticated () {
  return $.ajax({
    method: "GET",
    url: "/isLoggedIn",
  });
};

// This code runs when the DOM is ready
$(() => {
  const $mapsContainer = $("#maps-container");
  const $buttonContainer = $("#button-container");

  let location = {};

  let isAuthenticated =
  getIsAuthenticated()
    .then((data) => {

    isAuthenticated = data.isAuthenticated;
  });


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
          <h3> <a href="#" id="showLoc-${map.id}" onclick="javascript:showMapLocations(${map.id}, 'locs-container')"> ${map.title} </h3> </a>
        </div>`;

      // Append the each map's container to the 'maps-container' div.
      $($mapsContainer).append(eachMapContainer);

      // Define the location for each map
      location = { lat: map.center_latitude, lng: map.center_longitude };

      //Initialize the map
      initMap(location, "locs-container");

      //Add a button for user to add to favourite
      const favButton = `
        <form action="/favs/${map.id}" method="POST">
          <button id="fav-button_${map.id}" class="fav-button">Add to Favorite</button>
        </form>`;

      // Find the appended anchor tag in eachMapContainer and attach a click event listener
      const $showLocAnchor = $(`#showLoc-${map.id}`);

      $showLocAnchor.on("click", function () {

        //Checks if the user who clicks a map link is authenticated before displaying the add to favourite button
        if (isAuthenticated) {
          $buttonContainer.empty().append(favButton);
        }
      });
    }
  });

  const getAllFavourites = () => {
    //Make an AJAX (asynchronous) Get request to the 'api/favs' endpoint on the server.
    return $.ajax({
      method: "GET",
      url: "/api/favs",
    }).done((response) => {
      renderFavourites(response.favourites);
    });
  };

  const renderFavourites = (favourites) => {
    const $favsContainer = $("#favourites-container");

    $favsContainer.empty();

    // Loop through the array of fav maps
    for (const fav of favourites) {
      // Create a new container with a unique ID based on the map's ID.
      const eachFavContainer = $(`
        <div class="each-fav-container">
          <div id="fav-${fav.map_id}" class="fav">
          </div>
          <h3> <a href="#" id="showFav" onclick="javascript:showMapLocations(${fav.map_id}, 'fav-map-container')"> ${fav.title} </a></h3>
        </div>`);

      // Append the each fav's container to the 'favs-container' div.
      $favsContainer.append(eachFavContainer);

      //Define the location for each map
      const location = {
        lat: favourites[0].center_latitude,
        lng: favourites[0].center_longitude,
      };
      initMap(location, "fav-map-container");
    }
  };

  getAllFavourites();

  // Event listener for the homepage link
  const homeLink = document.getElementById("home-link");

  if (homeLink) {
    homeLink.addEventListener("click", function () {
      //Navigate to the homepage
      window.location.href = "/";
    });
  }
});
