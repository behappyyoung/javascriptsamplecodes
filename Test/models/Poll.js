/**
 * Created by young on 1/22/14.
 */
var mongoose = require('mongoose');
var voteSchema = new mongoose.Schema({ ip: 'String' });
var choiceSchema = new mongoose.Schema({
    text: String,
    votes: [voteSchema]
});
exports.PollSchema = new mongoose.Schema({
    question: { type: String, required: true },
    choices: [choiceSchema]
});