<?php
    $geoJSON = json_decode(file_get_contents("../../countryBorders.geo.json"));
    $names = array();

    foreach($geoJSON->features as $country) {
        array_push($names, $country->properties->name);
    }

    header('Content-Type: application/json; charset=UTF-8');
	echo json_encode($names); 
?>