// search processing & map manipulation happens in this file
// actual search/results are returned from json.php

// varibles
var map; // google map object
var loaded = false; // has the map/result div been loaded yet?
var markers = []; // map markers (location results)
var infoWindow; // tool tip (location pop up)

// initialize google map
function load()
{
  map = new google.maps.Map(document.getElementById("map"), {
    center: new google.maps.LatLng(40, -100),
    zoom: 4,
    mapTypeId: 'roadmap',
    mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU}
  });
  infoWindow = new google.maps.InfoWindow();

  return true;
}

// called when user hits search
function searchLocations()
{
  // show results/initalize map if not loaded yet
  if (loaded == false)
  {
    $('#results').show();
    loaded = load();
  }

  // get address input
  var address = $('#addressInput').val();

  // geocode address data into lat/lng
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({address: address}, function(results, status)
  {
    if (status == google.maps.GeocoderStatus.OK) {
      // search locations near location
      searchLocationsNear(results[0].geometry.location, address);
    } else {
      alert(address + ' not found');
    }
  });
}

// clear results
function clearLocations()
{
  // close tooltip
  infoWindow.close();

  // clear markers
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}

// search locations near center and parse json results into markers
function searchLocationsNear(center, raw_location)
{
  // clear old results
  clearLocations();

  // get search radius
  var radius = $('#radiusSelect').val();

  // search url
  var searchUrl = 'json.php?lat=' + center.lat() + '&lng=' + center.lng() + '&radius=' + radius;

  // make ajax call with lat/lng/radius and get results as json
  var response = '';
  $.ajax({ type: "GET",
    url: searchUrl,
    async: false,
    dataType: 'json',
    success: function(json){response = json;}
  });

  // bounds object
  var bounds = new google.maps.LatLngBounds();

  // html for result list on left
  var html = '<br/>';

  // count number of results
  var results = parseInt(Object.keys(response).length);

  // iterate through results to add markers
  response.forEach(function(marker) {
    // get marker attributes
    var name = marker.name;
    var address = marker.address;
    var distance = parseFloat(marker.distance);

    // lat/lng object
    var latlng = new google.maps.LatLng(
      parseFloat(marker.lat),
      parseFloat(marker.lng)
    );

    // add to list
    html = html + '<b>' + name + '</b><br/>' + address + '<br/><br/>';

    // add marker
    createMarker(latlng, name, address);

    // extend map bounds if necessary
    bounds.extend(latlng);
  });

  // set dealer list
  $('#list').html(html);

  // set result text
  $('#resultcount').text(results);
  $('#searchfrom').text(raw_location);

  // fit bounds
  map.fitBounds(bounds);
}

// add marker to map
function createMarker(latlng, name, address)
{
  // html inside marker
  var html = "<b>" + name + "</b> <br/>" + address;

  // create marker object
  var marker = new google.maps.Marker({
    map: map,
    position: latlng
  });

  // add tooltip to marker
  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });

  // push to map
  markers.push(marker);
}
