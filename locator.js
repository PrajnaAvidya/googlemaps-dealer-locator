// vars
var map;
var loaded = false;
var markers = [];
var infoWindow;
var locationSelect;

// initialize google map
function load() {
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

  var address = document.getElementById("addressInput").value;
  var geocoder = new google.maps.Geocoder();

  geocoder.geocode({address: address}, function(results, status)
  {
    if (status == google.maps.GeocoderStatus.OK) {
      searchLocationsNear(results[0].geometry.location);
    } else {
      alert(address + ' not found');
    }
  });
}

// clear results
function clearLocations() {
  // close tooltip
  infoWindow.close();

  // clear markers
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;

  /*locationSelect.innerHTML = "";
  var option = document.createElement("option");
  option.value = "none";
  option.innerHTML = "See all results:";
  locationSelect.appendChild(option);*/
}

// search locations near and parse xml results into markers
function searchLocationsNear(center) {
  // clear old results
  clearLocations();

  // get search radius
  var radius = document.getElementById('radiusSelect').value;
  var searchUrl = 'xml.php?lat=' + center.lat() + '&lng=' + center.lng() + '&radius=' + radius;
  downloadUrl(searchUrl, function(data) {
    var xml = parseXml(data);
    var markerNodes = xml.documentElement.getElementsByTagName("marker");
    var bounds = new google.maps.LatLngBounds();

    // place markers
    for (var i = 0; i < markerNodes.length; i++) {
      var name = markerNodes[i].getAttribute("name");
      var address = markerNodes[i].getAttribute("address");
      var distance = parseFloat(markerNodes[i].getAttribute("distance"));
      var latlng = new google.maps.LatLng(
        parseFloat(markerNodes[i].getAttribute("lat")),
        parseFloat(markerNodes[i].getAttribute("lng")));

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
function createMarker(latlng, name, address) {
  var html = "<b>" + name + "</b> <br/>" + address;
  var marker = new google.maps.Marker({
    map: map,
    position: latlng
  });
  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}

// download url
function downloadUrl(url, callback) {
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

// parse xml
function parseXml(str) {
  if (window.ActiveXObject) {
    var doc = new ActiveXObject('Microsoft.XMLDOM');
    doc.loadXML(str);
    return doc;
  } else if (window.DOMParser) {
    return (new DOMParser).parseFromString(str, 'text/xml');
  }
}

function doNothing() {}
