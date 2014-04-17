
jQuery(function($) {
	$("<div></div>").queue(function(next){
		var jsfile = window.location.pathname;
		$(document.body).append('============ show file : ' + jsfile + '=========== <br />');
		$.get(jsfile, function(data) {
		    var myvar = data.split('$').join('S');
		    myvar = myvar.split('<').join('&lt;');
		    myvar = myvar.split('\n').join('<br />');
		   $(document.body).append(myvar);
		 });
	      next();
	}).delay(100).queue(function(next){
		jsfile = window.location.pathname.replace('.html', '.js');
		$(document.body).append('============ show file : ' + jsfile + '=========== <br />');
		$.get(jsfile, function(data) {
		    var myvar = data.split('$').join('S');
		    myvar = myvar.split('<').join('&lt;');
		    myvar = myvar.split('\n').join('<br />');
		   $(document.body).append(myvar);
		 });
	      next();
	});
	
	
	
	
});



