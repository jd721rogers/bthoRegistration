var grades;
var numCharts = 0;
loadDataBase();

// Checks page for when results table is displayed
$( function checkForResults() {

    // If there are results, run this
    if ( $( "#table1" ).is( ":visible" ) && (!($( "#gradeDistrTitle" ).length)) ) {
        
        // Change headers
        titleHTML = '<th scope="col" data-sort-direction="disabled" id="gradeDistrTitle" data-property="gradeDistr" xe-field="gradeDistr" width="250" data-hide="phone"><div class="title" title="Grade Distribution" style="width: auto;">Grade Distribution (Click!)</div><div class="sort-handle" style="height:100%;width:5px;cursor:w-resize;"></div></th>';
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

    else if ( $( "#table1" ).is( ":visible" ) && (!($( "[data-content='grades']" ).length)) ) {

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
            $( "[data-property='meetingTime']" ).slice(i,i+1).width(345);
            $( "[data-property='status']" ).slice(i,i+1).width(165);
            $( "[data-property='status']" ).slice(i,i+1).after(moveTerm);
            $( "[data-property='status']" ).slice(i,i+1).after(moveAttr);
            console.log("Row " + i.toString() + " " + subject + courseNum + "-" + section + ": \n" + remainingSpots + " seats available with " + instructorName + " & CRN: " + crn);
            newHTML = `<td data-property="gradeDistr" style="width: 100%;" data-content="grades" data-th="Plus"><image id="distButton" style="display: block; margin-left: auto; margin-right: auto; border:1px solid black" width="90" height="90" src='${chrome.extension.getURL('bthor128.png')}'/></td>`;
            var gradeDistribution = $( newHTML )// .text("alexa play marvins room");
            $( "[data-property='instructor']" ).slice(i,i+1).after(gradeDistribution);
            newHTML = `<td data-property="RMP" style="width: 100%;" data-content="rmpLink" data-th="Plus"><image id="rmpButton" style="display: block; margin-left: auto; margin-right: auto; border:2px solid black" width="75" height="75" src='${chrome.extension.getURL('RMP.png')}'/></td>`;
            var rmp = $( newHTML );
            $( "[data-property='gradeDistr']" ).slice(i,i+1).after(rmp);
            $("[data-property='RMP']" ).slice(i,i+1).width(140);
            addCrsInfo = $( "[data-property='courseTitle']" ).slice(i,i+1).find("span");
            $("<p>Course: " + subject + courseNum + "</p>").insertBefore(addCrsInfo);
            $("<p>Section: " + section + "</p>").insertBefore(addCrsInfo);
            $("<p>Credit Hours: " + hours + "</p>").insertBefore(addCrsInfo);

            // Removing unwanted cells
            var numRemove = $( "[data-property='subjectDescription']" ).length;
            for ( j = 0; j < numRemove; j++ ) {

                $( "[data-property='subjectDescription']" ).slice(j,j+1).remove();
                $( "[data-property='courseNumber']" ).slice(j,j+1).remove();
                $( "[data-property='sequenceNumber']" ).slice(j,j+1).remove();
                $( "[data-property='creditHours']" ).slice(j,j+1).remove();

            }

        }

        // Display grade distributions when icon is clicked
        $("tbody").on('click', '#distButton', function () {

            numCharts+=1;
            numChartsStr = numCharts.toString();
            console.log("distr clicked");
            row = $(this).closest('tr');
            instructor = $(row).find("[data-property='instructor']").find("a").text();
            names = instructor.split(" ");
            firstInit = names[0].charAt(0);
            lastName = names[names.length - 1];
            thisClass = $(row).find( "[data-property='courseTitle']" ).find("p").first().text().split(" ")[1];
            grdData = getDistribution(firstInit,lastName,thisClass);
            // If professor has no grade data in .db, notify user.
            if ( grdData === undefined ) {
                console.log("no data!!!");
                newHTML = '<a style="width: 100%;"></a>';
                var noData = $( newHTML ).text( "No grade data for " + names[0] + " " + names[names.length - 1] + " in " + thisClass );
                $( row ).find( "[data-property='gradeDistr']" ).append(noData);
            }
            // create distribution chart
            else {
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
                
                // Inserting data as HTML chart
                $( row ).find( "[data-property='gradeDistr']" ).attr( "id", "chartContainer"+numChartsStr );
                var gradeChart = new CanvasJS.Chart( "chartContainer"+numChartsStr, {

                    animationEnabled: true,

                    width: 240,

                    title:{
                        text: "",
                        dockInsidePlotArea: true,
                        horizontalAlign: "right",
                        verticalAlign: "bottom",
                        fontFamily: "Verdana",
                        fontWeight: "bold",
                        fontSize: 15
                    },
                    axisX:{
                        interval: 1,
                        labelFontSize: 12,
                    },
                    axisY2:{
                        interlacedColor: "#ffffff",
                        gridColor: "#ffffff",
                        title: names[0] + " " + names[names.length - 1] + " - " + thisClass,
                        titleFontSize: 13,
                        titleFontFamily: "Calibri",
                        titleFontWeight: "bolder",
                        labelFontSize: 12,
                        minimum: 0,
                        maximum: 100
                    },
                    data: [{
                        indexLabel: "{y}%",
                        type: "bar",
                        name: "grades",
                        axisYType: "secondary",
                        dataPoints: [
                            { y: parseFloat(percentQ.toFixed(1)), label: "Q", color: "#E59400" },
                            { y: parseFloat(percentF.toFixed(1)), label: "F", color: "#FF0000" },
                            { y: parseFloat(percentD.toFixed(1)), label: "D", color: "#A34646" },
                            { y: parseFloat(percentC.toFixed(1)), label: "C", color: "#BB81DE" },
                            { y: parseFloat(percentB.toFixed(1)), label: "B", color: "#4BBFD0" },
                            { y: parseFloat(percentA.toFixed(1)), label: "A", color: "#66E166" }
                        ]
                    }]
                });
                gradeChart.render();
                $( "#chartContainer" + numChartsStr ).click();
                $( ".canvasjs-chart-credit" ).hide();
            }
            $(this).remove();

        });

        // Display grade distributions when icon is clicked
        $("tbody").on('click', '#rmpButton', function () {

            console.log("rmp clicked");
            row = $(this).closest('tr');
            instructor = $(row).find("[data-property='instructor']").find("a").text();
            names = instructor.split(" ");
            firstName = names[0];
            lastName = names[names.length - 1];
            searchStr = "https://www.ratemyprofessors.com/search.jsp?query=" + firstName + "+" + lastName
            window.open( searchStr );

        });

    }
    // If there are no results, check again
    else {

        checkForResults;

    }

    setTimeout(checkForResults, 50);

});

function clearOldData() {



}

// Query the grades database
function getDistribution(first,last,subj) {
	var query;
    query = "select * from grades";
	query += " where instructor like '%" + last + " " + first + "%'";
	query += " and class like '%" + subj + "%'";
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