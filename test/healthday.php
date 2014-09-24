<script src="http://ezpost.healthday.com/healthdayliteV9.js" type="text/javascript" charset="utf-8"></script>
<style>
    .health_article {
        width: 660px;
        /*border: 1px dotted #f00; */
        float: left;
    }
    #brightcove_video {
        width: 660px;
        /*border: 1px dotted #f00; */
        float: left;
    }
    #search_pan{
        float: left;
        width: 250px;
        /*border: 1px solid #0f0;*/
        margin-left: 10px;
    }

    #hd_a20495 {font-size:12px;color:#000000;font-weight: bold;width:560px;}
    #hd_a20495 h2 {font-size:18px;color:#000000;margin:0px;padding:0px;font-weight: bold;}
    #hd_a20495 .blurb{display:block;font-size:14px;color:#000000;font-weight: bold;}
    #hd_a20495 .image {display: none;float:left;padding-right:10px;padding-bottom:10px;border:0px;}
    #hd_a20495 .a {font-size:12px;text-decoration:underline;font-weight: bold;}

    #healthdayResults {font-family:Verdana,sans-serif;font-size:12px;width:540px;}
    #healthdayResults li {font-family:Verdana,sans-serif;font-size:12px;margin:0px;padding:0px;padding-bottom:10px;border:0px solid red;}
    #healthdayResults .blurb{font-family:Verdana,sans-serif;display:block;font-size:12px;font-style:italic;}
    #healthdayResults a {font-family:Verdana,sans-serif;font-size:12px;text-decoration:underline;font-weight: bold;}
    #healthdayResults a:hover {font-family:Verdana,sans-serif;color:#00000;font-size:12px;}

    #healthdaySearch {font-family:Verdana,sans-serif;border:0px solid grey;padding:0px;margin:0px;font-size:12px;width:300px;}
    #healthdaySearch .box {font-family:Verdana,sans-serif;width: 150px;margin-bottom:5px;vertical-align:top;}
    #healthdaySearch .button {font-family:Verdana,sans-serif;margin-left:7px;margin-top:2px;}
    #healthdaySearch .text {font-family:Verdana,sans-serif;float:left;font-size:11px;width:180px;text-transform:uppercase;padding-right:5px;padding-top:7px;text-align: center;}
    .sidebar table{width: 75%;}
    #categoriesBlock, #textBoxBlock, #topicsBlock {width: 80%;}
</style>
<?php
$search = (isset($_GET['search']))? $_GET['search'] : 'article' ;

if($search=='video'){
    $search = 'H';
}else{
    $search = 'C';
}

?>
<!-- health_results -->
<div class="health_article">

    <div id="healthdayResults" class="hdjson search2" >
      <span class="cfg" style="display: none">
        landingUrl = "http://dev.24meals.com/test/healthday_view.php";
      </span>
    </div>
</div>


<div id="search_pan">

    <table cellpadding="20">
        <tr>
            <td> </td>
            <td>
                <div id="healthdaySearch" class="searchBox2" >
            <span class="cfg" style="display: none">
              clientId = "87CDCB94";
              newsFeed = "<?php echo $search; ?>";
              landingUrl = "http://dev.24meals.com/test/";
            </span>
                </div>

            </td>
        </tr>
    </table>
</div>


