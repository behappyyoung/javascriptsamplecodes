/**
 * Created by young on 2/27/15.
 */

PUBNUB.init({
    publish_key: 'pub-c-6c6b1294-7fdd-4f33-aec4-41217a6d0b6c',
    subscribe_key: 'sub-c-cf0e18e6-bd43-11e4-861a-0619f8945a4f',
    uuid:'an_optional_user_uuid'
});

angular.module('PubNubAngularApp', ["pubnub.angular.service"])
    .controller('JoinCtrl', function($scope, PubNub) {
        $scope.publish = function() {
            PubNub.ngPublish({
                channel: $scope.selectedChannel,
                message: $scope.newMessage
            });
        };

        $scope.subscribe = function() {
            PubNub.ngSubscribe({channel: 'my_channel'});

            $rootScope.$on(PubNub.ngMsgEv('my_channel'), function (event, payload) {
                // payload contains message, channel, env...
                console.log('got a message event:', payload);
            });

            $rootScope.$on(PubNub.ngPrsEv('my_channel'), function (event, payload) {
                // payload contains message, channel, env...
                console.log('got a presence event:', payload);
            });
        };
});
/*
PUBNUB.ngSubscribe({
    channel: 'my_channel',
    callback: function() { console.log(arguments); }
});
    */