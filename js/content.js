// Checks page for when results table is displayed
$( function checkForResults() {

    // If there are results, run this
    if ( $( "#table1" ).is( ":visible" ) ) {
        
        $( "#table1" ).find("th").children()[0].innerText = "Did it work?"
    
    }
    // If there are no results, check again in 3 seconds
    else {

        setTimeout(checkForResults, 3000);

    }



});