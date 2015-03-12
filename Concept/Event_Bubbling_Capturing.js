/**
 * Created by young on 1/15/15.
 */
var divs = document.getElementsByTagName('div');

function capture() {
    document.getElementById('capture').innerHTML='capturing => ' + this.firstChild.nodeValue.trim();
}

function bubble() {
    document.getElementById('bubble').innerHTML='bubbling => ' + this.firstChild.nodeValue.trim();
}

for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', capture, true);
    divs[i].addEventListener('click', bubble, false);   // == divs[i].addEventListener('click', bubble); default
}
