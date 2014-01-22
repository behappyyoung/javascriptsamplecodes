/**
 * Created by young on 1/22/14.
 */
    // Managing the poll list
function PollListCtrl($scope, Poll) {
    $scope.polls = Poll.query();
}
// Voting / viewing poll results
function PollItemCtrl($scope, $routeParams, Poll) {
    $scope.poll = Poll.get({pollId: $routeParams.pollId});
    $scope.vote = function() {};
}
// Creating a new poll
function PollNewCtrl($scope, $location, Poll) {
    $scope.poll = {
        question: '',
        choices: [ { text: '' }, { text: '' }, { text: '' }]
    };
    $scope.addChoice = function() {
        $scope.poll.choices.push({ text: '' });
    };
    $scope.createPoll = function() {
        var poll = $scope.poll;
        if(poll.question.length > 0) {
            var choiceCount = 0;
            for(var i = 0, ln = poll.choices.length; i < ln; i++) {
                var choice = poll.choices[i];
                if(choice.text.length > 0) {
                    choiceCount++
                }
            }
            if(choiceCount > 1) {
                var newPoll = new Poll(poll);
                newPoll.$save(function(p, resp) {
                    if(!p.error) {
                        $location.path('polls');
                    } else {
                        alert('Could not create poll');
                    }
                });
            } else {
                alert('You must enter at least two choices');
            }
        } else {
            alert('You must enter a question');
        }
    };
}