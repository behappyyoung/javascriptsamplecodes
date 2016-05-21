function getMin(inputa, start, end){

    var term = end-start;
    if(term<2){
        if(inputa[start] < inputa[end]){
            return inputa[start];
        }else{
            return inputa[end];
        }
    }
    var mid = Math.floor((start+end)/2) ;
    if(inputa[start]<inputa[mid]){
        if(inputa[mid]<inputa[end]){
            return getMin(inputa, start, mid);
        }else{
            return getMin(inputa, mid+1, end);
        }
    }else{
        return getMin(inputa, start, mid);
    }
}

window.onload = function(){

var myresult = document.getElementById('result');

var inputarray = [3, 4, 5,6,7,8,9,1,2 ];
var resultText = 'input = '+ inputarray;
resultText += '<br /> min = '+ getMin(inputarray, 0, inputarray.length-1);

myresult.innerHTML = resultText;
};
