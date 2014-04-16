<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
  <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
  <title>Google Maps AJAX + mySQL/PHP Example</title>

  <link rel="stylesheet" type="text/css" href="/locator.css" media="screen, projection">

  <script src="//code.jquery.com/jquery-1.11.0.min.js" type="text/javascript"></script>
  <script src="http://maps.google.com/maps/api/js?sensor=false" type="text/javascript"></script>
  <script src="/locator.js" type="text/javascript"></script>

  <script type="text/javascript">
  $( document ).ready(function() {
    // jquery goes here
  });
  </script>
</head>

<body style="margin:0px; padding:0px;">

  <div>
    <input type="text" id="addressInput" size="10"/>
    <select id="radiusSelect">
      <option value="25" selected>25mi</option>
      <option value="50">50mi</option>
      <option value="100">100mi</option>
      <option value="200">200mi</option>
      <option value="500">500mi</option>
    </select>
    <input type="button" onclick="searchLocations()" value="Search"/>
  </div>

  <div id="results">

    <!-- scrollable div of results -->
    <div id="list">
      results go here
    </div>

    <div id="mapcontainer">
      <!-- map -->
      <div id="map" style="width: 100%; height: 100%"></div>
    </div>

  </div>

</body>
</html>
