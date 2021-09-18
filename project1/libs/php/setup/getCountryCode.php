<?php
    $geoJSON = json_decode(file_get_contents("../../countryBorders.geo.json"));
    $code;

    foreach($geoJSON->features as $country) {
        if($country->properties->name == $_REQUEST['name']){
            $code = $country->properties->iso_a2;
            break;
        }
    }

    header('Content-Type: application/json; charset=UTF-8');
	echo json_encode($code); 
?>