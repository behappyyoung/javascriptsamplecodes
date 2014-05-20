<?php

if ($handle = opendir('.')) {
    while (false !== ($entry = readdir($handle))) {
        if (($entry != ".") && ($entry != "..") && (is_dir($entry))&&(stripos($entry, '.')===false)&&(stripos($entry, 'cgi-bin')===false)) {
            echo "<a href='./$entry/' > $entry </a> <br />" ;
        }
    }
    closedir($handle);
}

?>