/**
 * Created by youngsug on 5/21/2016.
 */

// count square from R ( Row )  * C ( Col) matrix

//S(1) = Row
//S(2) = S(1) + S(1) + Row - 1
//s(3) = S(2) + S(2)  - S(1) + Row - 2
//...
//S(Col) = 2 * S(Col-1)+ S(Col-2) + Row - (Col-1)


function countSquareV(row, col){
    var count = [];
    count[0] = 0;
    count[1] = row;
    for(var i=2; i<=col ; i++){
        count[i] = 2 * count[i-1] - count[i-2] + (row - (i - 1) || 0);
    }
    return count;
}

console.log('4, 6 : ' , countSquareV(4 , 6));
console.log('5, 6 : ' , countSquareV(5 , 6));


