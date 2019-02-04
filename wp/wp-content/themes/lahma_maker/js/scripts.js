/* LAHMACUN GLOBAL SCRIPTS */

var $ = jQuery.noConflict();


function is_touch_device() {
if(window.matchMedia("(any-pointer: coarse)").matches) {
    // touchscreen
    //console.log( "touch!" );
    $("html").addClass("ismobile");
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
$('a:not(.swipebox)').each(function() {
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
    jQuery(document).on("click", "#page a[target!='_blank']:not(a[href^='#']):not(.swipebox)", function(e){
        var link = jQuery(this).attr("href");
        // var title = jQuery(responseHtml).filter('title').text();
        // console.log(title);
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

    
    
        
    // A $( document ).ready() block end    
});


