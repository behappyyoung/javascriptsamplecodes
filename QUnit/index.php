<?php
/**
 * Created by Young Park.
 * Date: 7/28/14
 *
 */


if ($handle = opendir('.')) {
    while (false !== ($entry = readdir($handle))) {
        if (($entry != ".") && ($entry != "..") &&(stripos($entry, 'php')===false)) {
            if(is_dir($entry)){
                //$text1[] =  "<a href='./$entry/' > $entry / </a> " ;
            }else if(stripos($entry, 'html')!==false){
                $htmlfiles[] = "<a href='./$entry' > $entry </a> " ;
            }else{
                $text2[] = "<a href='./$entry' > $entry </a> " ;
            }

        }
    }

    echo '========== Test Cases ======= <br /><br />'.implode('<br />', $htmlfiles);
    echo '<br /><br />========== Supports Files  =======<br /> <br />'.implode('<br />', $text2);

    closedir($handle);
}

?>

