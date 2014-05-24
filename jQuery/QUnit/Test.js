/**
 * Created by young on 5/23/14.
 */
module('async');

asyncTest( "asynchronous test: one second later!", function() {
    expect( 1 );

    setTimeout(function() {
        ok( true, "Passed and ready to resume!" );
        start();
    }, 1000);
});

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