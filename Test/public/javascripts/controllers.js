/**
 * Created by young on 1/22/14.
 */
    // Managing the poll list
function PollListCtrl($scope) {
    $scope.polls = [];
}
// Voting / viewing poll results
function PollItemCtrl($scope, $routeParams) {
    $scope.poll = {};
    $scope.vote = function() {};
}
// Creating a new poll
function PollNewCtrl($scope) {
    $scope.poll = {
        question: '',
        choices: [{ text: '' }, { text: '' }, { text: '' }]
    };
    $scope.addChoice = function() {
        $scope.poll.choices.push({ text: '' });
    };
    $scope.createPoll = function() {};
}