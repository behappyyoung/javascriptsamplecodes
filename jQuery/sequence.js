
$("<div></div>").queue(function(next){
      $('#div').html('test1');
      next();
}).delay(1000).queue(function(next){
      $('#div').html('test2');
      next();
}).delay(1000).queue(function(next){
      $('#div').html('test3');
      next();
});
