function onStart() {
    console.log("Running onStart");

    // Page transitioning
    jQuery.mobile.defaultPageTransition = "slide";

    // Load or create local database
    initiateDatabase();

    // Load events from local/remote database
    getNewEvents();
};

/*
 * Is run as the last javascript = Starting the app method
 */
function onBodyLoad() {
	
	/*
	 * Wait for device API libraries to load
	 */
	if (isMobile.any()) {
		document.addEventListener("deviceready", onDeviceReady, false);
	} else {
		onDeviceReady();
	}
	
};

/*
 * Device APIs are available
 */
function onDeviceReady() {
	if (isMobile.any()) {
		//React when app is pused or resumed
		document.addEventListener("pause", onPause, false);
		document.addEventListener("resume", onResume, false);

		// FastClick
		FastClick.attach(document.body);

	    // Register for receiving push notifications	
            //pushRegister();
	};
}

/*
 * When leaving app
 */
function onPause() {
	// Handle the pause event
}

/*
 * When resuming app
 */
function onResume() {
	// Handle the resume event
}

/*
 * returns true if any internet connection is available, false if not
 */
function online() {
	if (!(isMobile.any()))
		return true;

        if (typeof(navigator)!='object' || typeof(navigator.connection)!='object')
	    return false;
		
	var networkState = navigator.connection.type;

	var states = {};
	states[Connection.UNKNOWN] = 'Unknown connection';
	states[Connection.ETHERNET] = 'Ethernet connection';
	states[Connection.WIFI] = 'WiFi connection';
	states[Connection.CELL_2G] = 'Cell 2G connection';
	states[Connection.CELL_3G] = 'Cell 3G connection';
	states[Connection.CELL_4G] = 'Cell 4G connection';
	states[Connection.CELL] = 'Cell generic connection';
	states[Connection.NONE] = 'No network connection';

	if (states[networkState] == 'No network connection') {
		return false;
	} else {
		return true;
	}
}

/*
 * getNewEvents is called from service when new eventlist is needed
 */
function getNewEvents() {

    function recursiveLoadParticipations(loadParticipationsForEvents) {
	if (loadParticipationsForEvents.length==0) {
	    return;
	};

	var currEvent = loadParticipationsForEvents.pop();
	getRemoteParticipants(currEvent.eventId, function(newParticipantObjects, eventId) {
	    storeParticipants(newParticipantObjects, eventId, function() {
		recursiveLoadParticipations(loadParticipationsForEvents);
	    });
	});	
    };


    if (online()) {
	console.log("online");
	getRemoteEvents(function(newEvtObjects){
	    setLocalEvents(newEvtObjects, function(){
		$data.context.Events.toArray({
		    success: function(eventsArray) {
			var loadParticipationsForEvents = new Array();
			for (var i=0 ; i<eventsArray.length ; i++) {
			    var currEvent = eventsArray[i];
			    if (isParticipating(currEvent.eventId))
				loadParticipationsForEvents.push(currEvent);
			}
			recursiveLoadParticipations(loadParticipationsForEvents);
		    },
		    error: function () {
			console.log("Failed to load events to update participants on");
		    }
		});
	    });
	});
    } else {
	document.addEventListener("online", getNewEvents, false);
    }
}

/*
 * create Jaydata database.
 */
function initiateDatabase() {
	createLocalDatabase(function() {
		console.log("Database created");
	});
};
