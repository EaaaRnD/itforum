/*
 * Local cache database
 */

function createLocalDatabase() {
    console.log("Creating Database");

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
	eventId : {
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
	favorite : {
	    type : "bool"
	}
	// lessons : {
	// type : Array,
	// elementType : String
	//required : true,
	//maxLength : 1000
	// },
	// IKKE ET ARRAY
	// prices : {
	// type : Array,
	// elementType : String
	//required : true,
	//maxLength : 1000
	// }
    });

    $data.Entity.extend("Participation", {
	id : {
	    type : "int",
	    key : true,
	    computed : true,
	    maxLength : 40
	},
	participantId : {
	    type : String,
	    maxLength : 20
	},
	eventId : {
	    type : String,
	    maxLength : 20
	}
    });

    $data.Entity.extend("Participant", {
	
	id : {
	    type : String,
	    key : true,
	    computed : false,
	    maxLength : 20
	},
	participations : {
	    type : "Array",
	    elementType: "Participation",
	    inverseProperty: "participant"
	},
	firstname : {
	    type : String,
	    maxLength : 40
	},
	lastname : {
	    type : String,
	    maxLength : 40
	},
	title : {
	    type : String,
	    maxLength : 40
	},
	imageurl : {
	    type : String,
	    maxLength : 200
	},
	email : {
	    type : String,
	    maxLength : 50
	},
	mobile : {
	    type : String,
	    maxLength : 20
	},
	linkedinurl : {
	    type : String,
	    maxLength : 200
	},
	company : {
	    type : String,
	    maxLength : 40
	},
	companyurl : {
	    type : String,
	    maxLength : 200
	},
	companyimageurl : {
	    type : String,
	    maxLength : 200
	},
	favorite : {
	    type : "bool"
	}
    });

    $data.EntityContext.extend("ITForumDatabase", {
	Events : {
	    type : $data.EntitySet,
	    elementType : Event
	},
	Participations : {
	    type : $data.EntitySet,
	    elementType : Participation
	},
	Participants : {
	    type : $data.EntitySet,
	    elementType : Participant
	}
    });

    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    if (typeof(window.indexedDB)=="undefined") {
	$data.context = new ITForumDatabase({
	    provider : 'webSql',
	    databaseName : 'ITForum',
	    dbCreation : $data.storageProviders.DbCreationType.DropTableIfChanged

	});
    } else  {
	$data.context = new ITForumDatabase({
	    provider : 'indexedDb',
	    databaseName : 'ITForum',
	    dbCreation : $data.storageProviders.DbCreationType.DropTableIfChanged
	});
    }
}

/*
 * Date formatting for event starttime
 */
function onlyDate(time) {
	var d = new Date(parseInt(time));
	var formattedDate = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
	var hours = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
	var minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
	var formattedTime = hours + ":" + minutes;

	formattedDate = "Dato: " + formattedDate;
	return formattedDate;
}

/*
 * Date formatting for event endtime
 */
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
function setLocalEvents(newEvtObjects, callback) {

    function applyPropertiesFromTo(eFrom, eTo) {
	eTo.eventId = eFrom.eventid.toString();
	eTo.title = eFrom.title;
	eTo.subtitle = eFrom.subtitle;
	eTo.date = eFrom.date;
	eTo.location = eFrom.location;
	eTo.type = eFrom.type;
	eTo.description = eFrom.description;
	eTo.url1 = eFrom.url1;
	eTo.url2 = eFrom.url2;
	eTo.organiser = eFrom.organiser;
	eTo.deadline = eFrom.deadline;
	eTo.starttime = eFrom.starttime;
	eTo.endtime = eFrom.endtime;							
	eTo.image = eFrom.image;
    };

    function storeReceivedEvents(localEvtObjects) { 

	//Create new or update objects as received
	for (var i in newEvtObjects) {
	    var found = false;
	    for (var j = 0; j < localEvtObjects.length; j++ ) {
	    	var localID = localEvtObjects[j].eventId.toString();
	    	var newID = newEvtObjects[i].eventid.toString();
	    	if (localID==newID) {
	    	    var existing = $data.context.Events.attachOrGet(localEvtObjects[j]);
	    	    applyPropertiesFromTo(newEvtObjects[i], existing);
	    	    found = true;
	    	}
	    }
	    if (!found) {
	    	var newEvent = new Event();
	    	applyPropertiesFromTo(newEvtObjects[i], newEvent);
	    	$data.context.Events.add(newEvent);
	    }
	}
	
	//Remove non-received already stored objects
	for (var j = 0; j < localEvtObjects.length; j++ ) {
	    var remove = true;
	    for (var i in newEvtObjects) {
		var localID = localEvtObjects[j].eventId.toString();
		var newID = newEvtObjects[i].eventid.toString();
	    	if (localID==newID)
	    	    remove = false;
	    }
	    if (remove)
		$data.context.Events.remove(localEvtObjects[j]);
	}

	//Save all changes
	$data.context.saveChanges({
	    success: function(){
		if (typeof callback == "function")
		    callback();
	    },
	    error: function(){
		console.log("Failed to store Event updates");
	    }
	});
    }

    $data.context.Events.toArray({
	success:storeReceivedEvents,
	error:function(){console.log("Failed to receive event list update")}
    });
}

function isParticipating(eventId) {
    var result=false;

    if (window.localStorage.getItem("user") != null) {
	var user = window.localStorage.getItem("user");
	var userEventArray = JSON.parse(user).events;
	for (var i in userEventArray) {
	    if (userEventArray[i] == eventId) {
		result=true;
	    }
	}
    }

    return result;
}

function toggleFavoriteEvent(eventId) {
    $data.context.Events.first(function predicate(event) {
	return (event.eventId==this.eventId); 
    }, {eventId: eventId}, {
	success: function(event) {
	    var existing = $data.context.Events.attachOrGet(event);
	    event.favorite=!event.favorite;
	    $data.context.saveChanges({
		success: displayEvents,
		error: function() {
		    console.log("Failed to save toggleFavoriteEvent("+eventId+")");
		}
	    });
	},
	error: function(event) {
	    console.log("Could not find event with id="+eventId+" to set favorite state"); 
	}
    });
}

function displayEvents() {

    function doDisplayEvents(eventsArray) {
	$('#eventList').empty();

	//$data.context.Events.forEach(function (Event) {
	for (var i=0 ; i<eventsArray.length ; i++) {
	    var currEvent=eventsArray[i];
	    currEvent.date = onlyDate(currEvent.date.substring(6,19));
	    
	    var imgSrc= currEvent.image!=""?currEvent.image:"img/imgArr.jpg";

	    var participating = isParticipating(currEvent.eventId);
	    var favorite = currEvent.favorite==true;
	    var icon = participating?"check":(favorite?"star":"question");
	    var theme = participating?"b":(favorite?"c":"a");

	    $('#eventList').append("<li data-theme='"+theme+"' data-icon='"+icon+"' data-id='" + currEvent.eventId + "' ><a href='#pageDetailEvent'><img height=\"100%\" src='" + imgSrc + "'><p style=\"margin: .3em 0;\"><strong>" + currEvent.title + "</strong></p><p>" + currEvent.subtitle + "</p><p>" + currEvent.date + "</p><p class='ui-li-aside'><strong id='" + currEvent.eventId + "'></strong></p></a><a href='javascript:toggleFavoriteEvent("+currEvent.eventId+")' data-theme='"+theme+"' data-rel='popup' data-position-to='window' data-transition='pop'>Stjernemarkering</a></li>");

	}; 
	$('#eventList').children('li').bind('touchstart mousedown', function(e) {
	    sessionStorage.selectedId = $(this).attr('data-id');
	});
	$('#eventList').listview("refresh");
    };

    $data.context.Events.entityContext.onReady(function () {
	$data.context.Events.toArray({
	    success: doDisplayEvents,
	    error: function () {
		console.log("Failed to load events to display");
	    }
	});
    });
}

function setMessage(toAlias, fromAlias, messageText) {
	var message = new Message();
	message.toAlias = toAlias;
	message.fromAlias = fromAlias;
	message.date = new Date();
	message.messageText = messageText;
	$data.context.Messages.add(message);
	alert(" ,touser: " + message.toAlias + " ,fromuser: " + message.fromAlias + " ,messege: " + message.messageText + " ,date: " + message.date);

	$data.context.saveChanges();
	
	showMessages(); 
	
}

function showMessages () {
	$('#messagesAttributes').empty();
	// var favPartisipantID = window.localStorage.getItem("favPartisipant");
	// alert(favPartisipantID);
	// $data.context.Messages
        // .filter("message.toAlias == "+ favPartisipantID +" || message.fromAlias =="+ favPartisipantID +"" )
        // .forEach( function(message) {
        	// alert(message.id);
           // $('#messagesAttributes').append("<li data-id='" + message.id + "' ><p><strong>" + message.messageText + "</strong></p><p>" + message.date + "</p><p>" + message.fromAlias + "</p></li>");
        // });
// 	
	// $('#messagesAttributes').listview("refresh");
// 	
	
	$data.context.Messages.forEach(function(Message) {
		
			
					$('#messagesAttributes').append("<li data-id='" + Message.id + "' ><p><strong>" + Message.messageText + "</strong></p><p>" + Message.date + "</p><p>" + Message.fromAlias + "</p></li>");
	
	
	});
	$('#messagesAttributes').listview("refresh");
  
}
function Messages(participants) {

	participants.forEach(function(participant) {

		// alert(participant.id);

		window.localStorage.setItem("favPartisipant", participant.id);

	});

}

function setFavoriteParticipant(participantId, value, callback) {
	$data.context.Participants.first(function predicate(participant) {
	    return (participant.id==this.participantId); 
	}, {participantId: participantId}, {
	    success: function(participant) {
	    	var existing = $data.context.Participants.attachOrGet(participant);
		participant.favorite=value;
		$data.context.saveChanges({
		    success: function() {
			if (typeof callback == "function")
			    callback();
		    },
		    error: function() {
			console.log("Failed to save setFavoriteParticipant("+participantId+","+value+")");
		    }
		});
	    },
	    error: function(participant) {
		console.log("Could not find participant with id="+participantId+" to set favorite state"); 
	    }
	});
}

function displayNetworkingParticipants() {

    function doDisplayNetworkingParticipants(participantsArray){
	$("#NetworkingParticipantsList").empty();
	for (var i=0 ; i<participantsArray.length ; i++) {
	    // alert(participantsArray[i].linkedinurl);

	    var imgSrc = participantsArray[i].imageurl==""?'img/person_icon.svg':participantsArray[i].imageurl;

	    var favorite = participantsArray[i].favorite==true;
	    var theme = favorite?"c":"a";
	    var icon = favorite?"star":"star-o";

	    $('#NetworkingParticipantsList').append("<li data-theme='"+theme+"' data-icon='"+icon+"' data-id='" + participantsArray[i].id + "' ><a href='#pageParticipantsDetail'><img src='"+imgSrc+"'><p><strong>" + participantsArray[i].firstname + " " + participantsArray[i].lastname + "</strong></p><p> " + participantsArray[i].title + "</p><p>" + participantsArray[i].company + "</p><a href='javascript:setFavoriteParticipant("+participantsArray[i].id+","+!(participantsArray[i].favorite)+",displayNetworkingParticipants)' data-theme='"+theme+"' data-rel='popup' data-position-to='window' data-transition='pop'>Stjernemarkering</a></li>");

	    $('#NetworkingParticipantsList').children('li').bind('touchstart mousedown', function(e) {
		sessionStorage.selectedParticipantId = $(this).attr('data-id');
	    });
	}
	$('#NetworkingParticipantsList').listview().listview('refresh');
    };

    $data.context.Participants.toArray({
	success: doDisplayNetworkingParticipants,
	error: function() {
	    console.log("Failed to load networking participants to display");
	}
    });
}

function storeParticipants(newParticipantObjects, eventId, callback) {
    var localParticipationsArray;
    var localParticipantsArray;
    var localEventObj;

    function applyPropertiesFromTo(eFrom, eTo) {
	eTo.id = eFrom.id;
	eTo.company = eFrom.company;
	eTo.companyimageurl = eFrom.companyimageurl;
	eTo.companyurl = eFrom.companyurl;
	eTo.email = eFrom.email;
	eTo.firstname = eFrom.firstname;
	eTo.imageurl = eFrom.imageurl;
	eTo.lastname = eFrom.lastname;
	eTo.linkedinurl = eFrom.linkedinurl;
	eTo.mobile = eFrom.mobile;
	eTo.profile = eFrom.profile;
	eTo.title = eFrom.title;
    }

    function storeParticipationUpdates () {

	//Create new or update participants objects as received
	for (var i in newParticipantObjects) {
	    var newID = newParticipantObjects[i].id.toString();
	    var participantObj = null;
	    for (var j = 0; j < localParticipantsArray.length; j++ ) {
	    	var localID = localParticipantsArray[j].id.toString();
	    	if (localID==newID) {
	    	    participantObj = $data.context.Participants.attachOrGet(localParticipantsArray[j]);
	    	    applyPropertiesFromTo(newParticipantObjects[i], participantObj);
	    	}
	    }
	    if (participantObj==null) {
	    	participantObj = new Participant();
	    	applyPropertiesFromTo(newParticipantObjects[i], participantObj);
	    	$data.context.Participants.add(participantObj);
	    }

	    //Add participation object if non existing
	    var participationObj = null;
	    var currEventId = localEventObj.eventId;
	    var currParticipantId = newParticipantObjects[i].id;
	    var participationObj = null;
	    for (var j=0; j<localParticipationsArray.length; j++) {
		if (currEventId==localParticipationsArray[j].eventId && currParticipantId==localParticipationsArray[j].participantId)
		    participationObj=newParticipantObjects[i];
	    }
	    if (participationObj==null) {
		participationObj = new Participation();
		participationObj.eventId=currEventId;
		participationObj.participantId=currParticipantId;
		$data.context.Participations.add(participationObj);
	    }
	}
	
	//Remove non-received already stored participation objects
	for (var j = 0; j < localParticipantsArray.length; j++ ) {
	    var remove = true;
	    var localParticipantId = localParticipantsArray[j].id;
	    for (var i in newParticipantObjects) {
		var newParticipantId = newParticipantObjects[i].id;
	    	if (localParticipantId==newParticipantId)
	    	    remove = false;
	    }
	    if (remove) {
		$data.context.Participations.filter("it.participantId=="+localParticipantId+" && it.eventId=="+eventId).toArray(function(currParticipations){
		    currParticipations.forEach(function(currParticipation) {
			$data.context.Participations.remove(currParticipation);
		    });
		});
	    }
	}

	//Save all changes
	$data.context.saveChanges({
	    success: function() {
		if (typeof callback == "function")
		    callback();
	    },
	    error: function() {
		console.log("Failed to store Participant updates");
	    }
	});
    }

    //Load event and participation from local database
    //var theEvent = $data.context.Events.filter("it.eventId=="+eventId);
    $data.context.Events.first(function(currEvent) {
	return currEvent.eventId==this.param;
    }, { param: eventId }, {
	success: function(event) {
	    localEventObj = event;
	    $data.context.Participations.filter(function(currParticipation) {
		return currParticipation.eventId == param;
	    }, {param:localEventObj.eventId}).toArray({
		success: function (tmpParticipationArray) {
		    localParticipationsArray = tmpParticipationArray;
		    $data.context.Participants.toArray({
			success: function(tmpParticipantArray) {
			    localParticipantsArray = tmpParticipantArray;
			    storeParticipationUpdates();
			},
			error: function() {
			    localParticipantsArray = new Array();
			    storeParticipationUpdates();
			    console.log("Failed to load participant objects for event "+eventId);
			}
		    });
		},
		error: function() {
		    console.log("Failed to load participation objects for event obejct");
		}
	    });
	},
	error: function() {
	    console.log("Failed to load event object for participants");
	}
    });
}

function displayParticipants(eventId) {

    function doDisplayParticipants(participantsArray){
	$("#ParticipantsList").empty();
	for (var i=0 ; i<participantsArray.length ; i++) {
	    var imgSrc = participantsArray[i].imageurl==""?'img/person_icon.svg':participantsArray[i].imageurl;

	    var favorite = participantsArray[i].favorite==true;
	    var theme = favorite?"b":"a";
	    var icon = favorite?"star":"star-o";

	    $('#ParticipantsList').append("<li data-theme='"+theme+"' data-icon='"+icon+"' data-id='" + participantsArray[i].id + "' ><a href='#pageParticipantsDetail'><img src='"+imgSrc+"'><p><strong>" + participantsArray[i].firstname + " " + participantsArray[i].lastname + "</strong></p><p> " + participantsArray[i].title + "</p><p>" + participantsArray[i].company + "</p><a href='javascript:setFavoriteParticipant("+participantsArray[i].id+","+!(participantsArray[i].favorite)+",function(){displayParticipants("+eventId+");})' data-theme='"+theme+"' data-rel='popup' data-position-to='window' data-transition='pop'>Stjernemarkering</a></li>");

	    $('#ParticipantsList').children('li').bind('touchstart mousedown', function(e) {
		sessionStorage.selectedParticipantId = $(this).attr('data-id');
	    });
	}
	$('#ParticipantsList').listview().listview('refresh');
    };

    $data.context.Participations.filter("it.eventId=="+eventId).toArray({
	success: function (tmpParticipations) {
	    participationsArray = tmpParticipations;
	    var participantCondition = "1==0";
	    for (var i=0 ; i<tmpParticipations.length ; i++)
		participantCondition += (" || it.id=="+tmpParticipations[i].participantId);
	    $data.context.Participants.filter(participantCondition).toArray({
		success: doDisplayParticipants,
		error: function() {
		    console.log("Failed to load participants to display");
		}
	    });
	},
	error: function () {
	    console.log("Failed to load participations to display");
	}
    });

}

function isParticipantFav(participantId, callback) {
	$data.context.Participants.first(function predicate(participant) {
	    return (participant.id==this.participantId && participant.favorite==true); 
	}, {participantId: participantId}, {
	    success: function(participant) {
		callback(true);
	    },
	    error: function(participant) {
		callback(false);
	    }
	});
}

/*
 * TODO
 */
$(document).on('pagebeforeshow', '#pageDetailEvent', function() {

	// $data.context.onReady(function() {
	$data.context.Events.filter(function(event) {
		return event.eventId == sessionStorage.selectedId;
	}).toArray(function(events) {
		displayEventDetails(events);
	});
	// });

});

$(document).on('pageshow', '#pageMenu', function() {
    getNewEvents();
});

$(document).on('pageshow', '#pageDetailEvent', function() {
    // $data.context.onReady(function() {
    // alert("" + sessionStorage.selectedId);
    getRemoteParticipants(sessionStorage.selectedId, function(newParticipantObjects, eventId) {
	storeParticipants(newParticipantObjects, eventId, function() {
	    displayParticipants(eventId);
	});
    });
    // });
});

$(document).on('pagebeforeshow', '#pageParticipantsDetail', function() {
    displayParticipantDetails();
});

$(document).on('pagebeforeshow', '#pageUser', function() {
    ProfileDetails();
});

$('#networkingBtn').click(function() {
	getFavoriteParticipant();
});

$(document).on('pagebeforeshow', '#pageMessages', function() {
	$data.context.Participants.filter(function(participant) {
		return participant.id == sessionStorage.selectedId;
	}).toArray(function(participant) {

		Messages(participant);
		showMessages(participant);
	});

});
