

    if(/html/.test(window.location.pathname)){
        var jsfile = window.location.pathname.replace('.html', '.js');
    }else{
        var jsfile = 'index.js';
    }


    document.write('<button id="js-showhide" onclick="showhide();"> show JS file content  </button>');
    document.write('<div id="js-sourceText" style="display: none;"> </div>');
    var xmlhttp;
    if(window.XMLHttpRequest){
        xmlhttp=new XMLHttpRequest();
    }else{
        xmlhttp=new ActiveXObject('Microsoft.XMLHTTP');
    }

    xmlhttp.open('GET', jsfile, true);
    xmlhttp.onreadystatechange=function(){
        var mydata = xmlhttp.response;
        mydata = mydata.split('<').join('&lt;');
        mydata = mydata.split('\n').join('<br />');
        document.getElementById('js-sourceText').innerHTML = mydata;
    };
    xmlhttp.send();


    function showhide(){
        if(show){
            document.getElementById('js-sourceText').style.display = 'block';
            document.getElementById('js-showhide').innerHTML = ' hide HTML file content ';
            show = false;
        }else{
            document.getElementById('js-sourceText').style.display = 'none';
            document.getElementById('js-showhide').innerHTML = ' show HTML file content ';
            show = true;
        }
    }
	





	    
	




