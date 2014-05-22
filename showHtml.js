

    if(/html/.test(window.location.pathname)){
        var curfile = window.location.pathname;
    }else{
        var curfile = 'index.html';
    }

    var show = true;

	document.write('<p> <br /><br /><br /><button id="showhide" onclick="showhide();"> show HTML file content  </button></p>');
	document.write('<div id="sourceText" style="display: none;"> </div>');
	var xmlhttp;
	if(window.XMLHttpRequest){
		xmlhttp=new XMLHttpRequest();
	}else{
		xmlhttp=new ActiveXObject('Microsoft.XMLHTTP');
	}
	
	xmlhttp.open('GET', curfile, true);
	xmlhttp.onreadystatechange=function(){
			var mydata = xmlhttp.response;
			mydata = mydata.split('<').join('&lt;');
			mydata = mydata.split('\n').join('<br />');
			document.getElementById('sourceText').innerHTML = mydata;
	};
	xmlhttp.send();


    function showhide(){
        if(show){
            document.getElementById('sourceText').style.display = 'block';
            document.getElementById('showhide').innerHTML = ' hide HTML file content ';
            show = false;
        }else{
            document.getElementById('sourceText').style.display = 'none';
            document.getElementById('showhide').innerHTML = ' show HTML file content ';
            show = true;
        }
    }
	
