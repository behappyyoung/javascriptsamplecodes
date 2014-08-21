/**
 * Heap sort algorithm.
 */


var processText ='';
var processCount = 0;

function chunk(list) {
    var chunks = [];
    for(var i=0; i<list.length; i++) {
        if(list.length % 2 == 1 && i+1 == list.length) {
            chunks.push(list[i]);
        }else {
            if(i % 2 == 0) {
            chunks.push(Math.max(list[i], list[i+1]));
            }
        }
    }
    return chunks;
}

function bubble(list) {
    var remainder = chunk(list), heap = [list];
    heap.push(remainder);
    while(remainder.length != 1) {
        remainder = chunk(remainder);
        heap.push(remainder);
    }
    return heap;
}

 function getTopIndex(thing) {
var currentIndex = 0,
value = thing[thing.length-1][0],
i = thing.length -2;

while(i != -1) {
if(!thing[i].length % 2 && currentIndex > 0) {
currentIndex--;
}

if(thing[i][currentIndex + 1] == value) {
currentIndex++;
currentIndex = i ? currentIndex << 1 : currentIndex;
} else if(currentIndex) {
currentIndex = i ? currentIndex << 1 : currentIndex;

}
i--;
}

return currentIndex;
}

 function heapSort(list) {
    var sortedList = [], listCopy = list,  heap = [],  targetLength = list.length;

    while(sortedList.length != targetLength) {
        heap = bubble(listCopy);
        sortedList.push(heap[heap.length-1][0]);
        listCopy.splice(getTopIndex(heap), 1);
    }

    return sortedList;
}

function build_maxheap(arr){
    var heaped = [];
    var temp;
    var parent ;
    for(var i=arr.length-1; i>0; i--) {
        parent = Math.floor((i-1)/2);
        if(arr[parent]<arr[i]){

            if(i%2 == 1){
                if(arr[i]>arr[i-1]){
                    temp = arr[i];
                    arr[i] = arr[i-1];
                    arr[i-1] = temp;
                }
            }else{
                if(arr[i]>arr[i-2]) {
                    temp = arr[i];
                    arr[i] = arr[i - 2];
                    arr[i - 2] = temp;
                }
            }

        }


    }
}

window.onload = function(){

var inputarray = [3, 2, 11,5,6,7,8,9,1,4,10 ];
var resultText = 'input Array : '+ inputarray.toString();
var resultarray =  heapSort(inputarray);

resultText += '<br /> sorted Array : '+ resultarray;
processText = '<br /> process :  <br />' + processText;
document.getElementById('result').innerHTML = resultText + processText;
};
