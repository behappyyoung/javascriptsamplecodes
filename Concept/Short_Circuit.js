/**
 * Created by young on 3/10/15.
 */
// undefined test
var displayText ='';
var name = person && "Jane Doe";

displayText += 'person ='+person+'<br />';
displayText += 'var name = person && "Jane Doe";  => name : ' + name + '<br />';

name = person || "John Doe";

displayText += 'var name = person || "John Doe";  => name : ' + name + '<br />';


// true test
var person = true;

displayText += '<br /> person ='+person+'<br />';
displayText += 'var name = person && "Jane Doe";  => name : ' + name + '<br />';


name = person || "John Doe";

displayText += 'var name = person || "John Doe";  => name : ' + name + '<br />';

// false test
person = false;

name = person && "Jane Doe";

displayText += '<br /> person ='+person+'<br />';
displayText += 'var name = person && "Jane Doe";  => name : ' + name + '<br />';



name = person || "John Doe";

displayText += 'var name = person || "John Doe";  => name : ' + name + '<br />';


person = 'Young Park';

name = person && "Jane Doe";

displayText += '<br /> person => '+person+'<br />';
displayText += 'var name = person && "Jane Doe";  => name : ' + name + '<br />';

name = person || "John Doe";

displayText += 'var name = person || "John Doe";  => name : ' + name + '<br />';

document.getElementById('display').innerHTML = displayText;