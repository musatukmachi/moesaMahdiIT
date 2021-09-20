<?php

$curl = curl_init();

curl_setopt_array($curl, [
	CURLOPT_URL => "https://geocodeapi.p.rapidapi.com/GetTimezone" . $_REQUEST['coord'],
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_FOLLOWLOCATION => true,
	CURLOPT_ENCODING => "",
	CURLOPT_MAXREDIRS => 10,
	CURLOPT_TIMEOUT => 30,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	CURLOPT_CUSTOMREQUEST => "GET",
	CURLOPT_HTTPHEADER => [
		"x-rapidapi-host: geocodeapi.p.rapidapi.com",
		"x-rapidapi-key: e9cd0d38a8msh6d2d204d4566576p1a6f29jsnef8390345b73"
	],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
	echo "cURL Error #:" . $err;
} else {
	echo $response;
}

?>