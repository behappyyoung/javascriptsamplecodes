<?php
/**
 * Created by PhpStorm.
 * User: young
 * Date: 5/20/14
 * Time: 4:02 PM
 */


if ($handle = opendir('.')) {
    while (false !== ($entry = readdir($handle))) {
        if (($entry != ".") && ($entry != "..") &&(stripos($entry, 'php')===false)) {
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

<div style="height:300px;">

</div>


<script>
    google_ad_client = "ca-pub-6948397161034250";
    /* google ad 1 */
    google_ad_slot = "2654334543";
    google_ad_width = 728;
    google_ad_height = 90;

    // analytics

    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-51196113-1', '24meals.com');
    ga('send', 'pageview');

</script>
<script type="text/javascript" src="http://pagead2.googlesyndication.com/pagead/show_ads.js"></script>