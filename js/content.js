// Checks page for when results table is displayed
$( function checkForResults() {

    // If there are results, run this
    if ( $( "#table1" ).is( ":visible" ) ) {
        
        // Change headers

        $( "[data-property='courseTitle']" ).slice(0,1).text( "Basic Course Info" );  
        $( "[data-property='attribute']" ).slice(0,1).text("Location");

        // Change each row
        //
        var numRows = $( "[data-property='courseTitle']" ).length;
        // Loop through each row
        for ( i = 1; i < numRows; i++ ) {
            
            // Getting data from data
            courseName = $( "[data-property='courseTitle']" ).slice(i,i+1).children("a").text();
            courseType = $( "[data-property='courseTitle']" ).slice(i,i+1).children("span").text();
            // attrLength = $( "[data-property='attribute']" ).slice(i,i+1).find("span").length;
            // switch(attrLength) {
            //     case 0:
            //         break;
            //     case 1:
            //         location = $( "[data-property='attribute']" ).slice(i,i+1).find("span").text();
            //         break;
            //     case 2:
            //         location = $( "[data-property='attribute']" ).slice(i,i+1).find("span").text();
            //         courseAttr = $( "[data-property='attribute']" ).slice(i,i+1).find("span").text();
            //         break;
            // }
            attributes = $( "[data-property='attribute']" ).slice(i-1,i).detach();
            courseInfo = $( "[data-property='courseTitle']" ).slice(i-1,i);
            attributes.insertAfter(courseInfo);
            instrMethod = $( "[data-property='instructionalMethod']" ).slice(i,i+1).text();
            status = $( "[data-property='status']" ).slice(i,i+1).find("span").text();
            remainingSpots = (status == "FULL") ? "0" : status;
            instructorName = $( "[data-property='instructor']" ).slice(i,i+1).find("a").text();
            instructorEmail = $( "[data-property='instructor']" ).slice(i,i+1).find("a").attr("href");
            // Reformatting table
            $( "[data-property='courseTitle']" ).slice(i,i+1).remove();
            console.log("Row " + i.toString() + ": " + remainingSpots + " seats available with " + instructorName);
            //var newHTML = 
            // newHTML.insertBefore(attributes);
        }
        setInterval(checkForResults, 500);
    }
    // If there are no results, check again in half a second
    else {

        setTimeout(checkForResults, 500);

    }

});

/* Load the database*/
function loadDataBase() {
	console.log("database loaded");
	sql = window.SQL;
	loadBinaryFile('grades.db', function (data) {
		var sqldb = new SQL.Database(data);
		grades = sqldb;
	});
}
