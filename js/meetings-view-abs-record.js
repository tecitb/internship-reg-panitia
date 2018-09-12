/**
 * Created by didithilmy on 26/08/18.
 */

$(document).ready(function() {
    loadMeeting().done(function(msg) {
       parseMeeting(msg.body);
    });

    $("#btn-lookup").on('click', function() {
        getUserDetails();
    });

    $("#abs-tec_regno").keypress(function(e) {
        if(e.which == 13) {
            getUserDetails();
        }
    });

    $("#btn-cancel").on('click', function() {
        $(".e-user").hide();
    });

    $("#btn-submit").on('click', function() {
        if(confirm("Confirm to record absence?")) {
            recordAbsence();
        }
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
    $(".e-user").hide();
    let tec_regno = $("#abs-tec_regno").val();
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
        $("#abs-notes").val("");
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
            method: "POST",
            url: BASE_URL + "/api/absence/record/" + MEETING_ID,
            data: {
                tec_regno: currentUser.tec_regno,
                name: currentUser.name,
                notes: $("#abs-notes").val(),
                type: $("#type").val(),
                urgency: $("#urgency").val(),
                will_attend: time,
                will_leave: time
            },
            headers: {"Authorization": "Bearer " + Cookies.get("token")}
        }).done(function (msg) {
            if (msg.success !== true) {
                alert("Failed recording absence");
                console.log(msg.error);

                return;
            }

            $(".e-user").hide();

            currentUser = null;
        }).fail(function (jqXHR, textStatus) {
            alert("Request failed: " + textStatus);
        });
    }
}