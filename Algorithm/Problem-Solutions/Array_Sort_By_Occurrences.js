var arr = [2, 4, 2, 2, 8, 2, 2, 1,  4, 4, 5, 5, 5, 9, 7];

function usingSort(arr) {
    var a = [], b = [], prev;
    var newArray={};

    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] !== prev ) {
            newArray[arr[i]] = 1;
        } else {
            newArray[arr[i]]++;
        }
        prev = arr[i];

    }

    var sortable = [];
    for (var key in newArray)
        sortable.push([key, newArray[key]]);
    sortable.sort(function(a, b) {return a[1] - b[1]});
    prev=0;  // init
    var outputText='';
    var repeat = 0;
    for( var i=0; i<sortable.length; i++){
        repeat = sortable[i][1];
        if( repeat!== prev){
            outputText += "/" +repeat + "  :  ";
            for(var j=0; j<repeat; j++){
                outputText +=  sortable[i][0] ;
            }
            outputText += "  ,  ";
        }else{
            for(var j=0; j<repeat; j++){
                outputText +=  sortable[i][0] ;
            }
            outputText += "  ,  ";
        }

        prev = repeat;
    }
    return outputText;
}

var result = usingSort(arr);
console.log(result);
//////////////// display /////////////////////
var displayText = '<br /> ';
displayText += 'arry input : ' + arr + '<br />';
displayText += 'result : ' + result.replace(/\//g, "<br />") + '<br />';

document.getElementById('display').innerHTML = displayText;
