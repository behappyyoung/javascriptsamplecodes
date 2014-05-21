<?php

if ($handle = opendir('.')) {
    while (false !== ($entry = readdir($handle))) {
        if (($entry != ".") && ($entry != "..") && (is_dir($entry))&&(stripos($entry, '.')===false)&&(stripos($entry, 'cgi-bin')===false)) {
            $text[] = "<a href='./$entry/' > $entry /</a>" ;
        }
    }
    sort($text);
    echo implode('<br />', $text);
    closedir($handle);
}

include_once('footer.html');
?>
