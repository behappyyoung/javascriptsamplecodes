/**
 * Making Max Heap
 */


var processText ='';
var processCount = 0;

function showTree(arr, cur, parent){
    var levelcount = 1;
    var lowcount  = 1;
    var returnText = '<br />&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ';
    var fnbsp = '';
    var arrayText;
    var bnbsp = '&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;';
    for(var i=0; i< arr.length; i++) {
        for(var j =0; j < 9-(levelcount*2); j++){
            fnbsp += '&nbsp;';
        }

        if(lowcount>levelcount){
            returnText += '<br />' + fnbsp;
            levelcount = levelcount*2 ;
            lowcount = 1;
            fnbsp = '';
            bnbsp = bnbsp.substr(14);
        }
        lowcount++;

        if((i==cur)||(i==parent)){
            arrayText = '<b style="color:red;">' + arr[i] + '</b>';
        }else{
            arrayText = arr[i];
        }
        returnText += arrayText +bnbsp ;
    }
    return returnText;
}

function swap_process(arr, cur, parent){                            // recursive
    var temp  = arr[cur];
    arr[cur] = arr[parent];
    arr[parent] = temp;
    var grandparent = Math.floor((parent-1)/2);
    processText += (processCount++) + ' : ============== ' + showTree(arr, cur, parent) + '<br/ >';
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

var inputarray = [3, 2, 11,5,6,7,8,9,1,4,10,12 ];
var resultText = 'input Array : '+ inputarray.toString() + showTree(inputarray);
    processText += '<br /> process :  <br />';
var resultarray = build_maxheap(inputarray);

resultText += '<br /> Heap Array : '+ resultarray;



document.getElementById('result').innerHTML = resultText + processText;





};
