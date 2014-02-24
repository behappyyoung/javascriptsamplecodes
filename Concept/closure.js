(function test(){
  var m = 'mmm';
  
 setTimeout(function(){console.log(m);},1000);
})();

(function test2(){
  this.m = 'mmmmmmmmmmm';
  
 setTimeout(function(){console.log(m);},1000);
})();

