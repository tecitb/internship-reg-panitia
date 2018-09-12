/**
 * Welcoming Board Unit JS File
 */
var ds;
var queue = [];
var time;
$(document).ready(function() {
    ds = deepstream(DEEPSTREAM_URL);
    ds.login();

    ds.event.subscribe('event-attn-' + MEETING_ID, function(eventData){
        console.log(eventData);
        if(eventData.nickname !== undefined) {
            console.log(eventData.nickname + " is entering the premises...");
            $("#attn-txt").text("Attending: " + eventData.attendee);
            setTimeout(function() {
                queue.push(eventData.nickname);
            }, ENTRY_DELAY);
        }
    });

    setInterval(function() {
        if(queue.length > 0) {
            changeText("Hello, " + queue.shift() + "!");
        } else {
            changeText("");
        }
    }, DISPLAY_DURATION);

    time = new Date();
    setInterval(function() {
        $("#time").text(("0" + time.getHours()).slice(-2)   + ":" + ("0" + time.getMinutes()).slice(-2));
    }, 1000);

    loadMeeting();
});

var isHero1 = true;
function changeText(newText) {
    if(isHero1) {
        isHero1 = false;
        $("#hero-2 > h1").text(newText);
        $("#hero-1").animate({marginTop: "-60px", opacity: 0}, 300);
        $("#hero-2").css("margin-top", "60px").css("opacity", 0).fadeIn(0).animate({marginTop: "0px", opacity: 1}, 300);
    } else {
        isHero1 = true;
        $("#hero-1 > h1").text(newText);
        $("#hero-2").animate({marginTop: "-60px", opacity: 0}, 300);
        $("#hero-1").css("margin-top", "60px").css("opacity", 0).fadeIn(0).animate({marginTop: "0px", opacity: 1}, 300);
    }
}

function loadMeeting() {
    console.log("Loading meeting data...");

    $.ajax({
        method: "GET",
        url: BASE_URL+"/api/meetings/details/" + MEETING_ID,
        headers: {"Authorization": "Bearer " + Cookies.get("token")}
    }).done(function(msg) {
        if(msg.success) {
            parseMeeting(msg.body);
        } else {
            $("#meeting-name").text("Meeting not found");
            $("#meeting-location").text("");
        }
    }).fail(function(jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });
}

function parseMeeting(data) {
    $("#meeting-name").text(data.name);
    $("#meeting-location").text(data.location);
    $("#attn-txt").text("Attending: " + data.attendee);
}
