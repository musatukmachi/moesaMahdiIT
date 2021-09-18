<?php
    ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

    // GDP
    $url1 = "https://api.worldbank.org/v2/country/" . $_REQUEST['code'] . "/indicator/NY.GDP.PCAP.CD?format=json";
    // Exchange Rate
    $url2 = "https://api.worldbank.org/v2/country/" . $_REQUEST['code'] . "/indicator/PA.NUS.FCRF?format=json";
    // Unemployment Rate
    $url3 = "https://api.worldbank.org/v2/country/" . $_REQUEST['code'] . "/indicator/SL.UEM.TOTL.ZS?format=json";
    // Access to Electricity
    $url4 = "https://api.worldbank.org/v2/country/" . $_REQUEST['code'] . "/indicator/EG.ELC.ACCS.ZS?format=json";

    // create cURL resources
    $ch1 = curl_init();
    $ch2 = curl_init();
    $ch3 = curl_init();
    $ch4 = curl_init();

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

    $mh = curl_multi_init();

    //add the two handles
    curl_multi_add_handle($mh,$ch1);
    curl_multi_add_handle($mh,$ch2);
    curl_multi_add_handle($mh,$ch3);
    curl_multi_add_handle($mh,$ch4);

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
    curl_multi_close($mh);

    $res1 = curl_multi_getcontent($ch1);
    $res2 = curl_multi_getcontent($ch2);
    $res3 = curl_multi_getcontent($ch3);
    $res4 = curl_multi_getcontent($ch4);
    $result = [$res1, $res2, $res3, $res4];

	// $decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $result;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 
?>