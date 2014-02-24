/**
 * Created by young on 1/5/14.
 */
function testf(){
    var v1 = 'test';
    this.v2 = 'test1'+v1;
    var f1 = function(){
        return this.v1;
    };
    this.f2 = function(){
        return v1;
    };
}

testf.prototype = {
    v3 : 'test3',
    f3 : function(){
        return this.v3;
    },
    f4 : function(){
        return this.v2;
    }
};
