/**
 * Created by didithilmy on 26/08/18.
 */

$(document).ready(function() {
    $(".btn-edit").on('click', function() {
        let target = $(this).attr("data-target");
        if($(target).attr("disabled") === undefined) {
            $(target).attr("disabled", "disabled");

            if($(target).is("[data-original]"))
                $(target).val($(target).attr("data-original"));

            $(".btn-edit-save[data-target='" + target + "']").hide();
        } else {
            $(target).removeAttr("disabled");
            $(".btn-edit-save[data-target='" + target + "']").show();
        }
    });

    $(".btn-edit-save").on('click', function() {
        $(this).attr("disabled", "disabled").html("Saving...");

        let target = $(this).attr("data-target");
        let property = $(target).attr("data-property");
        let value = $(target).val();
        var reqd = {};
        reqd[property] = value;

        $.ajax({
            method: "PUT",
            url: BASE_URL+"/api/meetings/update/" + MEETING_ID,
            headers: {"Authorization": "Bearer " + Cookies.get("token")},
            data: reqd
        }).done(function(msg) {
            $(".btn-edit-save[data-target='" + target + "']").removeAttr("disabled").html("Save <i class='fa fa-check'></i>");
            $(target).attr("data-original", value);
            parseMeeting(msg.body);
        }).fail(function(jqXHR, textStatus) {
            $(".btn-edit-save[data-target='" + target + "']").removeAttr("disabled").html("Save <i class='fa fa-check'></i>");
            alert("Request failed: " + textStatus);
        });
    });

    $("#btn-edit-date").on('click', function() {
        let target = "#date-selector";
        $(target).toggle();
    });

    $("#btn-date-save").on('click', function() {
        $("#btn-date-save").html("Saving...");
        let sch_on = $("#sch").datetimepicker("viewDate").unix();
        $.ajax({
            method: "PUT",
            url: BASE_URL+"/api/meetings/update/" + MEETING_ID,
            headers: {"Authorization": "Bearer " + Cookies.get("token")},
            data: {scheduled_on: sch_on}
        }).done(function(msg) {
            $("#btn-date-save").removeAttr("disabled").html("Save <i class='fa fa-check'></i>");
            $("#date-show").attr("data-original", sch_on);
            parseMeeting(msg.body);
        }).fail(function(jqXHR, textStatus) {
            $("#btn-date-save").removeAttr("disabled").html("Save <i class='fa fa-check'></i>");
            alert("Request failed: " + textStatus);
        });
    });

    $("#btn-delete").on('click', function() {
        if(confirm("Confirm to delete meeting?")) {
            $("#btn-delete").html("Deleting...").attr("disabled", "disabled");
            $.ajax({
                method: "DELETE",
                url: BASE_URL+"/api/meetings/delete/" + MEETING_ID,
                headers: {"Authorization": "Bearer " + Cookies.get("token")}
            }).done(function(msg) {
                if(msg.success) {
                    window.location.href = BASE_URL + '/meetings';
                }
            }).fail(function(jqXHR, textStatus) {
                $("#btn-delete").removeAttr("disabled").html("Delete meeting");
                alert("Request failed: " + textStatus);
            });
        }
    });

    loadMeeting(MEETING_ID);
});

function loadMeeting(mid) {
    console.log("Loading data...");

    $.ajax({
        method: "GET",
        url: BASE_URL+"/api/meetings/details/" + mid,
        headers: {"Authorization": "Bearer " + Cookies.get("token")}
    }).done(function(msg) {
        $("#main-loader").hide();
        $("#mview").show();

        parseMeeting(msg.body);
    }).fail(function(jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });
}

function parseMeeting(data) {
    $("#meeting-name").val(data.name).attr("data-original", data.name);
    $("#meeting-location").val(data.location).attr("data-original", data.location);
    $("#is_offline").val(data.is_offline).attr("data-original", data.is_offline);
    $("#status").val(data.status).attr("data-original", data.status);

    var scheduled_on = moment.unix(data.scheduled_on);
    var scheduled_on_str = scheduled_on.format("DD/MM/YYYY HH:mm");
    $("#date-show").val(scheduled_on_str).attr("data-original", scheduled_on_str);

    if(data.started_on != 0) {
        var started_on = moment.unix(data.started_on);
        var started_on_str = started_on.format("DD/MM/YYYY HH:mm:ss");
        $("#started-on").val(started_on_str);
    } else {
        $("#started-on").val("No data");
    }

    if(data.finished_on != 0) {
        var finished_on = moment.unix(data.finished_on);
        var finished_on_str = finished_on.format("DD/MM/YYYY HH:mm:ss");
        $("#finished-on").val(finished_on_str);
    } else {
        $("#finished-on").val("No data");
    }
}