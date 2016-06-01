<?php
if ($handle = opendir('.')) {
    while (false !== ($entry = readdir($handle))) {
        if (($entry != ".")) {
            if(is_dir($entry)){
                $text1[] =  "<a href='./$entry/' > $entry / </a> " ;
            }else{
                $text2[] = "<a href='./$entry' > $entry </a> " ;
            }

        }
    }
    sort($text1);
    sort($text2);
    echo implode('<br />', $text1).' <br />======== <br />'.implode('<br />', $text2);
    closedir($handle);
}

?>


