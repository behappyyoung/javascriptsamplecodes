
window.onload =function(){
    var myInput = document.getElementById('my-input');
    myInput.onkeydown  = function(){
        document.getElementById('attribute').innerHTML = myInput.getAttribute('value'); //"Name:"
        document.getElementById('property').innerHTML = myInput.value;
    };

};
