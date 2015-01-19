/**
 * Created by young on 5/19/14.
 */
angular.module('animateApp', ['ngAnimate'])
    .controller('selCtrl', selCtrl)
    .controller('slideCtrl', slideCtrl);


function selCtrl($scope) {
    $scope.items = ['settings', 'home', 'other'];
    $scope.selection = $scope.items[0];
}

function slideCtrl($scope, $interval){
    $scope.quote = 4;
    $interval( function(){
        $scope.quote = ($scope.quote <  4 )? $scope.quote+1 : 1;
    }, 2000);
}