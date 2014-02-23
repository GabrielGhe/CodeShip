


$(document).ready(function(){

var EDITOR_CLICKED = false;


$("#editor").on('mousedown', function(){
	EDITOR_CLICKED = true;
});


$(document.body).bind('mouseup', function(e){

		var selection;
        
        if (window.getSelection) {
          selection = window.getSelection();
        } else if (document.selection) {
          selection = document.selection.createRange();
        }
        
        //selection.toString() !== '' && console.log($(this).parent().attr('class')+'"' + selection.toString() + '" was selected at ' + e.pageX + '/' + e.pageY);

	    if (EDITOR_CLICKED && selection.toString().length > 3) { // Element in the editor was selected
	        $("body").append('<div class="comment" style="top:'+e.pageY+'px;left:'+(e.pageX+30)+'px;">COMMENT LINE: <span>'+selection.toString()+'</span><br/><br/><input type="text" name="comment" placeholder="Enter comment here"/><input class="submit" type="submit" name="submit_comment" value="Submit"></div>')
	        $(".submit").click(function(){
	        	console.log($('input[name="comment"]').val());
	        });
	        EDITOR_CLICKED = false;
	    }
	    else {

	    }
});



});

