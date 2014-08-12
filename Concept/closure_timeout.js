(function test(){
  var m = 3;
  
 setTimeout(function(){document.getElementById('div').innerHTML = m ; },100);
})();


function test2(){
  var n = 3;
    return function () {
        return ++n;
    };
}


setTimeout(function(){
    var temp = test2(3);
    var tempn = temp();
     document.getElementById('div2').innerHTML = tempn ;
},100);