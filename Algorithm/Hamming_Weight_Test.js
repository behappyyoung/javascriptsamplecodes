/**
 * Created by young on 2/27/15.
 */
QUnit.test(' shiftroop Test ', function(assert) {

    assert.equal(shiftroop(68719476735), 32, 'shiftroop(68719476735) = 32');
    assert.equal(popcount_32(68719476735), 32, 'popcount_32(68719476735) = 32');
    assert.equal(popcount_64(68719476735), 32, 'popcount_64(68719476735) = 32');

    equal(shiftroop(5), 2, 'shiftroop(5) = 2');
    equal(popcount_32(5), 2, 'popcount_32(5) = 2');
    assert.notEqual(popcount_64(5), 2, 'popcount_64(5) != 2');

    equal(shiftroop(2147483647), 31, 'shiftroop(2147483647) = 31');
    equal(popcount_32(2147483647), 31, 'popcount_32(2147483647) = 31');
    assert.notEqual(popcount_64(2147483647), 31, 'popcount_64(2147483647) != 31');

    equal(shiftroop(4294967295), 32, 'shiftroop(4294967295) = 32');
    equal(popcount_32(4294967295), 32, 'popcount_32(4294967295) = 32');
    equal(popcount_64(4294967295), 32, 'popcount_64(4294967295) = 32');


    equal(shiftroop(4294967296), 1, 'shiftroop(4294967296) = 1');
    equal(popcount_32(4294967296), 1, 'popcount_32(3147483647) = 1');
    equal(popcount_64(4294967296), 1, 'popcount_64(4294967296) = 1');


    equal(shiftroop(5294967296), 13, 'shiftroop(5294967296) = 13');
    equal(popcount_32(5294967296), 13, 'popcount_32(5294967296) = 13');
    equal(popcount_64(5294967296), 13, 'popcount_64(5294967296) = 13');

});
