var textresult = '<br />';


var myobject = { first : 1, second : 2};

var myobject2 = { first : 1, second : 2};

textresult += 'var myobject = { first : 1, second : 2};<br />';
for (var j in myobject){
    textresult += myobject[j] + '<br />';
}

textresult += 'var myobject2 = { first : 1, second : 2};<br />';
for (j in myobject2){
    textresult += myobject2[j] + '<br />';
}


Object.prototype.jack ='jack';  // all object has jack now

textresult += '<br />Object.prototype.jack ="jack";  // all object has jack now <br />';

textresult += 'var myobject3 = { first : 1, second : 2};myobject3.jack2 = "jack2";<br />';
var myobject3 = { first : 1, second : 2};
myobject3.jack2 = 'jack2';




textresult += 'myobject;<br />';
for ( j in myobject){
    textresult += myobject[j] + '<br />';
}

textresult += 'myobject2;<br />';
for (j in myobject2){
    textresult += myobject2[j] + '<br />';
}

textresult += 'myobject3;<br />';
for (j in myobject3){
    textresult += myobject3[j] + '<br />';
}
document.getElementById('result').innerHTML = textresult;