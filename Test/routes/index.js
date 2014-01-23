
/*
 * GET home page.
 */
/*     original
exports.index = function(req, res){
  res.render('index', { title: ' Nodejs / Express / jQeury / AngularJS Testing ' });
};
    */

var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost', 'pollsapp');
var PollSchema = require('../models/Poll.js').PollSchema;
var Poll = db.model('polls', PollSchema);
exports.index = function(req, res) {
    res.render('index', {title: 'Polls -  Nodejs / Express / jQeury / AngularJS Testing'});
};
// JSON API for list of polls
exports.list = function(req, res) {
    Poll.find({}, 'question', function(error, polls) {
        res.json(polls);
    });
};
// JSON API for getting a single poll
exports.poll = function(req, res) {
    var pollId = req.params.id;
    Poll.findById(pollId, '', { lean: true }, function(err, poll) {
        if(poll) {
            var userVoted = false,
                userChoice,
                totalVotes = 0;
            for(c in poll.choices) {
                var choice = poll.choices[c];
                for(v in choice.votes) {
                    var vote = choice.votes[v];
                    totalVotes++;
                    if(vote.ip === (req.header('x-forwarded-for') || req.ip)) {
                        userVoted = true;
                        userChoice = { _id: choice._id, text: choice.text };
                    }
                }
            }
            poll.userVoted = userVoted;
            poll.userChoice = userChoice;
            poll.totalVotes = totalVotes;
            res.json(poll);
        } else {
            res.json({error:true});
        }
    });
};
// JSON API for creating a new poll
exports.create = function(req, res) {
    var reqBody = req.body,
        choices = reqBody.choices.filter(function(v) { return v.text != ''; }),
        pollObj = {question: reqBody.question, choices: choices};
    var poll = new Poll(pollObj);
    poll.save(function(err, doc) {
        if(err || !doc) {
            throw 'Error';
        } else {
            res.json(doc);
        }
    });
};

// Socket API for saving a vote
exports.vote = function(socket) {
    socket.on('send:vote', function(data) {
        var ip = socket.handshake.headers['x-forwarded-for'] ||
            socket.handshake.address.address;
        Poll.findById(data.poll_id, function(err, poll) {
            var choice = poll.choices.id(data.choice);
            choice.votes.push({ ip: ip });
            poll.save(function(err, doc) {
                var theDoc = {
                    question: doc.question, _id: doc._id, choices: doc.choices,
                    userVoted: false, totalVotes: 0
                };
                for(var i = 0, ln = doc.choices.length; i < ln; i++) {
                    var choice = doc.choices[i];
                    for(var j = 0, jLn = choice.votes.length; j < jLn; j++) {
                        var vote = choice.votes[j];
                        theDoc.totalVotes++;
                        theDoc.ip = ip;
                        if(vote.ip === ip) {
                            theDoc.userVoted = true;
                            theDoc.userChoice = { _id: choice._id, text: choice.text };
                        }
                    }
                }
                socket.emit('myvote', theDoc);
                socket.broadcast.emit('vote', theDoc);
            });
        });
    });
};