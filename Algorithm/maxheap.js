/**
 * Making Max Heap
 */


var processText = '<br /> <br />process :  <br /> <br />';
var processCount = 1;

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
    processText += (processCount++) + ' : ============== current :  ' + arr[cur] + showTree(arr, cur, parent) + '<br/ >';
    var temp  = arr[cur];
    arr[cur] = arr[parent];
    arr[parent] = temp;
    processText += (processCount++) + ' : ============== current :  ' + arr[cur] + showTree(arr, cur, parent) + '<br/ >';
    var grandparent = Math.floor((parent-1)/2);

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
    processText +=  ' : ============== start :  '+ showTree(arr, '','') + '<br/ >';

    for(var i=last; i>0; i--) {
        parent = Math.floor((i-1)/2);
        if(arr[i]> arr[parent]){
            arr = swap_process(arr, i, parent);
        }else{
            processText += (processCount++) + ' : ==============  current :  ' + arr[i] + '<br/ >';
        }

    }

    processText +=  ' : ============== done :  '+ showTree(arr, '','') + '<br/ >';
    return arr;
}

window.onload = function(){

    var inputarray = [3, 12, 11,5,15, 16,6,7,8,9,1,13, 14, 4,10,2, 17, 18, 19, 20 ];
    var resultText = 'input Array : '+ inputarray.length + ' - ' + inputarray.toString() + showTree(inputarray);

    var resultarray = build_maxheap(inputarray);

    resultText += '<br /> Heap Array : '+ resultarray;



    document.getElementById('result').innerHTML = resultText + processText;





};
