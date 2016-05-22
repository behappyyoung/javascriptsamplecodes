/**
 * Created by youngsug on 5/21/2016.
 */

// count square from R ( Row )  * C ( Col) matrix

function getSqareCoordBySize(row, col, size){
    var coordinate=[];
    for(var r=0;r<=row-size; r++ ){
          for(var c=0;c<=col-size;c++){
              coordinate.push({r:r, c:c, s:size});
          }
    }
    return coordinate;
}

function getSquareCoordAll(row, col){
    var min = (row<col) ? row : col;
    var total=[], bySize;
    for(var i=1; i<=min;i++){
        bySize = getSqareCoordBySize(row, col, i);
        for(var sub=0; sub<bySize.length;sub++){
            total.push(bySize[sub]);
        }
    }
    return total;
}
//var givenSquare =  getSquareCoordAll(4,4);
//console.log(givenSquare, givenSquare.length);

var givenMarks = [{r:1, c:1}, {r:1, c:2}];
function getAllCoordinate(startR, startC, endR, endC){
    var coordinate=[];
    for(var r=startR;r<endR; r++ ){
        for(var c=startC;c<endC;c++) {
            coordinate.push({r: r, c: c});
        }
    }
    return coordinate;
}

function hasGraySquare( row, col, size){
    var currentSquare = getAllCoordinate(row, col, row+size, col+size);
    for(var i=0; i<currentSquare.length; i++){
            for(var j=0; j<givenMarks.length;j++){
                if(JSON.stringify(currentSquare[i]) == JSON.stringify(givenMarks[j])){
                    return true;
                }
            }
    }
    return false;
}
function getSqareCoordBySizeByMark(row, col, size){
    var coordinate=[];
    for(var r=0;r<=row-size; r++ ){
        for(var c=0;c<=col-size;c++) {
            if( ! hasGraySquare( r, c, size)){
                coordinate.push({r: r, c: c, s: size});
            }
        }
    }
    return coordinate;
}

function getSquareCoordAllByMark(row, col){
    var min = (row<col) ? row : col;
    var total=[], bySize;
    for(var i=1; i<=min;i++){
        bySize = getSqareCoordBySizeByMark(row, col, i);
        for(var sub=0; sub<bySize.length;sub++){
            total.push(bySize[sub]);
        }
        //total.push(JSON.stringify(bySize));
    }
    return total;
}

var orginSquare =  getSquareCoordAll(3,3);
var givenSquare =  getSquareCoordAllByMark(3,3);

console.log(orginSquare, orginSquare.length)
console.log(givenSquare, givenSquare.length, givenMarks);
