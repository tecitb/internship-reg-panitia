/**
 * Created by didithilmy on 26/08/18.
 */

$(document).ready(function() {
    $("#pills-attn-tab").on('click', function() {
        loadAttendance(1);
    });
});

var attnCurrentPage = 1;
function loadAttendance(page) {
    $("#attn-loader").show();
    let from = (page - 1) * MEETING_PER_PAGE;
    $.ajax({
        method: "GET",
        url: BASE_URL+"/api/attn/list/" + MEETING_ID + "/" + from,
        headers: {"Authorization": "Bearer " + Cookies.get("token")}
    }).done(function(msg) {
        attnCurrentPage = page;
        $("#page-no").text(page);
        $("#attn-loader").hide();
        $("#attn-table").show();
        $("#attn-tbody").html("");

        $.each(msg.body, function(i, val) {
            var tstring = moment.unix(val.timestamp).tz("Asia/Jakarta").format("DD/MM/YYYY HH:mm:ss");
            var content = '<tr><td scope="row">' + parseInt(from + i + 1) + '</td><td>' + val.tec_regno + '</td><td>' + val.name + '</td><td>' + tstring + '</td><td><a href="' + BASE_URL + '/meetings/attn/' + val.id + '">Edit</a> &nbsp; <a href="#" class="btn-delete-attn" data-id="' + val.id + '">Delete</a></td></tr>';
            $("#attn-tbody").append(content);
        });


        // Bind event listener
        $(".btn-delete-attn").on('click', function() {
            if(confirm("Confirm to delete attendance record?")) {
                let aid = $(this).attr("data-id");
                attnDeleteRecord(aid);
            }
            return false;
        });
    }).fail(function(jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });
}

function attnNextPage() {
    loadAttendance(attnCurrentPage+1);
}
function attnPrevPage() {
    loadAttendance(Math.max(1, attnCurrentPage - 1));
}


function attnDeleteRecord(aId) {
    $(".btn-delete-attn[data-id=" + aId + "]").attr("disabled", "disabled").text("Deleting...");
    $.ajax({
        method: "POST",
        url: BASE_URL+"/api/attn/delete/" + aId,
        headers: {"Authorization": "Bearer " + Cookies.get("token")}
    }).done(function(msg) {
        $(".btn-delete-attn[data-id=" + aId + "]").removeAttr("disabled", "disabled").text("Delete");

        if(msg.success !== true) {
            console.log("Failed deleting attendance record");
            return;
        }

        loadAttendance(attnCurrentPage);
    }).fail(function(jqXHR, textStatus) {
        $("#btn-update").removeAttr("disabled", "disabled").text("Update notes");
        alert("Request failed: " + textStatus);
    });
}