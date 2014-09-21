/*
 * The MIT License (MIT)
 * 
 * Copyright (c) <2014> <Business Academy Aarhus>
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

var username;
var password;

checkLogin();
sessionStorage.loggedInNotAutoLoggedIn == null;
function getChallenge(callback) {
    var username = window.localStorage.getItem("username");
    var password = window.localStorage.getItem("password");

	$.ajax({
		url : "http://www.itforum.dk/ws/appapi.asp?method=getchallenge&login=" + username + "",
		dataType : "jsonp",
		success : function(parsed_json) {
			var hash = CryptoJS.SHA1(parsed_json.challenge + CryptoJS.SHA1(window.localStorage.getItem("username") + "" + password));
			login(hash, callback);
		},
		error : function() {
			alert('failure to access challenge');
		    if (typeof callback == "function")
			callback();
		}
	});

}

function logout() {
    logoutCredentials();
    checkLogin();
    $.mobile.navigate("#pageMenu");
}

function logoutCredentials() {
    window.localStorage.setItem("profile", "loggedOut");
    window.localStorage.removeItem("user");
    window.localStorage.setItem("password", "");
    window.localStorage.setItem("username", "");
}

function login(hash, callback) {
	$.ajax({
		url : "http://www.itforum.dk/ws/appapi.asp?method=login&response=" + hash + "",
		dataType : "jsonp",
		success : function(parsed_json) {
			window.localStorage.setItem("profile", parsed_json.loginguid);
			window.localStorage.setItem("user", JSON.stringify(parsed_json));
			var user = JSON.parse(window.localStorage.getItem("user"));
		    if (typeof callback == "function")
			callback();
		},
		error : function() {
			$('#loginError').html("Email eller kodeord er forkert");
			alert('failure to access login');
		    if (typeof callback == "function")
			callback();
		}
	});
}

//glemme ting, adgangskode og username og profile og ting gem i localstorage
function checkLogin() {

	if (window.localStorage.getItem("autologincheckbox") == 'NotChecked' && sessionStorage.loggedInNotAutoLoggedIn != "loggedIn") {
	    logoutCredentials();
	};

	if (window.localStorage.getItem("profile") == 'loggedOut' || window.localStorage.getItem("profile") === null) {
		$('#logind').show();
		$('#profil').hide();

		$('#blivmedlem').show();
		$('#networking').hide();

	} else {
		$('#profil').show();
		$('#logind').hide();

		$('#networking').show();
		$('#blivmedlem').hide();

		if (window.localStorage.getItem("autologincheckbox") == 'checked' && sessionStorage.gotNewChallenge != "yesWeDid") {
			sessionStorage.gotNewChallenge = "yesWeDid";
			getChallenge();
		};

		$('#profil').bind('touchstart mousedown', function(e) {
			sessionStorage.selectedId = window.localStorage.getItem("profile");
			sessionStorage.profileSelected = '1';
		});
	}
}

function reLogin(callback) {
    getChallenge(function() {
	getNewEvents();
	if (typeof callback == "function")
	    callback();
    });
}

$('#loginBtn').on("click", function(){
    if ($('#username').val() == "" || $('#password').val() == "") {
	$('#loginError').html("Email eller kodeord mangler");
    } else {
	window.localStorage.setItem("username", $('#username').val());
	window.localStorage.setItem("password", $('#password').val());
	
	if (document.getElementById("autologincheckbox").checked) {
	    window.localStorage.setItem("autologincheckbox", "checked");
	} else {
	    window.localStorage.setItem("autologincheckbox", "NotChecked");
	    sessionStorage.loggedInNotAutoLoggedIn = "loggedIn";
	}

	reLogin(function() {
	    checkLogin();

	    if (window.localStorage.getItem("profile") != "loggedOut" || window.localStorage.getItem("profile") === null) {
		$.mobile.navigate("#pageMenu");
		document.getElementById('username').value = '';
		document.getElementById('password').value = '';
		$('#loginError').html("");

	    } else {
		$('#loginError').html("Email eller kodeord er forkert");
	    }
	});
    }
});

$('#logoutBtn').on("click", function() {
	window.localStorage.setItem("profile", "loggedOut");
	window.localStorage.setItem("autologincheckbox", "NotChecked");
	checkLogin();

	getNewEvents();
});

