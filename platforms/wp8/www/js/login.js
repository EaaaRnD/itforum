var username;
var password;

checkLogin();
sessionStorage.loggedInNotAutoLoggedIn == null;
function getChallenge() {
	$.ajax({
		url : "http://www.itforum.dk/ws/appapi.asp?method=getchallenge&login=" + window.localStorage.getItem("username") + "",
		dataType : "jsonp",
		success : function(parsed_json) {
			var hash = CryptoJS.SHA1(parsed_json.challenge + CryptoJS.SHA1(window.localStorage.getItem("username") + "" + window.localStorage.getItem("password")));
			login(hash);
		},
		error : function() {
			alert('failure to access challenge');
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

function login(hash) {
	$.ajax({
		url : "http://www.itforum.dk/ws/appapi.asp?method=login&response=" + hash + "",
		dataType : "jsonp",
		success : function(parsed_json) {
			window.localStorage.setItem("profile", parsed_json.loginguid);
			window.localStorage.setItem("user", JSON.stringify(parsed_json));
			var user = JSON.parse(window.localStorage.getItem("user"));
			
			/*
			 * Check if pushRegister exits, which it only does using serviceOnMobile, not serviceInBrowser
			 */
			// if (typeof pushRegister == 'function') { 
  				// pushRegister(user.id);
			// }
			
			// if (isMobile.Android || isMobile.iOS) { 
				// alert("test");
  				// pushRegister(user.id);
			// }
			
			// pushRegister(user.id);

			checkLogin();

			if (window.localStorage.getItem("profile") != "loggedOut" || window.localStorage.getItem("profile") === null) {
				$.mobile.navigate("#pageMenu");
				document.getElementById('username').value = '';
				document.getElementById('password').value = '';
				$('#loginError').html("");

			} else {
				$('#loginError').html("Email eller kodeord er forkert");
			}
		},
		error : function() {
			$('#loginError').html("Email eller kodeord er forkert");
			alert('failure to access login');
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

		/*
		 * Push Unregister
		 */
		// alert("unregister");
		// pushUnregister();

	} else {
		$('#profil').show();
		$('#logind').hide();

		$('#networking').show();
		$('#blivmedlem').hide();

		// if (window.localStorage.getItem("user") != null) {
			// alert("Register!");
			// var user = window.localStorage.getItem("user");
			// var userEmail = JSON.parse(user).id;
			// /*
			 // * Push Register
			 // */
			// pushRegister(userEmail);
		// }

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


$('#loginBtn').on("click", function() {
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

		getChallenge();
	}
	getNewEvents();
});

$('#logoutBtn').on("click", function() {
	window.localStorage.setItem("profile", "loggedOut");
	window.localStorage.setItem("autologincheckbox", "NotChecked");
	checkLogin();

	getNewEvents();
});

