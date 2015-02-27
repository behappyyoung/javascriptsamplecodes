/**
 * Created by young on 2/27/15.
 */
QUnit.test(' shiftroop Test ', function(assert) {
    var testArray = [ 4,50,10,30,7,8,1,44,9,15,20 ];
    assert.equal(firstSolution(testArray), 46, 'firstSolution : [' + testArray.toString() + '] => 46');
    assert.equal(secondSolution(testArray), 46, 'secondSolution : [' + testArray.toString() + '] => 46');

    testArray = [9,8,7,6,-5,4,3,2,1,7 ];
    assert.equal(firstSolution(testArray), 12,  'firstSolution : [' + testArray.toString() + '] => 12');
    assert.equal(secondSolution(testArray), 12, 'secondSolution : [' + testArray.toString() + '] => 12');

    testArray = [9,8,70,6,5,4,3,2,1,7 ];
    assert.equal(firstSolution(testArray), 62,  'firstSolution : [' + testArray.toString() + '] => 62');
    assert.equal(secondSolution(testArray), 62, 'secondSolution : [' + testArray.toString() + '] => 62');

});