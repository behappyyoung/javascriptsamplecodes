
jQuery(function($) {
	
	$('#test').change(function(){
	
	    alert('attr(): '+$(this).attr('value'));
	   alert('val(): '+$(this).val());
	    alert('prop(): '+$(this).prop('value'));
	});
	
	$('#div').click(function(){
	    alert('attr(): '+$(this).attr('value'));
	      alert('prop(): '+$(this).prop('value'));
	   alert('val(): '+$(this).val());
	  
	   $(this).prop('value', 'newdiv');
	  
	      alert('attr(): '+$(this).attr('value'));  
	    alert('prop(): '+$(this).prop('value'));
	   alert('val(): '+$(this).val());
	
	});
	
});	