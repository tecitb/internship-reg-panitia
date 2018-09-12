/**
 * Created by didithilmy on 26/08/18.
 */

$(document).ready(function() {
    $("#btn-submit").on('click', function() {
        submitForm();
    });
});

function submitForm() {
    var validated = true;

    // Validate meeting name
    if($("#meeting-name").val() == "") {
        validated = false;
        $("#meeting-name").addClass("is-invalid");
    } else {
        $("#meeting-name").removeClass("is-invalid");
    }

    // Validate meeting location
    if($("#meeting-location").val() == "") {
        validated = false;
        $("#meeting-location").addClass("is-invalid");
    } else {
        $("#meeting-location").removeClass("is-invalid");
    }

    if(validated) {
        $("#btn-submit").hide();
        $(".loader").show();
        $.ajax({
            method: "POST",
            url: BASE_URL + "/api/meetings/add",
            data: {
                name: $("#meeting-name").val(),
                location: $("#meeting-location").val(),
                scheduled_on: $("#sch").datetimepicker("viewDate").unix(),
                is_offline: $("#is_offline").val()
            },
            headers: {"Authorization": "Bearer " + Cookies.get("token")}
        }).done(function (msg) {
            $("#btn-submit").show();
            $(".loader").hide();
            window.location.href = BASE_URL + "/meetings/view/" + msg.id;
        }).fail(function (jqXHR, textStatus) {
            $("#btn-submit").show();
            $(".loader").hide();
            alert("Request failed: " + textStatus);
        });
    }
}