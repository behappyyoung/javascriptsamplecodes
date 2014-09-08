$(document).ready(function(){
    $('div').on("contextmenu",function(e){
        alert("You've clicked right button ");
        return false;
    });
});