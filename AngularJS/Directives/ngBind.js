/**
 * Created by young on 5/30/14.
 */
angular.module('bindApp', [])
    .controller('bindController', function($scope) {
        $scope.yourName = 'young';
        var updateClock = function() {
            $scope.clock = new Date();
        };
        var timer = setInterval(function() {
            $scope.$apply(updateClock);
        }, 1000);
        updateClock();
    });