

Object.prototype.jack ='jack';

var array = [1,2];



var textresult = '<br />';


textresult += 'Object.jack : ' + Object.jack + '<br />';

textresult +='typeof array : '+ typeof array + '<br />';

textresult += 'array.jack : ' + array.jack + '<br />';

textresult += 'array.length : ' + array.length + '<br />';

textresult += 'array loop with for ( var i = (array.length-1);i>=0;i-- ){textresult += array[i] ;}' +'<br />';

for ( var i = (array.length-1);i>=0;i-- ){
    textresult += array[i] + '<br />';
}

textresult += 'array loop with for (var j in array){textresult += array[j] ;}'+ '<br />';

for (var j in array){
    textresult += array[j] + '<br />';
}


document.getElementById('result').innerHTML = textresult;