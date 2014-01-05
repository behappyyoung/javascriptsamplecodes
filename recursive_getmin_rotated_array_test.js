/**
 * Created by young on 1/4/14.
 */

test('getMin() Test ', function() {
    var inputarray = [3, 4, 5,6,7,8,9,1,2 ];
    ok(getMin(inputarray, 0, inputarray.length-1),  ' input [3, 4, 5,6,7,8,9,1,2 ] works  ');
    equal(getMin(inputarray, 0, inputarray.length-1), 1, ' input [3, 4, 5,6,7,8,9,1,2 ] :  result 1 -  correct ');
    inputarray = [3, 4, 5,6,7,8,9,10,11,12,13];
    equal(getMin(inputarray, 0, inputarray.length-1), 3, ' input [3, 4, 5,6,7,8,9,10,11,12,13] :  result 3 -  correct ');

});
