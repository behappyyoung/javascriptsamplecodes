
jQuery(function($) {
	var jsfile = window.location.pathname.replace('.html', '.js');
	$(document.body).append('============ show file : ' + jsfile + '===========');
	$.get(jsfile, function(data) {
	    var myvar = data.split('$').join('S');
	    myvar = myvar.split('<').join('&lt;');
	    myvar = myvar.split('\n').join('<br />');
	   $(document.body).append(myvar);
	 });
});



