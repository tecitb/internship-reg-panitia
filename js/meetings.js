/**
 * Created by didithilmy on 26/08/18.
 */

var currPage = 1;
const PER_PAGE = 20;

function addMeetingCard(meeting){

    var inserted = `
    <div id="meeting-`+ meeting.id +`" class="card">
      <h5 class="card-header">` + meeting.name + `</h5>
      <div class="card-body">
        <a href="` + BASE_URL + `/meetings/view/`+ meeting.id +`" class="btn btn-primary">View</a>
      </div>
    </div>`;
    $(".card-columns.meetings-card").append(inserted);
}


function nextPage(){
    loadPage(currPage+1);
}

function prevPage(){
    if(currPage>1){
        loadPage(currPage-1);
    }
}

function loadPage(page) {
    console.log("Loading data...");
    $("#page-no").text("...");

    let begin = (page-1) * PER_PAGE;
    $(".loader").show();

    $.ajax({
        method: "GET",
        url: BASE_URL+"/api/meetings/list/" + begin,
        headers: {"Authorization": "Bearer " + Cookies.get("token")}
    }).done(function( msg ) {
        $(".card-columns.meetings-card").html("");
        $.each(msg.body, function( index, value ) {
            addMeetingCard(value);
        });
        $(".loader").hide();
        currPage = page;
        $("#page-no").text(page);

    }).fail(function( jqXHR, textStatus ) {
        $("#page-no").text(currPage);
        alert( "Request failed: " + textStatus );
    });
}

$(document).ready(function() {
    loadPage(1);
});
