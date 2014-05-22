

    if(/html/.test(window.location.pathname)){
        var jsfile = window.location.pathname.replace('.html', '.js');
    }else{
        var jsfile = 'index.js';
    }

    var jsshow = true;

    document.write('<p> <br /><button id="js-showhide" onclick="jsshowhide();"> show JS file content  </button></p>');
    document.write('<div id="js-sourceText" style="display: none;"> </div>');
    var xmlhttp2;
    if(window.XMLHttpRequest){
        xmlhttp2=new XMLHttpRequest();
    }else{
        xmlhttp2=new ActiveXObject('Microsoft.XMLHTTP');
    }

    xmlhttp2.open('GET', jsfile, true);
    xmlhttp2.onreadystatechange=function(){
        var mydata = xmlhttp.response;
        mydata = mydata.split('<').join('&lt;');
        mydata = mydata.split('\n').join('<br />');
        document.getElementById('js-sourceText').innerHTML = mydata;
    };
    xmlhttp2.send();


    function jsshowhide(){
        if(jsshow){
            document.getElementById('js-sourceText').style.display = 'block';
            document.getElementById('js-showhide').innerHTML = ' hide HTML file content ';
            jsshow = false;
        }else{
            document.getElementById('js-sourceText').style.display = 'none';
            document.getElementById('js-showhide').innerHTML = ' show HTML file content ';
            jsshow = true;
        }
    }
	





	    
	




