/* LAHMACUN GLOBAL SCRIPTS */

var $ = jQuery.noConflict();

/* Touch detect */
var deviceAgent = navigator.userAgent.toLowerCase();
var isTouchDevice = Modernizr.touch || (deviceAgent.match(/(iphone|ipod|ipad)/) || deviceAgent.match(/(android)/)  || deviceAgent.match(/(iemobile)/) || deviceAgent.match(/iphone/i) || deviceAgent.match(/ipad/i) || deviceAgent.match(/ipod/i) || deviceAgent.match(/blackberry/i) || deviceAgent.match(/bada/i));

function is_touch_device() {
/*
if(window.matchMedia("(any-pointer: coarse)").matches) {
    // touchscreen
    //console.log( "touch!" );
    $("html").addClass("ismobile");
}
 */

if (isTouchDevice) {
	//Do something touchy
	$('a').off('hover');
    $("html").addClass("ismobile");
} else {
	//Can't touch this
	$("html").addClass("notmobile");
}

}

function escapeHtml(unsafe) {
    return unsafe
         /*
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;")
         .replace(/–/g, "&#8211;");
         */
         .replace("&#8211;", "—")
         .replace("&amp;", "and")
         .replace("&lt;", "-")
         .replace("&gt;", "-")
         .replace("&quot;", "”")
         .replace("&#039;", "‘");
 }

function openAllExternalBlank() {
$('#main a:not(.swipebox)').each(function() {
   var a = new RegExp('/' + window.location.host + '/');
   if(!a.test(this.href)) {
       $(this).click(function(event) {
           event.preventDefault();
           event.stopPropagation();
           window.open(this.href, '_blank');
       });
       $(this).attr('target','_blank');
   }
});
}

function swipeboxGalleryFixer() {
	var X = 0; // set a global var
	$('.swipebox').each(function() { //for each swipebox
	  X += 1; //increment the global var by 1
	  $(this).attr('rel', 'gallery-' + X); // set the rel attribute to gallery- plus the value of X
	  $(this).attr('target', '');
	});
}

function set_home_class(scope){
    if (scope.pathname == "/"  &&  scope.hash.length <= 1  &&  scope.search.length <= 1) {
        jQuery("body").addClass("home");
        // console.log("home");
    } else {
        jQuery("body").removeClass("home");
    }
}


// A $( document ).ready() block.
$( document ).ready(function() {

    // console.log( "ready!" );
    is_touch_device();
    openAllExternalBlank();
    swipeboxGalleryFixer();

    // popstate event handler for browser back button
    window.addEventListener("popstate", function(e) {
        var loc = document.location;

        $("#main").load(loc.href + " #primary", function(responseText) {
            var newtitle = escapeHtml(responseText.match(/<title>([^<]*)/)[1]);
            document.title = newtitle;
            openAllExternalBlank();
            swipeboxGalleryFixer();
            set_home_class(document.location);
        });
    });

    // check if is on home an add class
    set_home_class(document.location);


    /* AJAX link click */
    jQuery(document).on("click", "#page a[target!='_blank']:not(a[href^='#']):not(.swipebox):not(.showsopen)", function(e){
        var link = jQuery(this).attr("href");
        // var title = jQuery(responseHtml).filter('title').text();
        // console.log(link);

        jQuery("#main").load( link + " #primary", function(responseText) {
            var newtitle = escapeHtml(responseText.match(/<title>([^<]*)/)[1]);
            document.title = newtitle;
            openAllExternalBlank();
            swipeboxGalleryFixer();
            //$("#site-navigation-toggle.toggled").trigger("click"); //automatically collapses open show menu on mobile
            }
        );
        e.preventDefault();
        history.pushState({}, null, link);
        // jQuery(document).find("title").text(jQuery(responseHtml).filter('title').text());
        set_home_class(document.location);
        jQuery(".main-navigation ul.menu li:hover > ul").hide();

    });



    /*jQuery(document).on("click", ".site-title a", function(e){
        jQuery("body").addClass("home");
    });*/


	// Main-menu toggler
	$(document).on("click", "html.ismobile nav.main-navigation li.menu-item-has-children a", function(e){
		$(this).parentsUntil("ul").find("ul.sub-menu").toggle();
		e.preventDefault;
	})


// Dates Sorter

var dateobj = new Date();
var ndateobj = dateobj.getDay() || 8 - 1;
var gooddateobj = ndateobj - 1;
var datedifference = 7 - gooddateobj;
		// console.log(ndateobj);
		// console.log(gooddateobj);
		// console.log(datedifference);

window.onfocus = function() {
		var Cdateobj = new Date();
		var Cndateobj = Cdateobj.getDay() || 8 - 1;
		var Cgooddateobj = Cndateobj - 1;

		// console.log(gooddateobj);
		// console.log(Cgooddateobj);

if ( Cgooddateobj !== gooddateobj && $("body").hasClass("home") ) {
		location.reload();
}

};

// var $monday = $(".day").eq(0);
// var $lastday = $(".day").eq(6);
// var $today = $(".day").eq(gooddateobj);

function sortDates( callbackFunction ) {
	$(".day").not(".sorted").addClass("notsorted");
	$(".day.notsorted").each(function(i){
	// console.log(i);
	if ( i < gooddateobj ) {
		$(this).appendTo($("#endofweek"));
	}
	$(".day").removeClass("notsorted").addClass("sorted");
	});

	callbackFunction();

}

function dateWriteSchedule() {
	const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var i = 0;
	$(".schedulewrap .sorted > h3:not(.addedDate)").each(function(i){
		var nextday = new Date(dateobj.getFullYear(),dateobj.getMonth(),dateobj.getDate()+i);
		var $dateformat = "<div class='scheddate'>" + monthNames[nextday.getMonth()] + " " + nextday.getDate() + "</div>";
		$(this).addClass("addedDate").append($dateformat);
		i++;
	})

}

// var nextday = new Date(dateobj.getFullYear(),dateobj.getMonth(),dateobj.getDate()+1);
// console.log(nextday);


$( document ).on("ajaxComplete", function(){
		sortDates( dateWriteSchedule );
});

$( ".shows-block" ).ready(function(){
		sortDates( dateWriteSchedule );
});

// prevent Shows menu clicking
$(".menu-lahma-menu-container li.menu-item-has-children > a").removeAttr("href").css({'cursor': 'pointer'}).addClass("showsopen");


    // A $( document ).ready() block end
});
