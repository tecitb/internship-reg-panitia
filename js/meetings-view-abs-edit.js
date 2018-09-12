/**
 * Created by didithilmy on 26/08/18.
 */

$(document).ready(function() {
    init();

    $("#btn-submit").on('click', function() {
        if(confirm("Confirm to update absence?")) {
            recordAbsence();
        }
    });
});

var currentUser;

function init() {
    loadAbsence().done(function(msg) {
        parseAbsence(msg.body);
        getUserDetails(msg.body.tec_regno);
        loadMeeting(msg.body.meeting_id).done(function(msg) {
            parseMeeting(msg.body);
        });
    });
}

function loadAbsence() {
    console.log("Loading absence...");

    return $.ajax({
        method: "GET",
        url: BASE_URL+"/api/absence/details/" + ABS_ID,
        headers: {"Authorization": "Bearer " + Cookies.get("token")}
    });
}


function loadMeeting(meeting_id) {
    console.log("Loading data...");

    return $.ajax({
        method: "GET",
        url: BASE_URL+"/api/meetings/details/" + meeting_id,
        headers: {"Authorization": "Bearer " + Cookies.get("token")}
    });
}

function parseMeeting(data) {
    $("#meeting-name").text(data.name);
}

function parseAbsence(data) {
    $("#type").val(data.type);
    $("#urgency").val(data.urgency);
    $("#abs-notes").text(data.notes);

    var timestamp;
    if(data.type == 1) {
        timestamp = new Date(data.will_attend * 1000);
    } else if(data.type == 2) {
        timestamp = new Date(data.will_leave * 1000);
    } else {
        timestamp = new Date();
    }

    $('#sch').datetimepicker({
        inline: true,
        sideBySide: true,
        timeZone: 'Asia/Jakarta',
        defaultDate: timestamp
    });
}

function getUserDetails(tec_regno) {
    $(".e-user").hide();
    currentUser = null;
    $.ajax({
        method: "GET",
        url: SERVER_URL+"/api/user/regno/" + tec_regno,
        headers: {"Authorization": "Bearer " + Cookies.get("token")}
    }).done(function(msg) {
        if(msg === false) {
            alert("Person not found.");
            return;
        }

        currentUser = msg;

        $(".e-user").show();

        $("#name").text(msg.name);
        $("#tec_regno").text(msg.tec_regno);
        if(msg.profile_picture_url != undefined) $("#profile-url").css("background-image", "url(" + msg.profile_picture_url + ")");
        else $("#profile-url").css("background-image", "");

        // Now add notes
        var notices = [];
        if(msg.isAdmin == 1) notices.push("This person is an administrator.");
        if(msg.lunas != 1) notices.push("<b class='text-danger'>This person has not fully paid the registration fee.</b>");
        if(msg.is_active != 1) notices.push("<b class='text-danger'>This person is not an active intern.</b>");

        if(notices.length == 0) {
            $("#abs-notices").html("<span class='text-secondary'>No notices.</span>");
        } else {
            $("#abs-notices").html("");
            $.each(notices, function(i, val) {
               $("#abs-notices").append("<div>" + val + "</div>");
            });
        }
    }).fail(function(jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });
}

function recordAbsence() {
    if(currentUser !== null) {
        let time = $("#sch").datetimepicker("viewDate").unix();
        $.ajax({
            method: "PUT",
            url: BASE_URL + "/api/absence/update/" + ABS_ID,
            data: {
                notes: $("#abs-notes").val(),
                type: $("#type").val(),
                urgency: $("#urgency").val(),
                will_attend: time,
                will_leave: time
            },
            headers: {"Authorization": "Bearer " + Cookies.get("token")}
        }).done(function (msg) {
            if (msg.success !== true) {
                alert("Failed updating absence");
                console.log(msg.error);
                return;
            }

            alert("Absence record updated!");
            init();
        }).fail(function (jqXHR, textStatus) {
            alert("Request failed: " + textStatus);
        });
    }
}