/**
 * Created by young on 2/27/15.
 */
var myText='number / toString(2) / toString(8) /toString(16) <br />';
for(var i=0; i< 65536; i++){
    myText +=i +' / '+ i.toString(2) + ' / '+ i.toString(8) + ' / '+i.toString(16) + '<br />';
}

document.getElementById('display').innerHTML = myText;