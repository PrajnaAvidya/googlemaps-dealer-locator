<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

// connect to database
$db = new PDO('mysql:host=localhost;dbname=maps', 'root', 'root');

// get/sanitize parameters from URL
$center_lat = (float)$_GET["lat"];
$center_lng = (float)$_GET["lng"];
$radius = (int)$_GET["radius"];

// search markers table
$query = "SELECT address, name, lat, lng, ( 3959 * acos( cos( radians('$center_lat') ) * cos( radians( lat ) ) * cos( radians( lng ) - radians('$center_lng') ) + sin( radians('$center_lat') ) * sin( radians( lat ) ) ) ) AS distance FROM markers HAVING distance < '$radius' ORDER BY distance LIMIT 0 , 20";
$result = $db->query($query);

// markers array to be output as json
$markers = array();

// iterate through rows and add markers
foreach ($result->fetchAll() as $row)
{
  $markers[] = array(
    'name'=>$row['name'],
    'address'=>$row['address'],
    'lat'=>$row['lat'],
    'lng'=>$row['lng'],
    'distance'=>$row['distance'],
  );
}

// print json
echo json_encode($markers);
