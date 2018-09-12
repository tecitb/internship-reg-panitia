/**
 * Created by didithilmy on 26/08/18.
 */

$(document).ready(function() {
    $("#pills-absence-tab").on('click', function() {
        loadAbsence(1);
    });
});

var absCurrentPage = 1;
function loadAbsence(page) {
    $("#abs-loader").show();
    let from = (page - 1) * MEETING_PER_PAGE;
    $.ajax({
        method: "GET",
        url: BASE_URL+"/api/absence/list/" + MEETING_ID + "/" + from,
        headers: {"Authorization": "Bearer " + Cookies.get("token")}
    }).done(function(msg) {
        absCurrentPage = page;
        $("#abs-page-no").text(page);
        $("#abs-loader").hide();
        $("#abs-table").show();
        $("#abs-tbody").html("");

        $.each(msg.body, function(i, val) {
            var permission;
            switch (parseInt(val.type)) {
                case 0:
                    permission = "Not attending";
                    break;
                case 1:
                    permission = "Coming late at " + moment.unix(val.will_attend).tz("Asia/Jakarta").format("DD/MM/YYYY HH:mm");
                    break;
                case 2:
                    permission = "Leaving early at " + moment.unix(val.will_leave).tz("Asia/Jakarta").format("DD/MM/YYYY HH:mm");
                    break;
            }

            var content = '<tr><td scope="row">' + parseInt(from + i + 1) + '</td><td>' + val.tec_regno + '</td><td>' + val.name + '</td><td>' + permission + '</td><td><a href="' + BASE_URL + '/meetings/abs/' + val.id + '">Edit</a> &nbsp; <a href="#" class="btn-delete-abs" data-id="' + val.id + '">Delete</a></td></tr>';
            $("#abs-tbody").append(content);
        });


        // Bind event listener
        $(".btn-delete-abs").on('click', function() {
            if(confirm("Confirm to delete absence record?")) {
                let aid = $(this).attr("data-id");
                absDeleteRecord(aid);
            }
            return false;
        });
    }).fail(function(jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });
}

function absNextPage() {
    loadAbsence(absCurrentPage+1);
}
function absPrevPage() {
    loadAbsence(Math.max(1, absCurrentPage - 1));
}


function absDeleteRecord(aId) {
    $(".btn-delete-abs[data-id=" + aId + "]").attr("disabled", "disabled").text("Deleting...");
    $.ajax({
        method: "POST",
        url: BASE_URL+"/api/absence/delete/" + aId,
        headers: {"Authorization": "Bearer " + Cookies.get("token")}
    }).done(function(msg) {
        $(".btn-delete-abs[data-id=" + aId + "]").removeAttr("disabled", "disabled").text("Delete");

        if(msg.success !== true) {
            console.log("Failed deleting absence record");
            return;
        }

        loadAbsence(absCurrentPage);
    }).fail(function(jqXHR, textStatus) {
        $("#btn-update").removeAttr("disabled", "disabled").text("Update notes");
        alert("Request failed: " + textStatus);
    });
}