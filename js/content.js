var grades;
loadDataBase();

// Checks page for when results table is displayed
$( function checkForResults() {

    // If there are results, run this
    if ( $( "#table1" ).is( ":visible" ) ) {
        
        if (!($( "[data-content='grades']" ).length)) {

            if (!($( "[data-property='gradeDistrTitle']" ).length) ) {
                // Change headers
                titleHTML = '<th scope="col" data-sort-direction="disabled" data-property="gradeDistr" xe-field="gradeDistr" style="width: 15%;" data-hide="phone"><div class="title" title="Grade Distribution" style="width: auto;">Grade Distribution</div><div class="sort-handle" style="height:100%;width:5px;cursor:w-resize;"></div></th>';
                var gradeDistributionTitle = $( titleHTML );
                $( "[data-property='instructor']" ).slice(0,1).after(gradeDistributionTitle);
                titleHTML = '<th scope="col" data-sort-direction="disabled" data-property="RMP" xe-field="RMP" style="width: 15%;" data-hide="phone"><div class="title" title="Rate My Professors" style="width: auto;">Rate My Professors</div><div class="sort-handle" style="height:100%;width:5px;cursor:w-resize;"></div></th>';
                var rmpTitle = $( titleHTML );
                $( "[data-property='gradeDistr']" ).slice(0,1).after(rmpTitle);
                $("[data-property='RMP']" ).slice(0,1).width(140);
                moveAttrTitle = $( "[data-property='attribute']" ).slice(0,1).detach();
                moveTermTitle = $( "[data-property='termType']" ).slice(0,1).detach();
                $( "[data-property='status']" ).slice(0,1).after(moveTermTitle);
                $( "[data-property='status']" ).slice(0,1).after(moveAttrTitle);
                $( "[data-property='courseReferenceNumber']" ).slice(0,1).width(50);
                $( "[data-property='courseTitle']" ).slice(0,1).text( "Basic Course Info" );
                $( "[data-property='courseTitle']" ).slice(0,1).width(200);
                $( "[data-property='meetingTime']" ).slice(0,1).width(250);
            }

            // Loop through each row        
            var numRows = $( "[data-property='courseTitle']" ).length - 1;
            console.log('numRows ' + numRows.toString());
            for ( i = 1; i <= numRows; i++ ) {
                
                // Getting data from table
                courseName = $( "[data-property='courseTitle']" ).slice(i,i+1).children("a").text();
                courseType = $( "[data-property='courseTitle']" ).slice(i,i+1).children("span").text();
                attributes = $( "[data-property='attribute']" ).slice(i,i+1);
                crn = $( "[data-property='courseReferenceNumber']" ).slice(i,i+1).text();
                subj = $( "[data-property='subjectDescription']" ).slice(i,i+1).text();
                courseNum = $( "[data-property='courseNumber']" ).slice(i,i+1).text();
                section = $( "[data-property='sequenceNumber']" ).slice(i,i+1).text();
                hours = $( "[data-property='creditHours']" ).slice(i,i+1).text();
                status = $( "[data-property='status']" ).slice(i,i+1).find("span").first().text();
                remainingSpots = (status == "FULL") ? "0" : status;
                instructorName = $( "[data-property='instructor']" ).slice(i,i+1).find("a").text();
                names = instructorName.split(" ");
                firstName = names[0];
                lastName = names[names.length - 1];
                moveAttr = attributes.detach();
                moveTerm = $( "[data-property='termType']" ).slice(i,i+1).detach();

                // Reformatting table
                $( "[data-property='courseReferenceNumber']" ).slice(i,i+1).width(50);
                $( "[data-property='courseTitle']" ).slice(i,i+1).width(200);
                $( "[data-property='meetingTime']" ).slice(i,i+1).width(250);
                $( "[data-property='status']" ).slice(i,i+1).after(moveTerm);
                $( "[data-property='status']" ).slice(i,i+1).after(moveAttr);
                console.log("Row " + i.toString() + " " + subj + courseNum + "-" + section + ": \n" + remainingSpots + " seats available with " + instructorName + " & CRN: " + crn);
                newHTML = '<td data-property="gradeDistr" xe-field="gradeDistr" class="readonly" data-content="grades" style="width: 15%;"></td>';
                var gradeDistribution = $( newHTML ).text("alexa play marvins room");
                $( "[data-property='instructor']" ).slice(i,i+1).after(gradeDistribution);
                newHTML = '<a data-property="RMP" xe-field="RMP" class="readonly" data-content="rmpLink" style="width: 10%;">smhh i should rly go to bed D:</a>';
                var rmp = $( newHTML );
                $( "[data-property='gradeDistr']" ).slice(i,i+1).after(rmp);
                $("[data-property='RMP']" ).slice(i,i+1).width(140);
                addCrsInfo = $( "[data-property='courseTitle']" ).slice(i,i+1).find("span");
                $("<p>Course: " + subj + courseNum + "</p>").insertBefore(addCrsInfo);
                $("<p>Section: " + section + "</p>").insertBefore(addCrsInfo);
                $("<p>Credit Hours: " + hours + "</p>").insertBefore(addCrsInfo);

                // RMP Link
                searchStr = "https://www.ratemyprofessors.com/search.jsp?query=" + firstName + "+" + lastName
                $( "[data-property='RMP']" ).slice(i,i+1).attr("href",searchStr);
                $( "[data-property='RMP']" ).slice(i,i+1).attr("target","_blank");


            }
        }

        var numRemove = $( "[data-property='subjectDescription']" ).length;
    
        for ( j = 0; j < numRemove; j++ ) {

            $( "[data-property='subjectDescription']" ).slice(j,j+1).remove();
            $( "[data-property='courseNumber']" ).slice(j,j+1).remove();
            $( "[data-property='sequenceNumber']" ).slice(j,j+1).remove();
            $( "[data-property='creditHours']" ).slice(j,j+1).remove();

        }
    
    }
    // If there are no results, check again in half a second
    else {

        checkForResults

    }

    setTimeout(checkForResults, 50);

});

// Load the database
function loadDataBase() {
	console.log("database loaded");
	sql = window.SQL;
	loadBinaryFile('grades.db', function (data) {
		var sqldb = new SQL.Database(data);
		grades = sqldb;
	});
}

// Load the database from file
function loadBinaryFile(path, success) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", chrome.extension.getURL(path), true);
	xhr.responseType = "arraybuffer";
	xhr.onload = function () {
		var data = new Uint8Array(xhr.response);
		var arr = new Array();
		for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
		success(arr.join(""));
	};
	xhr.send();
};