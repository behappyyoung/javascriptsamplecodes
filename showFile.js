

	var jsfile = window.location.pathname.replace('.html', '.js');
	document.write('============ show file : ' + jsfile + '=========== <br />');
	var xmlhttp;
	if(window.XMLHttpRequest){
		xmlhttp=new XMLHttpRequest();
	}else{
		xmlhttp=new ActiveXObject('Microsoft.XMLHTTP');
	}
	
	xmlhttp.onreadystatechange=function(){
		if(xmlhttp.readState==4 && xmlhttp.status ==200){
			console.log(xmlhttp.response);
			var mydata = xmlhttp.response.Text;
			
			var myvar = mydata.split('$').join('S');
		    myvar = myvar.split('<').join('&lt;');
		    myvar = myvar.split('\n').join('<br />');
		   document.write(myvar);
		   
		}
		xmlhttp.open('GET', jsfile, true);
		xmlhttp.send();
	}
	
	    
	




