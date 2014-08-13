var textresult = '<br />';

Object.prototype.jack ='jack';

var array = [1,2];

textresult += Object.jack + '<br />';

textresult += typeof array + '<br />';

textresult += array.jack + '<br />';

textresult += array.length + '<br />';

for ( var i = (array.length-1);i>=0;i-- ){
    textresult += array[i] + '<br />';
}

for (var j in array){

    textresult += array[i] + '<br />';
}


document.getElementById('result').innerHTML = textresult;