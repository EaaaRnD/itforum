// File

/*
 * TODO Det er her "service klassen skal kalde"
 */

/*
 * Webservice get all events
 */

function getRemoteEvents(callback) {
	$.ajax({
		url : "http://www.itforum.dk/ws/appapi.asp?method=getevents",
		dataType : "jsonp",
		success : function(parsed_json) {
			var eventsArray = parsed_json;
			callback(eventsArray);
		},
		error : function() {
			alert('failure to access "getevents" api');
		}
	});
}

/*
 * Webservice get participants by eventid
 */
function getRemoteParticipants(eventid, callback) {
    var user = window.localStorage.getItem("user");
    var userLoginguid;
    var participantsArray = new Array();

    if (user)
	userLoginguid = JSON.parse(user).loginguid;

    if (userLoginguid) { 
	$.ajax({
	    url : "http://www.itforum.dk/ws/appapi.asp?method=getparticipants&guid=" + userLoginguid + "&eventid=" + eventid + "",
	    dataType : "jsonp",
	    success : function(parsed_json) {
		participantsArray = parsed_json;
		callback(participantsArray, eventid);
	    },
	    error : function() {
		console.log('failure to access "getparticipants" api');
		callback(participantsArray, eventid);
	    }
	});
    } else {
	console.log('No login guid registered');
	callback(participantsArray, eventid);
    }	
}
