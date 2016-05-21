/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * Edited by Matt DePero
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */

// this can be obtained in the settings menu of your Canvas profile
var CANVAS_ACCESS_TOKEN = "CANVAS_ACCOUNT_ACCESS_TOKEN_GOES_HERE";

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);


        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
        ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId +
        ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId +
        ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if ("GetGrades" === intentName) {
        getGrades(intent, session, callback);
    } else if ("GetToDo" === intentName) {
        getToDo(callback);
    } else if ("AMAZON.HelpIntent" === intentName) {
        getWelcomeResponse(callback);
    } else if ("AMAZON.StopIntent" === intentName || "AMAZON.CancelIntent" === intentName) {
        handleSessionEndRequest(callback);
    } else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
        ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "Welcome to the Canvas skill created for ACM at Miami University. Would you like to hear your current grades or your to do list?";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "You may ask for names or you may ask for your to do list.";
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    var cardTitle = "Session Ended";
    var speechOutput = "Thank you for trying the Alexa Skills Kit sample. Have a nice day!";
    // Setting this to true ends the session and exits the skill.
    var shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

/**
 * Sets the color in the session and prepares the speech to reply to the user.
 */
function getGrades(intent, session, callback) {
    
    var https = require('https');
    console.log("About to submit request");
    var req = https.get("https://canvas.instructure.com/api/v1/courses?access_token="+CANVAS_ACCESS_TOKEN+"&include=total_scores&enrollment_type=student", function (res) {
        console.log("Connection established...");
        var data="";
        res.on('data', function (chunk) {
            console.log("Got chunk: "+chunk);
            data += chunk;
        });
        res.on('end',function() {
            console.log("About to parse all data");
            var cardTitle = intent.name;
            var sessionAttributes = {};
            var repromptText = null;
            var shouldEndSession = true;
            var speechOutput = "I had an error processing your request.";
            try {
                var retData = JSON.parse(data);
                speechOutput = "Here are your grades in your current classes. ";
                for(var i = 0; i < retData.length; i++){
                    speechOutput += "In "+retData[i].name + " you have a " + retData[i].enrollments[0].computed_current_score+" percent. ";
                }
            } catch (err) {
                speechOutput = "I recieved an error trying to get your data.";
            }
            callback(sessionAttributes,
            buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });
    }).on('error', function(e) {
        console.error(e);
    });
    
}

function getToDo(intent, session, callback) {
    
    var https = require('https');
    console.log("About to submit request");
    var req = https.get("https://canvas.instructure.com/api/v1/courses?access_token="+CANVAS_ACCESS_TOKEN+"&include=total_scores&enrollment_type=student", function (res) {
        console.log("Connection established...");
        var data="";
        res.on('data', function (chunk) {
            console.log("Got chunk: "+chunk);
            data += chunk;
        });
        res.on('end',function() {
            console.log("About to parse all data");
            var cardTitle = intent.name;
            var sessionAttributes = {};
            var repromptText = null;
            var shouldEndSession = true;
            var speechOutput = "I had an error processing your request.";
            try {
                var retData = JSON.parse(data);
                speechOutput = "Here are your grades in your current classes. ";
                for(var i = 0; i < retData.length; i++){
                    speechOutput += "In "+retData[i].name + " you have a " + retData[i].enrollments[0].computed_current_score+" percent. ";
                }
            } catch (err) {
                speechOutput = "I recieved an error trying to get your data.";
            }
            callback(sessionAttributes,
            buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        });
    }).on('error', function(e) {
        console.error(e);
    });
    
}

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: "SessionSpeechlet - " + title,
            content: "SessionSpeechlet - " + output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}