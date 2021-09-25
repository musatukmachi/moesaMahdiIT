<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	// $url='http://api.geonames.org/findNearbyWikipediaJSON?lat=' . $_REQUEST['lat'] . '&lng=' . $_REQUEST['lng'] . '&radius=20&username=moesamahdi';
	// $url = 'https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=' . $_REQUEST['lat'] . '%7C' . $_REQUEST['lng'] . '&gsradius=10000&gslimit=1000&format=json';
	$url = 'https://en.wikipedia.org/w/api.php?action=opensearch&limit=1&namespace=0&format=json&search=' . $_REQUEST['search'];

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL, $url);

	$result = curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $decode;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>