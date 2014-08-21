/**
 * Making Max Heap
 */


var processText ='';
var processCount = 0;



function swap_process(arr, cur, parent){                            // recursive 
    var temp  = arr[cur];
    arr[cur] = arr[parent];
    arr[parent] = temp;
    var grandparent = Math.floor((parent-1)/2);
    processText += arr + '<br/ >';
    if((parent >= 1)&&(arr[parent]> arr[grandparent])){
        arr = swap_process(arr, parent, grandparent);
    }
    if((arr[cur]> arr[parent])){
        arr = swap_process(arr, cur, parent);
    }

    return arr;
}

function build_maxheap(arr){
    var parent ;
    var last = arr.length-1;
    for(var i=last; i>0; i--) {
        parent = Math.floor((i-1)/2);
        if(arr[i]> arr[parent]){
            arr = swap_process(arr, i, parent);

        }

    }
    return arr;
}

window.onload = function(){

var inputarray = [3, 2, 11,5,6,7,8,9,1,4,10 ];
var resultText = 'input Array : '+ inputarray.toString();
    processText += '<br /> process :  <br />';
var resultarray = build_maxheap(inputarray);

resultText += '<br /> Heap Array : '+ resultarray;



document.getElementById('result').innerHTML = resultText + processText;





};
