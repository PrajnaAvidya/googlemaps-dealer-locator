// vars
var map;
var loaded = false;
var markers = [];
var infoWindow;
var locationSelect;

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
}

// called when user hits search
function searchLocations()
{
  // show results/initalize map if not loaded yet
  if (loaded == false)
  {
    $('#results').show();
    load();
    loaded = true;
  }

  // get address input
  var address = document.getElementById("addressInput").value;

  // getcode address data
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({address: address}, function(results, status)
  {
    if (status == google.maps.GeocoderStatus.OK) {
      // search locations near location
      searchLocationsNear(results[0].geometry.location);
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

// search locations near and parse xml results into markers
function searchLocationsNear(center)
{
  // clear old results
  clearLocations();

  // get search radius
  var radius = document.getElementById('radiusSelect').value;

  // make search call TODO switch to jquery
  var searchUrl = 'xml.php?lat=' + center.lat() + '&lng=' + center.lng() + '&radius=' + radius;
  downloadUrl(searchUrl, function(data) {
    // parse XML TODO switch to json
    var xml = parseXml(data);
    // get marker nodes from xml
    var markerNodes = xml.documentElement.getElementsByTagName("marker");
    // bounds object
    var bounds = new google.maps.LatLngBounds();

    // place markers
    for (var i = 0; i < markerNodes.length; i++)
    {
      // xml attributes
      var name = markerNodes[i].getAttribute("name");
      var address = markerNodes[i].getAttribute("address");
      var distance = parseFloat(markerNodes[i].getAttribute("distance"));

      // lat/lng object
      var latlng = new google.maps.LatLng(
        parseFloat(markerNodes[i].getAttribute("lat")),
        parseFloat(markerNodes[i].getAttribute("lng"))
      );

      // add marker
      createMarker(latlng, name, address);

      // extend map bounds if necessary
      bounds.extend(latlng);
    }

    // fit bounds
    map.fitBounds(bounds);
  });
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

// download url TODO replace with jquery
function downloadUrl(url, callback)
{
  var request = window.ActiveXObject ?
  new ActiveXObject('Microsoft.XMLHTTP') :
  new XMLHttpRequest;

  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      request.onreadystatechange = doNothing;
      callback(request.responseText, request.status);
    }
  };

  request.open('GET', url, true);
  request.send(null);
}

// parse xml TODO replace with json/jquery
function parseXml(str) {
  if (window.ActiveXObject) {
    var doc = new ActiveXObject('Microsoft.XMLDOM');
    doc.loadXML(str);
    return doc;
  } else if (window.DOMParser) {
    return (new DOMParser).parseFromString(str, 'text/xml');
  }
}

// do nothing TODO remove when obsolete
function doNothing() {}
