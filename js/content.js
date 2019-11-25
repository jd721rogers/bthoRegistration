var grades;
loadDataBase();

// Checks page for when results table is displayed
$( function checkForResults() {

    // If there are results, run this
    if ( $( "#table1" ).is( ":visible" ) ) {
        
        if (!($( "[data-content='grades']" ).length)) {

            if (!($( "[data-property='gradeDistrTitle']" ).length) ) {
                // Change headers
                titleHTML = '<th scope="col" data-sort-direction="disabled" data-property="gradeDistr" xe-field="gradeDistr" width="175" data-hide="phone"><div class="title" title="Grade Distribution" style="width: auto;">Grade Distribution (Click!)</div><div class="sort-handle" style="height:100%;width:5px;cursor:w-resize;"></div></th>';
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

            // Display grade distributions when icon is clicked
            $("tbody").on('click', '#distButton', function () {

                console.log("clicked");
                $(this).hide();
                row = $(this).closest('tr');
                instructor = $(row).find("[data-property='instructor']").find("a").text();
                names = instructor.split(" ");
                firstInit = names[0].charAt(0);
                lastName = names[names.length - 1];
                sub = $(row).find("[data-property='subjectDescription']").text().trim();
                crsNumber = $(row).find("[data-property='courseNumber']").text();
                grdData = getDistribution(firstInit,lastName,sub,crsNumber);
                numGrdItems = grdData.values.length;
                As = 0;Bs = 0;Cs = 0;Ds = 0;Fs = 0;Qs = 0;
                for ( k = 0; k < numGrdItems; k++ ) {
                    As += parseInt(grdData.values[k][2]);
                    Bs += parseInt(grdData.values[k][3]);
                    Cs += parseInt(grdData.values[k][4]);
                    Ds += parseInt(grdData.values[k][5]);
                    Fs += parseInt(grdData.values[k][6]);
                    Qs += parseInt(grdData.values[k][7]);
                }
                total = As + Bs + Cs + Ds + Fs + Qs;
                percentA = (As/total) * 100;
                percentB = (Bs/total) * 100;
                percentC = (Cs/total) * 100;
                percentD = (Ds/total) * 100;
                percentF = (Fs/total) * 100;
                percentQ = (Qs/total) * 100;
                
                // Inserting data as HTML elements
                newHTML = '<td data-property="gradeDistrAs" xe-field="gradeDistr" class="readonly" data-content="grades" style="width: 15%;"></td>';
                var gradeDistributionA = $( newHTML ).text("As: " + percentA.toFixed(2) + "% (" + As + ")" );
                $( row ).find( "[data-property='gradeDistr']" ).wrap(gradeDistributionA);
                newHTML = '<td data-property="gradeDistrBs" xe-field="gradeDistr" class="readonly" data-content="grades" style="width: 15%;"></td>';
                var gradeDistributionB = $( newHTML ).text("Bs: " + percentB.toFixed(2) + "% (" + Bs + ")" );
                $( row ).find( "[data-property='gradeDistr']" ).wrap(gradeDistributionB);
                newHTML = '<td data-property="gradeDistrCs" xe-field="gradeDistr" class="readonly" data-content="grades" style="width: 15%;"></td>';
                var gradeDistributionC = $( newHTML ).text("Cs: " + percentC.toFixed(2) + "% (" + Cs + ")" );
                $( row ).find( "[data-property='gradeDistr']" ).wrap(gradeDistributionC);
                newHTML = '<td data-property="gradeDistrDs" xe-field="gradeDistr" class="readonly" data-content="grades" style="width: 15%;"></td>';
                var gradeDistributionD = $( newHTML ).text("Ds: " + percentD.toFixed(2) + "% (" + Ds + ")" );
                $( row ).find( "[data-property='gradeDistr']" ).wrap(gradeDistributionD);
                newHTML = '<td data-property="gradeDistrFs" xe-field="gradeDistr" class="readonly" data-content="grades" style="width: 15%;"></td>';
                var gradeDistributionF = $( newHTML ).text("Fs: " + percentF.toFixed(2) + "% (" + Fs + ")" );
                $( row ).find( "[data-property='gradeDistr']" ).wrap(gradeDistributionF);
                newHTML = '<td data-property="gradeDistrQs" xe-field="gradeDistr" class="readonly" data-content="grades" style="width: 15%;"></td>';
                var gradeDistributionQ = $( newHTML ).text("Qs: " + percentQ.toFixed(2) + "% (" + Qs + ")" );
                $( row ).find( "[data-property='gradeDistr']" ).wrap(gradeDistributionQ);

            });

            // Loop through each row        
            var numRows = $( "[data-property='courseTitle']" ).length - 1;
            console.log('numRows ' + numRows.toString());
            for ( i = 1; i <= numRows; i++ ) {
                
                // Getting data from table
                courseName = $( "[data-property='courseTitle']" ).slice(i,i+1).children("a").text();
                courseType = $( "[data-property='courseTitle']" ).slice(i,i+1).children("span").text();
                attributes = $( "[data-property='attribute']" ).slice(i,i+1);
                crn = $( "[data-property='courseReferenceNumber']" ).slice(i,i+1).text();
                subject = $( "[data-property='subjectDescription']" ).slice(i,i+1).text().trim();
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
                console.log("Row " + i.toString() + " " + subject + courseNum + "-" + section + ": \n" + remainingSpots + " seats available with " + instructorName + " & CRN: " + crn);
                // newHTML = '<td data-property="gradeDistr" xe-field="gradeDistr" class="readonly" data-content="grades" style="width: 15%;"></td>';
                newHTML = `<td data-property="gradeDistr" data-content="grades" data-th="Plus"><image id="distButton" style="vertical-align: bottom; horizontal-align: middle; display:block;" width="80" height="80" src='${chrome.extension.getURL('bthor128.png')}'/></td>`;
                var gradeDistribution = $( newHTML )// .text("alexa play marvins room");
                $( "[data-property='instructor']" ).slice(i,i+1).after(gradeDistribution);
                newHTML = '<a data-property="RMP" xe-field="RMP" class="readonly" data-content="rmpLink" target="_blank" style="width: 10%;">Rate my Professors Link</a>';
                var rmp = $( newHTML );
                $( "[data-property='gradeDistr']" ).slice(i,i+1).after(rmp);
                $("[data-property='RMP']" ).slice(i,i+1).width(140);
                addCrsInfo = $( "[data-property='courseTitle']" ).slice(i,i+1).find("span");
                $("<p>Course: " + subject + courseNum + "</p>").insertBefore(addCrsInfo);
                $("<p>Section: " + section + "</p>").insertBefore(addCrsInfo);
                $("<p>Credit Hours: " + hours + "</p>").insertBefore(addCrsInfo);

                // RMP Link
                searchStr = "https://www.ratemyprofessors.com/search.jsp?query=" + firstName + "+" + lastName
                $( "[data-property='RMP']" ).slice(i,i+1).attr("href",searchStr);

                // // Adding Grade Distribution Data
                // if (names.length > 1) {

                //     $( "[data-property='gradeDistr']" ).slice(i,i+1).hide();
                //     firstInit = firstName.charAt(0);
                //     grdData = getDistribution(firstInit,lastName,subject,courseNum);
                //     numGrdItems = grdData.values.length;
                //     As = 0;Bs = 0;Cs = 0;Ds = 0;Fs = 0;Qs = 0;
                //     for ( k = 0; k < numGrdItems; k++ ) {
                //         As += parseInt(grdData.values[k][2]);
                //         Bs += parseInt(grdData.values[k][3]);
                //         Cs += parseInt(grdData.values[k][4]);
                //         Ds += parseInt(grdData.values[k][5]);
                //         Fs += parseInt(grdData.values[k][6]);
                //         Qs += parseInt(grdData.values[k][7]);
                //     }
                //     total = As + Bs + Cs + Ds + Fs + Qs;
                //     percentA = (As/total) * 100;
                //     percentB = (Bs/total) * 100;
                //     percentC = (Cs/total) * 100;
                //     percentD = (Ds/total) * 100;
                //     percentF = (Fs/total) * 100;
                //     percentQ = (Qs/total) * 100;
                    
                //     // Inserting data as HTML elements
                //     newHTML = '<td data-property="gradeDistrAs" xe-field="gradeDistr" class="readonly" data-content="grades" style="width: 15%;"></td>';
                //     var gradeDistributionA = $( newHTML ).text("As: " + percentA.toFixed(2) + "% (" + As + ")" );
                //     $( "[data-property='gradeDistr']" ).slice(i,i+1).wrap(gradeDistributionA);
                //     newHTML = '<td data-property="gradeDistrBs" xe-field="gradeDistr" class="readonly" data-content="grades" style="width: 15%;"></td>';
                //     var gradeDistributionB = $( newHTML ).text("Bs: " + percentB.toFixed(2) + "% (" + Bs + ")" );
                //     $( "[data-property='gradeDistr']" ).slice(i,i+1).wrap(gradeDistributionB);
                //     newHTML = '<td data-property="gradeDistrCs" xe-field="gradeDistr" class="readonly" data-content="grades" style="width: 15%;"></td>';
                //     var gradeDistributionC = $( newHTML ).text("Cs: " + percentC.toFixed(2) + "% (" + Cs + ")" );
                //     $( "[data-property='gradeDistr']" ).slice(i,i+1).wrap(gradeDistributionC);
                //     newHTML = '<td data-property="gradeDistrDs" xe-field="gradeDistr" class="readonly" data-content="grades" style="width: 15%;"></td>';
                //     var gradeDistributionD = $( newHTML ).text("Ds: " + percentD.toFixed(2) + "% (" + Ds + ")" );
                //     $( "[data-property='gradeDistr']" ).slice(i,i+1).wrap(gradeDistributionD);
                //     newHTML = '<td data-property="gradeDistrFs" xe-field="gradeDistr" class="readonly" data-content="grades" style="width: 15%;"></td>';
                //     var gradeDistributionF = $( newHTML ).text("Fs: " + percentF.toFixed(2) + "% (" + Fs + ")" );
                //     $( "[data-property='gradeDistr']" ).slice(i,i+1).wrap(gradeDistributionF);
                //     newHTML = '<td data-property="gradeDistrQs" xe-field="gradeDistr" class="readonly" data-content="grades" style="width: 15%;"></td>';
                //     var gradeDistributionQ = $( newHTML ).text("Qs: " + percentQ.toFixed(2) + "% (" + Qs + ")" );
                //     $( "[data-property='gradeDistr']" ).slice(i,i+1).wrap(gradeDistributionQ);
                //  
                // }

            }

        }

        // Removing unwanted cells
        var numRemove = $( "[data-property='subjectDescription']" ).length;
        for ( j = 0; j < numRemove; j++ ) {

            $( "[data-property='subjectDescription']" ).slice(j,j+1).remove();
            $( "[data-property='courseNumber']" ).slice(j,j+1).remove();
            $( "[data-property='sequenceNumber']" ).slice(j,j+1).remove();
            $( "[data-property='creditHours']" ).slice(j,j+1).remove();

        }

    }
    // If there are no results, check again
    else {

        checkForResults;

    }

    setTimeout(checkForResults, 50);

});



// Query the grades database
function getDistribution(first,last,subj,crsNum) {
	var query;
    query = "select * from grades";
	query += " where instructor like '%" + last + " " + first + "%'";
	query += " and class like '%" + subj + crsNum + "%'";
	query += "order by numAs+numBs+numCs+numDs+numFs+numQs desc";
    console.log("the query is: " + query);
    var res = grades.exec(query)[0];
    return res;
};

// Load the database
function loadDataBase() {
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