<?php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');

$time = date('r');
$get = isset($_GET['test']) ?  $_GET['test'] : '';
echo "data: The server time is: {$time}  / My test input is ; {$get}\n\n";
flush();
?>
