// Checks page for when results table is displayed
$( function checkForResults() {

    // If there are results, run this
    if ( $( "#table1" ).is( ":visible" ) ) {
        
        // Change headers

        $( "[data-property='courseTitle']" ).slice(0,1).text( "Basic Course Info" );  

        // Change each row
        //
        var numRows = $( "[data-property='courseTitle']" ).length;
        // Loop through each row
        for ( i = 1; i < numRows; i++ ) {
            
            // Getting data from data
            courseName = $( "[data-property='courseTitle']" ).slice(i,i+1).children("a").text();
            courseType = $( "[data-property='courseTitle']" ).slice(i,i+1).children("span").text();
            attrLength = $( "[data-property='attribute']" ).slice(i,i+1).find("span").length;
            switch(attrLength) {
                case 0:
                    break;
                // case 1:
                //     location = $( "[data-property='attribute']" ).slice(1,2).find("span").slice(0,1).text();
                //     break;
                // case 2:
                //     location = $( "[data-property='attribute']" ).slice(1,2).find("span").slice(0,1).text();
                //     courseAttr = $( "[data-property='attribute']" ).slice(1,2).find("span").slice(1,2).text();
                //     break;
            }
            instrMethod = $( "[data-property='instructionalMethod']" ).slice(i,i+1).text();
            status = $( "[data-property='status']" ).slice(i,i+1).children("span").innerText;
            remainingSpots = (status == "FULL") ? "0" : status;

            // Reformatting table
            // $( "[data-property='courseTitle']" ).slice(i,i+1).remove();
            console.log("ran on row " + i.toString());
            //var newHTML = 

        }
        setInterval(checkForResults, 5000);
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
