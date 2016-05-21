/**
 * Created by young on 1/4/14.
 */

test('checkDuplicates() Test ', function() {
    var inputarray = ['ee', 'rr', 'tt', 'tt', 'yy'];
    equal(checkDuplicates(inputarray), true, 'input : ' + inputarray.toString() + " =>  true -  correct ");
    inputarray =['ee', 'ee', 'ee', 'rr', 'tt', 'tt', 'yy'];
    equal(checkDuplicates(inputarray), true, 'input : ' + inputarray.toString() + " =>  true -  correct ");
    inputarray =[1, 2, 4, 6, 88, 99, 6];
    equal(checkDuplicates(inputarray), true, 'input : ' + inputarray.toString() + " =>  true -  correct ");
    inputarray =[1, 2, 3, 4, 5, 6, 88, 99, 8];
    equal(checkDuplicates(inputarray), false, 'input : ' + inputarray.toString() + " =>  false -  correct ");
});