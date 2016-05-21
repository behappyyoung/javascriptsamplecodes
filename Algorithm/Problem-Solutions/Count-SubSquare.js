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
    var count = [], extra;
    count[0] = 0;
    count[1] = row;
    for(var i=2; i<=col ; i++){
        extra =  (row>=i)? row-i+1 : 0;
        count[i] = 2 * count[i-1] - count[i-2] + extra;
    }
    return count;
}

//size 1 : R * C
//size 2 : (R-1) * (C-1)
//size 3 : (R-2) * (C-2)
//..
// size m : (R-m+1) * ( C-m+1)
//count = size1 + size2 + sizem


function countSquareS(row, col){
    var min = (row<col) ? row : col;
    var count = 0;
    for(var i = 0; i<min ; i++){
        count += (row-i) * (col-i);
    }
    return count;
}
console.log('4, 6 : ' , countSquareV(4 , 6));
console.log('5, 6 : ' , countSquareV(5 , 6));

console.log('4, 6 : ' , countSquareS(4 , 6));
console.log('5, 6 : ' , countSquareS(5 , 6));


