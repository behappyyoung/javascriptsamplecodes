/**
 * Created by young on 8/22/14.
 */


// Configure the MindMeld JavaScript API.
// Specify 'start' as the method to call upon initialization.
var config = {
    'appid': "db14e594d16baff563951cb9c3e636fbee543fbb",
    'onInit': start
};
MM.init(config);

// This is where things begin after the MindMeld JavaScript API is initialized.
function start() {
    console.log("MindMeld JavaScript SDK version " + MM.version + " loaded.");
    // Your application goes here
}


var credentials = {
    appsecret: 'a7314583aa871e38cdf85b5ecb27cce4ea46101d',
    simple: {
        userid: 'einstein79',
        name: 'Albert Einstein'
    }
};
MM.getToken(credentials, onTokenSuccess, onTokenError);

function onTokenSuccess () {
    console.log('Your access token was successfully retrieved: ' + MM.token + '.');
    console.log('The active user id has been set to: ' + MM.activeUserId);
}

function onTokenError (error) {
    console.log('Error getting access token:  (Type ' + error.code +
        ' - ' + error.type + '): ' + error.message + '  ' +
        'Please make sure your appid and appsecret are set correctly.');
}

var newSessionData = {
    name: 'A test session',
    privacymode: 'inviteonly'
};
MM.activeUser.sessions.post(newSessionData,
    // New session created successfully
    function (response) {
        var sessionID = response.data.sessionid;
        console.log('New session created with id ' + sessionID);
        MM.setActiveSessionID(sessionID);
    },
    // Error
    function (error) {
        console.log('Error creating new session:  (Type ' + error.code +
            ' - ' + error.type + '): ' + error.message);
    }
);

var textEntryData = {
    text: 'Sandra Bullock might win an Academy Award for Best Actress in the movie Gravity',
    type: 'text',
    weight: 1.0,
    language: 'eng' // this is not required
};
MM.activeSession.textentries.post(textEntryData);

// Subscribe to events on the custom user channel:
MM.activeUser.subscribe("CustomUserEvent", handleUpdate);

// Publish a custom event on the channel for the currently active user
MM.activeUser.publish("CustomUserEvent",
    {'field1': 'This is a custom event',
        'field2': 'published on the user channel'});

// Subscribe to events on the custom session channel:
MM.activeSession.subscribe("CustomSessionEvent", handleUpdate);

// Publish a custom event on the channel for the currently active session.
MM.activeSession.publish("CustomSessionEvent",
    {'field1': 'This is another custom event',
        'field2': 'published on the session channel'});
