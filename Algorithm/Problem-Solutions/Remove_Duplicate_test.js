/**
 * Created by young on 1/4/14.
 */

test('removeDuplicates() Test ', function() {
    var inputarray = ['ee', 'rr', 'tt', 'tt', 'yy'];
    deepEqual(removeDuplicates(inputarray), ['ee', 'rr', 'tt', 'yy'], " input ['ee', 'rr', 'tt', 'tt', 'yy'] :  ['ee', 'rr', 'tt', 'yy'] -  correct ");
    inputarray =['ee', 'ee', 'ee', 'rr', 'tt', 'tt', 'yy'];
    deepEqual(removeDuplicates(inputarray), ['ee', 'rr', 'tt', 'yy'], " input ['ee', 'ee', 'ee', 'rr', 'tt', 'tt', 'yy'] :  ['ee', 'rr', 'tt', 'yy'] -  correct ");
    inputarray =[1, 4, 6, 88, 99, 6, 6, 4];
    deepEqual(removeDuplicates(inputarray), ["1","4","6","88","99"], ' input [1, 4, 6, 88, 99, 6, 6, 4] : result   ["1","4","6","88","99"] - correct');

});
