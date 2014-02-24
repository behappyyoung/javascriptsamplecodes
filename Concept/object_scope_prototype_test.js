/**
 * Created by young on 1/5/14.
 */
test(' object Test ', function() {

    var test1 = new testf();
    equal(test1.f2(), 'test', 'correct');

    test1.v3 = 'new3';
    var test2 = new testf();

    equal(test1.v3, 'new3', 'correct');
    equal(test2.v3, 'test3', 'correct');
    equal(test2.f4(), 'test1test', 'correct');
    equal(test2.v3, 'test3', 'correct');

});
