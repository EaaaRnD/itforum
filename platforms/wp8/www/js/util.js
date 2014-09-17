/*
 * Test if running in Mobile enviroment, e.g. call isMobile.any()
 */
isMobile = {
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
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.WP8());
	}
};

/*
 * Initialize application
 */
if (isMobile.any()) {
    console.log("Mobile");
    jQuery(document).on("mobileinit", function(){
	onStart();
    });
} else {
    console.log("Desktop");
    jQuery(document).ready(function(){
	onStart();
    });
};

/*
 * Handle swipe right and back button as back action in app
 */
function pageBackAction() {
    if (typeof(navigator) != 'undefined' && typeof(navigator.app) != 'undefined' && typeof(navigator.app.backHistory) == 'function')
        navigator.app.backHistory();
    else
        history.go(-1);
}

$(function(){
  $(window).on( "swiperight", function ( event ){
               pageBackAction();
               });
  });

/*
 * Handle swipe left as page forward action in app
 */
function pageForwardAction() {
    if (typeof(navigator) != 'undefined' && typeof(navigator.app) != 'undefined' && typeof(navigator.app.forwardHistory) == 'function')
        navigator.app.forwardHistory();
    else
        history.go(1);
}

$(function(){
  $(window).on( "swipeleft", function ( event ){
               pageForwardAction();
               });
  });


/*
 * Handle swipe left as page forward action in app
 */
function ShowDialog(params) {
	if (typeof(params)!="object" || params==null)
		return;
		
	message = (params.hasOwnProperty('message') && typeof(params.message)=="string" && params.message!=null)?params.message:"";
	$("#DialogPageMessage").html("<br/>"+message);
	
	$("#DialogPageButtons").html("<br/>");
	if (params.hasOwnProperty('buttonNames') && $.isArray(params.buttonNames))
		var buttonNames=params.buttonNames;
	else
		var buttonNames=["OK"];
	for (var i=0 ; i<buttonNames.length; i++) {
		$("#DialogPageButtons").append('<a id="ShowDialog'+i+'">'+buttonNames[i]+'</a>');
		$("#ShowDialog" + i).button().click(function() {
			var buttonName = $(this).contents().eq(0).text();
			var arrayPosition = buttonNames.indexOf(buttonName);
			if (params.hasOwnProperty('callback') && typeof (params.callback) == "function" && params.callback != null) {
    			    setTimeout(function () {
				params.callback(arrayPosition + 1);
			    }, 100);
			}
			$('#DialogPage').dialog('close');
		});
	}

	title = (params.hasOwnProperty('title') && typeof(params.title)=="string" && params.title!=null)?params.title:(buttonNames.length>1?"?":"!");
	$("#DialogPageTitle").html("<h1><center>"+title+"</center></h1>");

	$.mobile.changePage( "#DialogPage", { role: "dialog" } );	
	$('#DialogPage').trigger("pagecreate");
	$('#DialogPageTitle a').hide();
	
}


