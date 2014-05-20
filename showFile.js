

    if(/html/.test(window.location.pathname)){
        var jsfile = window.location.pathname.replace('.html', '.js');
    }else{
        var jsfile = 'index.js';
    }

	
	document.write(' <p>============ show file : ' + jsfile + '=========== </p>');
	document.write('<div id="sourceText"> </div>');
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
			document.getElementById('sourceText').innerHTML = mydata;
	};
	xmlhttp.send();
	
	
	

	// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		console.log('The File APIs are fully supported by your browser.');
	} else {
	  console.log('The File APIs are not fully supported by your browser.');
	}
	
	    
	





	    
	




