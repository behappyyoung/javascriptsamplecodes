

    if(/html/.test(window.location.pathname)){
        var jsfile = window.location.pathname.replace('.html', '.js');
    }else{
        var jsfile = 'index.js';
    }

    var jsshow = true;

    document.write('<p> <br /><button id="js-showhide" onclick="jsshowhide();"> show JS file content  </button></p>');
    if(! document.getElementById('js-sourceText')){
        document.write('<div id="js-sourceText" style="display: none;"> </div>');
    }

    var xmlhttp2;
    if(window.XMLHttpRequest){
        xmlhttp2=new XMLHttpRequest();
    }else{
        xmlhttp2=new ActiveXObject('Microsoft.XMLHTTP');
    }

    xmlhttp2.open('GET', jsfile, true);
    xmlhttp2.onreadystatechange=function(){
        var mydata = xmlhttp2.response;
        //mydata = mydata.replace(/document.write(.*;)/g, '--');
        mydata = mydata.replace(/</g, '&lt;');
        mydata = mydata.replace(/\n/g, '<br /> ');
        mydata = mydata.replace(/ /g, ' &nbsp;');
        document.getElementById('js-sourceText').innerHTML = '====== javascript content start ======<br />' + mydata + ' <br /><br />====== javascript content end ======<br /><br /><br />';
    };
    xmlhttp2.send();

    function jsshowhide(){
        if(jsshow){
            document.getElementById('js-sourceText').style.display = 'block';
            document.getElementById('js-showhide').innerHTML = ' hide JS file content ';
            jsshow = false;
        }else{
            document.getElementById('js-sourceText').style.display = 'none';
            document.getElementById('js-showhide').innerHTML = ' show JS file content ';
            jsshow = true;
        }
    }
	





	    
	




