/*
 * The MIT License (MIT)
 * 
 * Copyright (c) <2004> <Business Academy Aarhus>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
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
