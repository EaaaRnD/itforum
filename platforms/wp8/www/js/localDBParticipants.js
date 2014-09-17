// $(document).ready(function() {

/* TODO
* Check if this is first applaunch
* if(applaunchCount already exists){nothing}
* else{create database}
*/
// var applaunchCount = window.localStorage.getItem('launchCount');
//
// if (applaunchCount) {
// } else {
// window.localStorage.setItem('launchCount', 1);
//
// createLocalDatabase(function() {
// });
// }

function createLocalDatabase(callback) {

	alert("Creating DB");
	/*
	 * Participant
	 */
	$data.Entity.extend("Participant", {
		id : {
			type : "int",
			// required : true,
			key : true,
			computed : true
		},
		firstname : {
			type : String,
			// required : true,
			maxLength : 200
		},
		lastname : {
			type : String,
			// required : true,
			maxLength : 200
		},
		company : {
			type : String,
			// required : true,
			maxLength : 200,
		},
		email : {
			type : String,
			// required : true,
			maxLength : 8
		},
		profile : {
			type : String,
			// required : false,
			maxLength : 3000
		},
		linkedinurl : {
			type : String,
			// required : true,
			maxLength : 200
		},
		mobile : {
			type : String,
			// required : true,
			maxLength : 20
		},
		eventid : {
			type : String,
			// required : true,
			maxLength : 1000
		}
	});

	/*
	 * Events
	 */
	$data.Entity.extend("Event", {
		title : {
			type : String,
			//required : true,
			maxLength : 1000
		},
		subtitle : {
			type : String,
			//required : true,
			maxLength : 1000
		},
		date : {
			type : String,
			//required : true,
			maxLength : 1000
		},
		location : {
			type : String,
			//required : true,
			maxLength : 1000
		},
		type : {
			type : String,
			//required : true,
			maxLength : 1000
		},
		description : {
			type : String,
			//required : true,
			maxLength : 20000
		},
		url1 : {
			type : String,
			//required : true,
			maxLength : 1000
		},
		url2 : {
			type : String,
			//required : true,
			maxLength : 1000
		},
		tags : {
			type : Array,
			elementType : String
			//required : true,
			//maxLength : 1000
		},
		eventid : {
			type : String,
			key : true
			//computed : false
		},
		organiser : {
			type : String,
			//required : true,
			maxLength : 1000
		},
		deadline : {
			type : String,
			//required : true,
			maxLength : 1000
		},
		starttime : {
			type : String,
			//required : true,
			maxLength : 1000
		},
		endtime : {
			type : String,
			//required : true,
			maxLength : 1000
		},
		image : {
			type : String,
			//required : true,
			maxLength : 1000
		},
		lessons : {
			type : Array,
			elementType : String
			//required : true,
			//maxLength : 1000
		},
		// IKKE ET ARRAY
		prices : {
			type : Array,
			elementType : String
			//required : true,
			//maxLength : 1000
		}
	});

	$data.EntityContext.extend("ITForumDatabase", {
		Events : {
			type : $data.EntitySet,
			elementType : Event
		},
		Participants : {
			type : $data.EntitySet,
			elementType : Participant
		}
	});

	var isMobile = {
		Android : function() {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry : function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS : function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera : function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		WP8 : function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any : function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};

	// if( isMobile.Android() ) alert('Android');
	// if( isMobile.iOS() ) alert('iOS');
	// if( isMobile.Windows() ) alert('Windows');

	if (isMobile.WP8()) {;
		itForumDatabase = new ITForumDatabase({
			// provider : 'webSql',
			provider : 'indexedDb',
			databaseName : 'ITFDatabase',
			dbCreation : $data.storageProviders.DbCreationType.DropAllExistingTables

		});
	} else {
		itForumDatabase = new ITForumDatabase({
			provider : 'webSql',
			// provider : 'indexedDb',
			databaseName : 'ITFDatabase',
			dbCreation : $data.storageProviders.DbCreationType.DropAllExistingTables

		});
	}
	callback();

}

// itForumDatabase.onReady(function() {
/*
 * Date formatting
 */
function startTimeDate(time) {
	var d = new Date(parseInt(time));
	var formattedDate = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
	var hours = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
	var minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
	var formattedTime = hours + ":" + minutes;

	formattedDate = "<strong>Arrangement tidspunkt </strong>" + formattedDate + ", fra kl. " + formattedTime;
	return formattedDate;
}

function endTimeDate(starttime, endtime) {
	var result = "";
	var endtimeDate = new Date(parseInt(endtime));
	var starttimeDate = new Date(parseInt(starttime));

	var formattedDate = endtimeDate.getDate() + "-" + (endtimeDate.getMonth() + 1) + "-" + endtimeDate.getFullYear();

	var hours = (endtimeDate.getHours() < 10) ? "0" + endtimeDate.getHours() : endtimeDate.getHours();
	var minutes = (endtimeDate.getMinutes() < 10) ? "0" + endtimeDate.getMinutes() : endtimeDate.getMinutes();
	var formattedTime = hours + ":" + minutes;

	if (endtimeDate.getDate() == starttimeDate.getDate()) {
		result = " til " + formattedTime;
	} else if (endtimeDate.getDate() > starttimeDate.getDate()) {
		formattedDate = "<br> Slut " + formattedDate + ", kl. " + formattedTime;
		result = formattedDate;
	} else {
		result = "Wrong date object";
	}

	return result;
}

/*
 * Insert events in local database
 */
function setLocalEvents(eventsArray) {
	for (var i in eventsArray) {
		var event = new Event();
		event.title = eventsArray[i].title;
		event.subtitle = eventsArray[i].subtitle;
		event.date = eventsArray[i].date;
		event.location = eventsArray[i].location;
		event.type = eventsArray[i].type;
		event.description = eventsArray[i].description;
		event.url1 = eventsArray[i].url1;
		event.url2 = eventsArray[i].url2;
		// tags = eventsArray[i].tags;
		event.eventid = eventsArray[i].eventid;
		event.organiser = eventsArray[i].organiser;
		event.deadline = eventsArray[i].deadline;
		//XX REGEX EXPRESSION XX
		var numberPattern = /\d+/g;
		event.starttime = startTimeDate(eventsArray[i].starttime.match(numberPattern));

		event.endtime = endTimeDate(eventsArray[i].starttime.match(numberPattern), eventsArray[i].endtime.match(numberPattern));
		event.image = eventsArray[i].image;
		// event.lessons = eventsArray[i].lessons;
		// event.prices = eventsArray[i].prices;

		itForumDatabase.Events.add(event);
		// itForumDatabase.saveChanges();
	}
	itForumDatabase.saveChanges();
	displayEvents();
}

function getLocalEvents(callback) {
    console.log("getLocalEvents");

    $('#eventList').empty();

    itForumDatabase.Events.forEach(function(Event) {
	    // alert("event: " + Event.eventid);
	    if (!Event.image == "") {

		$('#eventList').append("<li data-id='" + Event.eventid + "' ><a href='#pageDetailEvent'><img src='" + Event.image + "'><p><strong>" + Event.title + "</strong></p><p>" + Event.subtitle + "</p><p>" + Event.starttime + "</p><p class='ui-li-aside'><strong id='" + Event.eventid + "'></strong></p></a></li>");
	    } else {
		$('#eventList').append("<li data-id='" + Event.eventid + "' ><a href='#pageDetailEvent'><img src='img/imgArr.jpg'><p><strong>" + Event.title + "</strong></p><p>" + Event.subtitle + "</p><p>" + Event.starttime + "</p><p class='ui-li-aside'><strong id='" + Event.eventid + "'></strong></p></a></li>");
	    }

	    if (window.localStorage.getItem("user") != null) {
		var user = window.localStorage.getItem("user");
		var userEventArray = JSON.parse(user).events;
		for (var i in userEventArray) {
		    if (userEventArray[i] == Event.eventid) {
			$('#' + Event.eventid + '').html("Tilmeldt");
		    }
		}
	    }

	    $('#eventList').children('li').bind('touchstart mousedown', function(e) {
		//alert('Selected Name=' + $(this).attr('data-id'));
		//bliver kaldt antalgange der er tilbage i listen mange gange
		sessionStorage.selectedId = $(this).attr('data-id');
	    });

	    $('#eventList').listview('refresh');
    });
    console.log("LocalEvents");
    //test
    // $('#eventList').listview("refresh");

    // $('#eventList').listview('refresh');

    callback();
}

/*
 * Participants TODO : Lav participant listen og detail siden, til at bruge databasen og ikke hente alle men kun dem på eventid
 */

function storeParticipants(participantsArray, eventid) {
	// alert("" + participantsArray);
	// alert("set" + eventid);
	for (var i in participantsArray) {
		// alert("setPar");
		var participant = new Participant();
		participant.firstname = participantsArray[i].firstname;
		participant.lastname = participantsArray[i].firstname;
		participant.company = participantsArray[i].company;
		participant.email = participantsArray[i].email;
		participant.profile = participantsArray[i].profile;
		participant.linkedinurl = participantsArray[i].linkedinurl;
		participant.mobile = participantsArray[i].mobile;
		participant.eventid = eventid;

		itForumDatabase.Participants.add(participant);
		itForumDatabase.saveChanges();
	}
	// alert("ikkedone");
	itForumDatabase.saveChanges();
	displayParticipants(eventid, function(){
		// alert("done");
	});
}

/*
 *
 */
function displayParticipants(eventid, callback) {
	alert("ParBeofre");
	itForumDatabase.Participants.forEach(function(Participant) {
		alert("Par");
		if (Participant.eventid == eventid) {
			alert("Par");
			$("#ParticipantsList").empty();

			$('#ParticipantsList').append("<li data-id='" + Participant.id + "' ><a href='#pageParticipantsDetail'>" + Participant.firstname + ' ' + Participant.lastname + '</li>');

			$('#ParticipantsList').children('li').bind('touchstart mousedown', function(e) {
				// sessionStorage.setItem("participant", JSON.stringify(participantsArray[i]));
				sessionStorage.selectedId = $(this).attr('data-id');
			});

			$('#ParticipantsList').listview("refresh");
		}
	});
	callback();
}

// });

/*
 * TODO
 */

$(document).on('pagebeforeshow', '#pageEventList', function() {
	itForumDatabase.onReady(function() {
		// alert("DB ready");
		// getLocalEvents();
		displayEvents(function() {
			//$('#eventList').listview("refresh");
			getRemoteEvents(setLocalEvents);
		});
	});
});

$(document).on('pagebeforeshow', '#pageDetailEvent', function() {

	itForumDatabase.onReady(function() {

		itForumDatabase.Events.filter(function(event) {
			return event.eventid == sessionStorage.selectedId;
		}).toArray(function(events) {
			displayEventDetails(events);
		});
	});

});


$(document).on('pageshow', '#pageDetailEvent', function() {
    getRemoteParticipants(sessionStorage.selectedId, storeParticipants);
});

// $(document).on('pagebeforeshow', '#pageParticipantsDetail', function() {
// ParticipantDetails(participantsArray);
//
// });

$(document).on('pagebeforeshow', '#pageUser', function() {
	ProfileDetails();
});

// });
