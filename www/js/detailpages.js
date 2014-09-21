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

function dateAndStartTime(time) {
	var d = new Date(parseInt(time));
	var formattedDate = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
	var hours = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
	var minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
	var formattedTime = hours + ":" + minutes;

	formattedDate = "Dato: " + formattedDate + " Tidspunkt: " + formattedTime;
	return formattedDate;
}

function FillInDriveTo(spanId, location) {
    if (typeof(google)!="object" || typeof(google.maps)!="object") {
	return;
    };

    $('<input id="navbutton" ui-min="true" type="button" value="Kørselsvejledning">').appendTo("#"+spanId);

    var navbutton = $("#navbutton");
    navbutton.button({icon: "navigation"});

    navbutton.click(function(){
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address': location}, function(results, status) {
	    if (status == google.maps.GeocoderStatus.OK) {
		var lat = results[0].geometry.location.k;
		var lon = results[0].geometry.location.B;
		
		if (isMobile.iOS()) {
                    window.location = "maps:daddr="+lat+","+lon;
		} else  {
		    directions.navigateTo(""+lat, ""+lon);                     
		}
	    } else {
		var msg = 'Geocode "'+location+'" failed: ' + status;
		console.error(msg);
		ShowDialog({
		    message: msg
		});
	    }
	});
    });
}

function displayEventDetails(events) {

    events.forEach(function(event) {
	
	event.date = dateAndStartTime(event.date.substring(6,19));

	$("#pageDetailEvent #eventAttributes").empty();

	$("#pageDetailEvent #eventAttributes").append("<h2 id='eventTitle'>" + event.title + "</h2>");
	$("#pageDetailEvent #eventAttributes").append("<img id='eventImage' src=" + event.image + ">");
	$("#pageDetailEvent #eventAttributes").append("<h3 id='eventSubTitle'>" + event.subtitle + "</h3>");
        
        if (window.localStorage.getItem("user") != null) {
            var user = window.localStorage.getItem("user");
            var userEventArray = JSON.parse(user).events;
            var login = JSON.parse(user).loginguid;
            var participating = "false";
            for (var i in userEventArray) {
                if (userEventArray[i] == event.eventId) {
                    $("#pageDetailEvent #eventAttributes").append("<a href='#pageParticipantsList' id='participants_btn' name='participants' class='ui-btn'>Deltagere</a>");
                    participating = "true";
                }
            }
            if (participating == "false") {
                $("#pageDetailEvent #eventAttributes").append("<a href=\"javascript:window.open('" + event.url2 + "&guid=" + login + "','_blank','location=no')\" class='ui-btn'>Deltag i arrangementet</a>");
            }
            
        } else {
            //TODO Hvad skal der sker hvis man ikke er logget ind overhovedet?
        }

	$("#pageDetailEvent #eventAttributes").append("<h3 id='eventDate'>" + event.date + "</h3>");
	// $("#pageDetailEvent #eventAttributes").append(event.starttime);
	// $("#pageDetailEvent #eventAttributes").append(event.endtime);
	var driveToId = "DriveTo"+event.eventId;
	$("#pageDetailEvent #eventAttributes").append("<p id='eventLocation'>" + event.location + "<span id=\""+driveToId+"\"></span></p>");
	FillInDriveTo(driveToId, event.location);
	$("#pageDetailEvent #eventAttributes").append("<p id='eventDescription'>" + event.description + "</p>");

	

    });
}

function ProfileDetails() {
    var user = window.localStorage.getItem("user");
    var us = JSON.parse(user);
    
    function openURL(urlString){
	myURL = encodeURI(urlString);
	window.open(myURL, '_blank');
    }

    $("#pageUser #userAttributes").empty();

    $("#pageUser #userAttributes").append("<a href=\"javascript:window.open('http://www.itforum.dk/ret_profil.asp','_blank','location=no')\" class='ui-btn ui-btn-inline ui-icon-gear ui-btn-icon-right'>Rediger bruger</a>");
    
    $("#pageUser #userAttributes").append("<a id=\"logoutBtn\" class=\"ui-btn ui-btn-inline\" href=\"javascript:logout();\" data-rel=\"close\">Log ud</a>");
    
    var imgSrc = (us.imageurl == "")?'img/person_icon.png':'http://www.itforum.dk'+us.imageurl;
    $("#pageUser #userAttributes").append("<table><tr><td><img src='"+imgSrc+"'></td></tr></table>");

    if (us.firstname != "" && us.lastname !=""){
        $("#pageUser #userAttributes").append("<table><tr><td><h2>Navn:</h2></td><td><h2  id='userFirstName'> " + us.firstname + " " + us.lastname + "</h2></td></tr></table>");
    }
    if (us.title != ""){
        $("#pageUser #userAttributes").append("<table><tr><td><h3>Titel:</h3></td><td><p id='userProfileTitle'> " + us.title + "</p></h3></td></tr></table>");
    }
    
    if (us.company != ""){
        $("#pageUser #userAttributes").append("<table><tr><td><h3>Firma:</h3></td><td><p id='userCompany'> " + us.company + "</p></h3></td></tr></table>");
    }
    //$("#pageUser #userAttributes").append("<a href="+us.companyurl+">"+us.companyurl+"</a>");
    //<a href='#' onclick='openURL("http://www.urlyouwant")/>
    //$("#pageUser #userAttributes").append("<table><tr><td><a href='#' onclick='openURL("+us.companyurl+")'>Firma logo</a></td></tr></table>");
    
    if (us.linkedinurl !=""){
        $("#pageUser #userAttributes").append("<a href=\"javascript:window.open('"+us.linkedinurl+"','_blank','location=no')\">Linkedin profil</a>");
    }
    // if (us.companyimageurl == "") {
    // $("#pageUser #userAttributes").append("<table><tr><td><img src='img/person_icon.svg'></td></tr></table>");
    // } else {
    // $("#pageUser #userAttributes").append("<table><tr><td><img src='" + us.companyimageurl + "'></td></tr></table>");
    // }
    if (us.profile != ""){
        $("#pageUser #userAttributes").append("<table><tr><td><h3>Profil:</h3></td></tr><tr><td><p id='userProfileText'> " + us.profile + "</p></h3></td></tr></table>");
    }
    
    if(us.mobile != ""){
        $("#pageUser #userAttributes").append("<table><tr><td><h3>Mobiltelefon:</h3></td><td><p id='userMobileNo'> " + us.mobile + "</p></td></tr></table>");
    }
    
    if (us.email != ""){
        $("#pageUser #userAttributes").append("<table><tr><td><h3>Email:</h3></td><td><p id='userEmail'> " + us.email + "</p></td></tr></table>");
    }
}

function sendSms(number) {
    var message = "";
    //var number = sessionStorage.SmsDestination;
    //var intent = "INTENT"; 
    var intent = "INTENT"; //leave empty for sending sms using default intent
    var success = function () { 
	console.log('Message sent successfully'); 
	ShowDialog({
	    message: "SMS afsendt!",
	    callback: pageBackAction
	});
    };
    var error = function (e) { 
	console.log('Message Failed:' + e); 
	ShowDialog({
	    message: "SMS fejlede: "+e,
	    callback: pageBackAction
	});
    };
    sms.send(number, message, intent, success, error);
}

function displayParticipantDetails() {

    $data.context.Participants.first(function(currParticipant){
	return currParticipant.id==this.selectedParticipantId;
    },{selectedParticipantId: sessionStorage.selectedParticipantId}, function(participant) {
	$("#pageParticipantsDetail #userAttributes").empty();


	var imgSrc = (participant.imageurl=="")?'img/person_icon.png':participant.imageurl;
	$("#pageParticipantsDetail #userAttributes").append("<img style=\"maxheight:150px\" src='"+imgSrc+"'>");

	$("#pageParticipantsDetail #userAttributes").append("<table><tr><td><h2>Navn:</h2></td><td><h2  id='userFirstName'> " + participant.firstname + " " + participant.lastname + "</h2></td></tr></table>");

	if (participant.linkedinurl != "") {
		$("#pageParticipantsDetail #userAttributes").append("<a href=\"javascript:window.open('"+participant.linkedinurl+"','_blank','location=no')\">Linkedin profil</a>");
	}

	$("#pageParticipantsDetail #userAttributes").append("<table><tr><td><h3>Titel:</h3></td><td><h3 id='userTitle'>" + participant.title + "</h3></td></tr></table>");

	$("#pageParticipantsDetail #userAttributes").append("<table><tr><td><h3>Firma:</h3></td><td><h3 id='userTitle'>" + participant.company + "</h3></td></tr></table>");

	if (participant.profile) {
	    $("#pageParticipantsDetail #userAttributes").append("<table><tr><td><h3>Profil:</h3></td></tr><tr><td><p id='userProfileText'> " + participant.profile + "</p></h3></td></tr></table>");
	}

	if (participant.mobile) {
	    var smsHref;
	    if (isMobile.Android) {
		//sessionStorage.SmsDestination = participant.mobile;
		//$("#SmsRecipient").html(participant.firstname+" "+participant.lastname);
		//smsHref = "#pageWriteSms";
		smsHref = 'javascript:sendSms('+participant.mobile+')';
	    } else {
		smsHref = "sms:"+participant.mobile;
	    }

	    $("#pageParticipantsDetail #userAttributes").append("<table><tr><td><h3>Mobiltelefon:</h3></td><td><p id='userMobileNo'> " + participant.mobile + "</p></td></tr></table>");
	    $("#pageParticipantsDetail #userAttributes").append('<p><a class="ui-btn ui-icon-edit ui-btn-icon-left" data-mini=\"true\" href="'+smsHref+'">Send SMS</a><a class="ui-btn ui-icon-phone ui-btn-icon-left" data-mini=\"true\" href="tel:'+participant.mobile+'">Ring op</a></p>');
	}

	// $("#pageParticipantsDetail #userAttributes").append("<button class='ui-btn ui-corner-all' onclick='addFavPar()'>Add</button>");
	
	isParticipantFav(participant.id, function(isFavorite){

	    $('#favoriteToggle').val(isFavorite?"on":"off");
	    $("#favoriteToggle").change(function() {
		var state = $(this).val();
		setFavoriteParticipant(participant.id, state=="on", sessionStorage.selectedId);
	    });
	    $('#favoriteToggle').slider("refresh");
	});

	// MÅ IKKE VISES
	// $("#pageParticipantsDetail #userAttributes").append("<table><tr><td><h3>Email:</h3></td><td><p id='userEmail'> " + participant.email + "</p></td></tr></table>");
    });
}

// function addFavPar(participant) {
	// setFavoriteParticipant(participant);
	// alert("efterset");
// }
