/**
 * Created by didithilmy on 26/08/18.
 */

var ds;
let sbsId = "event-attn-" + MEETING_ID;
$(document).ready(function() {
    loadMeeting().done(function(msg) {
       parseMeeting(msg.body);
    });

    ds = deepstream(DEEPSTREAM_URL);
    ds.login();

    $("#btn-lookup").on('click', function() {
        getUserDetails();
    });

    $("#attn-tec_regno").keypress(function(e) {
        if(e.which == 13) {
            getUserDetails();
        }
    });

    $("#btn-cancel").on('click', function() {
        $(".card-inp").hide();
    });

    $("#btn-grant").on('click', function() {
        recordAttendance();
    });
});

var currentUser;

function loadMeeting() {
    console.log("Loading data...");

    return $.ajax({
        method: "GET",
        url: BASE_URL+"/api/meetings/details/" + MEETING_ID,
        headers: {"Authorization": "Bearer " + Cookies.get("token")}
    });
}

function parseMeeting(data) {
    $("#meeting-name").text(data.name);
}

function getUserDetails() {
    $(".card-inp").hide();
    let tec_regno = $("#attn-tec_regno").val();
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

        $(".card-inp").show();

        $("#name").text(msg.name);
        $("#tec_regno").text(msg.tec_regno);
        $("#attn-notes").val("");
        if(msg.profile_picture_url != undefined) $("#profile-url").css("background-image", "url(" + msg.profile_picture_url + ")");
        else $("#profile-url").css("background-image", "");

        // Now add notes
        var notices = [];
        if(msg.isAdmin == 1) notices.push("This person is an administrator.");
        if(msg.lunas != 1) notices.push("<b class='text-danger'>This person has not fully paid the registration fee.</b>");
        if(msg.is_active != 1) notices.push("<b class='text-danger'>This person is not an active intern.</b>");

        if(notices.length == 0) {
            $("#attn-notices").html("<span class='text-secondary'>No notices.</span>");
        } else {
            $("#attn-notices").html("");
            $.each(notices, function(i, val) {
               $("#attn-notices").append("<div>" + val + "</div>");
            });
        }

        getAbsenceNotices();
    }).fail(function(jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });
}

function getAbsenceNotices() {
    let tec_regno = $("#attn-tec_regno").val();
    $("#abs-notices").html('<div align="center" class="text-secondary card-body">Loading...</div>');

    $.ajax({
        method: "GET",
        url: BASE_URL+"/api/absence/get/" + MEETING_ID + "/" + tec_regno,
        headers: {"Authorization": "Bearer " + Cookies.get("token")}
    }).done(function(msg) {
        if(msg.success !== true) {
            console.log("Failed retrieving absence data");
            return;
        }

        if(msg.body.length === 0) {
            $("#abs-notices").html('<div align="center" class="text-secondary card-body">No recorded absence notice</div>');
        } else {
            $("#abs-notices").html('');
        }

        $.each(msg.body, function(i, val) {
            var title;
            switch (parseInt(val.type)) {
                case 0:
                    title = "Not attending";
                    break;
                case 1:
                    title = "Coming late at " + moment.unix(val.will_attend).tz("Asia/Jakarta").format("DD/MM/YYYY HH:mm");
                    break;
                case 2:
                    title = "Leaving early at " + moment.unix(val.will_leave).tz("Asia/Jakarta").format("DD/MM/YYYY HH:mm");
                    break;
            }

            var urgency = val.urgency == 0 ? 'NRML' : 'SHORT';
            var content = '<li class="list-group-item d-flex justify-content-between align-items-center">' + title + '<span class="badge badge-primary badge-pill">' + urgency + '</span></li>';

            $("#abs-notices").append(content);
        });
    }).fail(function(jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });
}

function recordAttendance() {
    if(currentUser !== null) {
        $.ajax({
            method: "POST",
            url: BASE_URL + "/api/attn/record/" + MEETING_ID,
            data: {tec_regno: currentUser.tec_regno, name: currentUser.name, notes: $("#attn-notes").val()},
            headers: {"Authorization": "Bearer " + Cookies.get("token")}
        }).done(function (msg) {
            if (msg.success !== true) {
                alert("Failed recording attendance");
                return;
            }

            $(".card-inp").hide();

            ds.event.emit(sbsId, {nickname: currentUser.nickname, attendee: msg.total_attendee});
            currentUser = null;
        }).fail(function (jqXHR, textStatus) {
            alert("Request failed: " + textStatus);
        });
    }
}