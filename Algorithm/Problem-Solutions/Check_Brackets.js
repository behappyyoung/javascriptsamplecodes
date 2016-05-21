

function checkBraces(bstr){
        var braceObj={
            ')':'(',
            ']':'[',
            '}':'{'
        };
        var stackArray=[];
        for(var i=0;i<bstr.length;i++){
            if(stackArray.length > 0 && braceObj[bstr.charAt(i)]===stackArray[stackArray.length-1]){    // opposite match with last
                stackArray.pop();
            }else{
                stackArray.push(bstr.charAt(i));                 // put in stack
            }
        }
        if(stackArray.length===0){
            return 'YES';
        }else{
            return 'NO';
        }

}

function braces(barr){
    return barr.map(checkBraces);
}

var barr=['()([])([)]','{}{[[()]{}]}', '{[[[[[[]])}',')('];
console.log( barr, braces(barr) );
