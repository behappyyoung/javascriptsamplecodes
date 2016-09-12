myApp.controller('myController', ['$scope', '$sce', function($scope, $sce) {
	$scope.prettyjson = JSON.stringify($scope.workflow, undefined, '\t');
	$scope.prettyjson = $scope.prettyjson.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    	$scope.prettyjson = $scope.prettyjson.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });


	$scope.deliberatelyTrustDangerousSnippet = function() {
               return $sce.trustAsHtml($scope.prettyjson);
  	};
}]);
