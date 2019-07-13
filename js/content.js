// Checks page for when results table is displayed
$( function checkForResults() {

    // If there are results, run this
    if ( $( "#table1" ).is( ":visible" ) ) {
        
        // Change headers
        $( "[data-property='courseTitle']" ).slice(0,1).text( "Basic Course Info" )        
        // Change each row
        var numRows = $( "[data-property='courseTitle']" ).length;
        for ( i = 1; i < numRows; i++ ) {
            
            var courseName = $( "[data-property='courseTitle']" ).slice(i,i+1).children("a").text()
            $( "[data-property='courseTitle']" ).slice(i,i+1).children("a").text( "Lauren is Lame" )
            $( "[data-property='courseTitle']" ).slice(i,i+1).children("span").text( "" )

        }
        checkForResults;
    }
    // If there are no results, check again in 50 milliseconds
    else {

        setTimeout(checkForResults, 50);

    }

});