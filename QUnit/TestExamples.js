/**
 * Created by young on 5/23/14.
 */

module('Basic Test : ');


test(" do basic tests", function() {
    var status;
    equal(status, undefined, "no user specified, status ");
    notEqual(status, '', "no user specified, status ");
    strictEqual(status, undefined, "no user specified, status === undefined ");
    notStrictEqual(status, '', "no user specified, status === '' ");

});


module('AsyncTest : ');

asyncTest("asyncTest & start", function() {
    expect(1);

    var actual = true;
    setTimeout(function() {
        ok(actual, " ok test after 1 second actual == true ");
        start();
    }, 1000);
});



module('AsyncTest with mockjax : ');

$.mockjax({
    url: "/user",
    //proxy: 'sample.json',
    responseText :  {
        "status" : 1,
        "user": [{
            "firstName": "Vikas",
            "lastName": "Bhagwagar"
        }, {
            "firstName": "Gaurav",
            "lastName": "Patel"
        }, {
            "firstName": "Ankur",
            "lastName": "Shah"
        }]
    },
    responseTime: 0,
    dataType: 'json'
});

asyncTest("Ajax  tests", function() {
    expect(3);

    $.getJSON("/user", function(data) {
        ok(data, "data is returned from the server");
        equal(data.status, "1", " status should be 1");
        equal(data.user[0].firstName, "Vikas", "  should be Vikas ");
        start();
    });

});