<?php
/**
 * Created by PhpStorm.
 * User: young
 *
 */

$para = file_get_contents('php://input');

    $url = 'https://api.sendhub.com/v1/messages/?username=4088444583&api_key=1f29e48aa10de68cbcc80f16814b5092c7cab879';
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST,1);
    curl_setopt($ch, CURLOPT_HTTPHEADER,   array("Content-type: application/json"));
    curl_setopt($ch,CURLOPT_POSTFIELDS, $para);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_VERBOSE, 1);
    curl_setopt($ch, CURLOPT_HEADER, 1);
    $response = curl_exec($ch);
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    echo json_encode(array('httpcode'=>$httpcode,  'body'=>$response));


