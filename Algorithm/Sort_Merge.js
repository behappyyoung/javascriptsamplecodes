var processText ='';
var processCount = 0;
/**
 * Merge sort algorithm.
 */

function mergeSort (arr) {
    //processText += '<br />  input array =>  '+arr.toString()+ '<br />';

    //step 1 - recursively divide array until we are down to a single element
    if (arr.length <= 1) {
        return arr;
    }
    var middleIndex = Math.floor(arr.length/2);
    processText += ' <br />  step '+(processCount++)+' - devide middle index : '+middleIndex+'  /left : right => [ '+ arr.slice(0, middleIndex)+' ] : ['+arr.slice(middleIndex) +' ] <br />';
    var leftSorted = mergeSort(arr.slice(0, middleIndex));
    var rightSorted = mergeSort(arr.slice(middleIndex));
    //step 2 - merge the divided arrays
    return mergeArray(leftSorted, rightSorted);
}

/**
 * Helper function to #mergeSort-- mergeArray the left and right array into a single sorted array.
 */

function mergeArray(left, right) {
    var sortedArr = [];
    //current left and right index being compared
    var leftInd = 0;
    var rightInd = 0;
    while (leftInd < left.length || rightInd < right.length) {
        if (rightInd === right.length || left[leftInd] <= right[rightInd]) {
            sortedArr.push(left[leftInd]);
            ++leftInd;
        } else {
            sortedArr.push(right[rightInd]);
            ++rightInd;
        }
    }
    processText += '<br />   step '+(processCount++)+' - Merge / left : right  => [ '+left.toString() +'] : [ '+ right.toString()+' ] / merge sorted : ' + sortedArr.toString() + '<br />';
    return sortedArr;
}
window.onload = function(){

var inputarray = [3, 2, 11,5,6,7,8,9,1,4,10 ];
var resultText = 'input Array : '+ inputarray.toString();
var resultarray =  mergeSort(inputarray);

resultText += '<br /> sorted Array : '+ resultarray;
processText = '<br /> process :  <br />' + processText;
document.getElementById('result').innerHTML = resultText + processText;
};
