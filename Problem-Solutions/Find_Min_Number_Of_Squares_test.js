/**
 * Created by young on 4/18/16.
 */

test('getNumber() Test ', function() {
    equal(getNumber(19), '3', 'input : 19  output 3 ==> correct ');
    equal(getNumber(5), '2', 'input : 5  output 2 ==> correct ');
    equal(getNumber(20), '2', 'input : 20  output 2 ==> correct ');
});