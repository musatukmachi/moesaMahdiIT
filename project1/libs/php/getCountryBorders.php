<?php
    header('Content-Type: application/json; charset=UTF-8');
    
    $geoJSON = json_decode(file_get_contents("../countryBorders.geo.json"));
    $country_name = $_REQUEST['country'];

    foreach($geoJSON->features as $country) {
        if($country_name == $country->properties->name){
            echo json_encode($country->geometry);
            break;
        }
    }
?>