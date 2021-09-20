<?php
    ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

    // Average Temperature
    $url1 = "http://api.weatherapi.com/v1/current.json?key=16c6f3f774ff49b6903230446211909&q=" . $_REQUEST['lat'] . "," . $_REQUEST['lng'] . "&aqi=no";
    // Weather Forecast
    $url2 = "http://api.weatherapi.com/v1/forecast.json?key=16c6f3f774ff49b6903230446211909&q=" . $_REQUEST['lat'] . "," . $_REQUEST['lng'] . "&days=1&aqi=no&alerts=no";
    // Renewable Energy Output
    $url3 = "https://api.worldbank.org/v2/country/" . $_REQUEST['code'] . "/indicator/EG.ELC.RNEW.ZS?format=json";
    // CO2 Emissions (Metric Tons per Capita)
    $url4 = "https://api.worldbank.org/v2/country/" . $_REQUEST['code'] . "/indicator/EN.ATM.CO2E.PC?format=json";
    // Urban population (%)
    $url5 = "https://api.worldbank.org/v2/country/" . $_REQUEST['code'] . "/indicator/SP.URB.TOTL.IN.ZS?format=json";

    // create cURL resources
    $ch1 = curl_init();
    $ch2 = curl_init();
    $ch3 = curl_init();
    $ch4 = curl_init();
    $ch5 = curl_init();

    // set URL and other appropriate options
	curl_setopt($ch1, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch1, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch1, CURLOPT_URL,$url1);
    curl_setopt($ch2, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch2, CURLOPT_URL,$url2);
    curl_setopt($ch3, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch3, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch3, CURLOPT_URL,$url3);
    curl_setopt($ch4, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch4, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch4, CURLOPT_URL,$url4);
    curl_setopt($ch5, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch5, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch5, CURLOPT_URL,$url5);

    $mh = curl_multi_init();

    //add the two handles
    curl_multi_add_handle($mh,$ch1);
    curl_multi_add_handle($mh,$ch2);
    curl_multi_add_handle($mh,$ch3);
    curl_multi_add_handle($mh,$ch4);
    curl_multi_add_handle($mh,$ch5);

    //execute the multi handle
    do {
        $status = curl_multi_exec($mh, $active);
        if ($active) {
            curl_multi_select($mh);
        }
    } while ($active && $status == CURLM_OK);
    
    //close the handles
    curl_multi_remove_handle($mh, $ch1);
    curl_multi_remove_handle($mh, $ch2);
    curl_multi_remove_handle($mh, $ch3);
    curl_multi_remove_handle($mh, $ch4);
    curl_multi_remove_handle($mh, $ch5);
    curl_multi_close($mh);

    $res1 = curl_multi_getcontent($ch1);
    $res2 = curl_multi_getcontent($ch2);
    $res3 = curl_multi_getcontent($ch3);
    $res4 = curl_multi_getcontent($ch4);
    $res5 = curl_multi_getcontent($ch5);
    $result = [$res1, $res2, $res3, $res4, $res5];

	// $decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $result;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 
?>