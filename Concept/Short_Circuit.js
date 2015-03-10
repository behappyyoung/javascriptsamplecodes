/**
 * Created by young on 3/10/15.
 */
var person = true;
var displayText ='';
var name = person && "Jane Doe";

displayText += 'person => true<br />';
displayText += 'var name = person && "Jane Doe";  => name : ' + name + '<br />';


name = person || "John Doe";

displayText += 'var name = person || "John Doe";  => name : ' + name + '<br />';

person = false;

name = person && "Jane Doe";

displayText += '<br /> person => false<br />';
displayText += 'var name = person && "Jane Doe";  => name : ' + name + '<br />';

name = person || "John Doe";

displayText += 'var name = person || "John Doe";  => name : ' + name + '<br />';

document.getElementById('display').innerHTML = displayText;