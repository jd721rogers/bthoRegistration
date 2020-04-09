document.addEventListener('DOMContentLoaded', function() {
    
    // Add Calendar
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: [ 'timeGrid' ],
        defaultView: 'timeGridWeek',
        minTime: '08:00:00',
        maxTime: '22:00:00',
        header: {
            left: '',
            center: '',
            right: ''
        },
        height: 550,
        columnHeaderFormat: {
            weekday: 'short'
        },
        slotDuration: '00:30:00',
        allDaySlot: false,
        slotEventOverlap: true,
        hiddenDays: [0,6],
        displayEventTime: false,
        contentHeight: 535
    });
    calendar.render();
    addClasses(calendar);

    // Jokes
    now = new Date();
    currTime = now.getHours().toString() + ":" + now.getMinutes().toString();
    var randJokes = ["ew.... \n\nyou still use aggiescheduler?", "You Can't Fail Classes You're Not In.", "Pro-Tip: Don't Gig 'em.",
		"No Real Work Happens In Zachary.", "Sophomore But Freshman By Credit.", "Pain is temporary, GPA is forever.",
		"You've Yee'd Your Last Haw.", "lol sorry everything is already waitlisted.", "At Least You're Not A Tea Sip.",
		`It's ` + currTime + ` and t.u. Still Sucks.`, 'TeXAs iS BaCK GuYZ', "'Academically Challenged'", 'Lets make Reveille proud.', 'ts and gs bb.', 'Pass it back Ags.',
        'MEEN aka the Mother of all Engineering', 'hump it', 'Dining Dollars are the new Bitcoin', 'Kellen Mond will lead us to the natty... QB4L <3',
        'hey baby u wanna go scream at midnight', '74-72', 'laynes > canes', 'horns down'
    ];
    $("#jokes").text(randJokes[Math.floor(Math.random() * randJokes.length)]);

    // Clears entire Schedule
    document.getElementById("clearSchedule").addEventListener("click", function(){
        events = calendar.getEvents();
        console.log(events)
        for (g=0;g<events.length;g++) {
            events[g].remove();
        }
        removeAllClasses();
    });

    // Removes a class from schedule
    document.getElementById("removeClass").addEventListener("change", function(){
        classToRemove = document.getElementById("removeClass").options[document.getElementById("removeClass").selectedIndex].text.substring(0,7);
        if (classToRemove != "Select") {
            events = calendar.getEvents();
            for (i=0;i<events.length;i++) {
                if (events[i].title.substring(0,7) == classToRemove) {
                    removeID = events[i].id;
                    calendar.getEventById(removeID).remove();
                    removeClass(classToRemove);
                }
            }
        }
    });
});

function getClass() {
    return new Promise((resolveFunc) => {
        chrome.storage.local.get(['myClass'], function(result) {
            allClasses = result.myClass;
            resolveFunc(allClasses);
        });    
    });
}

function getClass2(theClass) {
    return new Promise((resolveFunc) => {
        chrome.storage.local.get(['myClass'], function(result) {
            allClasses = result.myClass;
            for (k=0;k<Object.keys(allClasses).length;k++) {
                var index = "class"+k.toString();
                if (allClasses[index][0].className == theClass) {
                    allClasses[index] =
                        [{
                            days: "none",
                            name1 : "none",
                            name2 : "none",
                            className: "none",
                            start: "none",
                            end: "none",
                            building: "none",
                            classroom: "none",
                            section: "none"
                        }];
                }
            }
            resolveFunc(allClasses);
        });    
    });
}

async function removeClass(theClass) {
    allClasses = await getClass2(theClass);
    chrome.storage.local.set({'myClass': allClasses}, function() {
        console.log('class was removed from storage!');
    });            
}

async function addClasses(calendar) {
    allClasses = await getClass();
    console.log(allClasses);
    var sunday = getSunday();    
    eventId = 0;
    // Looping through storage items
    for (j=0;j<Object.keys(allClasses).length;j++){
        console.log("class"+j.toString());
        thisClass = allClasses["class"+j.toString()];
        classColor = '#'+Math.floor(Math.random()*16777215).toString(16);
        // Looping through meeting times
        for (k=0;k<thisClass.length;k++) {
            days = thisClass[k].days;
            for (l=0;l<days.length;l++) {
                if (days[l]==1){
                    d = new Date(sunday.getFullYear(),sunday.getMonth(),sunday.getDate());
                    d.setDate(d.getDate()+l);
                    classDateStr = d.toISOString().substring(0,d.toISOString().indexOf("T"));
                    if ((thisClass[k].className != "none") && (thisClass[k].className != undefined)) {
                        // Adding Calendar Event
                        eventIdStr = "event" + eventId.toString();
                        if (thisClass[k].building == "" && thisClass[k].name1 == "") {title = thisClass[k].className + " - " + thisClass[k].section;}
                        else if (thisClass[k].building == "" && thisClass[k].name1 != "") {title = thisClass[k].className + " - " + thisClass[k].section + "\n" + thisClass[k].name1.substring(0,1) + ". " + thisClass[k].name2;}
                        else if (thisClass[k].building != "" && thisClass[k].name1 == "") {title = thisClass[k].className + " - " + thisClass[k].section + "\n" + thisClass[k].building + " " + thisClass[k].classroom;}
                        else {title = thisClass[k].className + " - " + thisClass[k].section + "\n" + thisClass[k].name1.substring(0,1) + ". " + thisClass[k].name2 + "\n" + thisClass[k].building + "-" + thisClass[k].classroom;}
                        calendar.addEvent({
                            title: title,
                            start: classDateStr+"T"+thisClass[k].start,
                            end: classDateStr+"T"+thisClass[k].end,
                            backgroundColor: classColor,
                            borderColor: 'black',
                            id: eventIdStr
                        });
                        eventId += 1;
                    }    
                }
            }
        }
        // Adding to drop down menu
        if ((thisClass[0].className != "none") && (thisClass[0].className != undefined)) {
            var dropDownText = thisClass[0].className + " - " + thisClass[0].section;
            var addDropDown = $("<option></option>").text(dropDownText);
            $("#removeClass").append(addDropDown);
        }
    }
}

function removeAllClasses() {
    initial = {
        class0: 
            [{
                days: "none",
                name1 : "none",
                name2 : "none",
                className: "none",
                start: "none",
                end: "none",
                building: "none",
                classroom: "none"
            }]
    };
    chrome.storage.local.set({'myClass': initial}, function() {
        console.log('all class data removed from storage');
    });            
}

function getSunday() {
    today = new Date();
    newDate = new Date(today.getFullYear(),today.getMonth(),today.getDate());
    var day = newDate.getDay();
    while (day != 0) {
        newDate.setDate(newDate.getDate() - 1);
        day = newDate.getDay();
    }
    return new Date(newDate);
}
