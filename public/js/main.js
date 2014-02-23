$(document).ready(function(){
    $("#email-submit").click(function(){
	$("#emailModal").modal();
    });

    $("#email-submit-confirm").click(function(){
	$.ajax({
	    method: "POST",
	    url: window.location.protocol+"//"+ window.location.host + "/send_email",
	    data: {
		email : $("#share-email-input").val(),
		url : window.location.href
	    },
	    success : function(){
		alert("Email sent!");
		$("#emailModal").modal('hide');
	    },
	    error : function(jqXHR, textStatus){
		console.log( "Could not send email" );
	    }
	});
    });
});
