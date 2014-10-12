<?php
/**
 * Created by PhpStorm.
 * User: young
 *
 */

$para = file_get_contents('php://input');

$temppara = json_decode($para, true);
if(!isset($temppara['id']) || ($temppara['id'] =='')){
    echo json_encode(array('httpcode'=>400,  'body'=>'no contact id'));
    exit();
}else{
    $contactid = $temppara['id'];
}

    $url = 'https://api.sendhub.com/v1/contacts/'.$contactid.'/?username=4088444583&api_key=1f29e48aa10de68cbcc80f16814b5092c7cab879';
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST ,'PUT');
    curl_setopt($ch, CURLOPT_HTTPHEADER,   array("Content-type: application/json"));
    curl_setopt($ch,CURLOPT_POSTFIELDS, $para);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_VERBOSE, 1);
    curl_setopt($ch, CURLOPT_HEADER, 1);
    $response = curl_exec($ch);
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $header = substr($response, 0, $header_size);
    $body = substr($response, $header_size);
    curl_close($ch);

    echo json_encode(array('httpcode'=>$httpcode,  'body'=>$body));


