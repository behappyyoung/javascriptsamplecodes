<?php
/**
 * Created by PhpStorm.
 * User: young
 *
 */

//$para = file_get_contents('php://input');
$para = json_encode($_REQUEST);

    $url = 'https://api.sendhub.com/v1/messages/?username=4088444583&api_key=1f29e48aa10de68cbcc80f16814b5092c7cab879';
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST,1);
    curl_setopt($ch, CURLOPT_HTTPHEADER,   array("Content-type: application/json"));
    curl_setopt($ch,CURLOPT_POSTFIELDS, $para);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_VERBOSE, 1);
    curl_setopt($ch, CURLOPT_HEADER, 1);
    $response = curl_exec($ch);
$curl_log = fopen("/var/www/javascriptsamplecodes/test/curl.txt", 'w+');           // for curl log for testing
curl_setopt($ch, CURLOPT_STDERR, $curl_log);
$response = curl_exec($ch);
fclose($curl_log);

    curl_close($ch);
    return $response;

