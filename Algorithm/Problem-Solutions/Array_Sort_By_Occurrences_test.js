/**
 * Created by young on 4/18/16.
 */

test('usingSort() Test ', function() {
    inputarray =[1, 2, 4, 6, 88, 99, 6];
    equal(usingSort(inputarray), '/1  :  1  ,  2  ,  4  ,  88  ,  99  ,  /2  :  66  ,  ', 'input : ' + inputarray.toString() + " =>   -  correct ");
    inputarray =[1, 2, 3, 4, 5, 6, 88, 99, 8];
    equal(usingSort(inputarray).search(/1\s+:\s+1\s+,\s+2\s+,\s+3/), 1, 'input : ' + inputarray.toString() + " =>   -  correct ");
});