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

<div style="height:300px;">

</div>

<br />



    <script type="text/javascript" src="googlead.js">   </script>
    <script type="text/javascript" src="http://pagead2.googlesyndication.com/pagead/show_ads.js"></script>

