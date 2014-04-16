<?php
// connect to database
$connection=mysql_connect ('127.0.0.1:8889', 'root', 'root');
if (!$connection)
{
  die("Not connected : " . mysql_error());
}
$db_selected = mysql_select_db('maps', $connection);
if (!$db_selected)
{
  die ("Can\'t use db : " . mysql_error());
}

// Get parameters from URL
$center_lat = $_GET["lat"];
$center_lng = $_GET["lng"];
$radius = $_GET["radius"];

// Search the rows in the markers table
$query = sprintf("SELECT address, name, lat, lng, ( 3959 * acos( cos( radians('%s') ) * cos( radians( lat ) ) * cos( radians( lng ) - radians('%s') ) + sin( radians('%s') ) * sin( radians( lat ) ) ) ) AS distance FROM markers HAVING distance < '%s' ORDER BY distance LIMIT 0 , 20",
  mysql_real_escape_string($center_lat),
  mysql_real_escape_string($center_lng),
  mysql_real_escape_string($center_lat),
  mysql_real_escape_string($radius));
$result = mysql_query($query);
if (!$result)
{
  die("Invalid query: " . mysql_error());
}

// output XML
/*$dom = new DOMDocument("1.0");
$node = $dom->createElement("markers");
$parnode = $dom->appendChild($node);
header("Content-type: text/xml");*/

$markers = array();

// Iterate through the rows, adding XML nodes for each
while ($row = @mysql_fetch_assoc($result))
{
  $markers[] = array(
    'name'=>$row['name'],
    'address'=>$row['address'],
    'lat'=>$row['lat'],
    'lng'=>$row['lng'],
    'distance'=>$row['distance'],
  );
}

//echo $dom->saveXML();
echo json_encode($markers);
