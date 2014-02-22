

// variables

var xhr;
var formData;

// Handle on drop area
var dropArea  = $('#drop_area');
var dropTitle = $('#drop_area_title');
var list = [];
var totalSize = 0;
var totalProgress =0;
var fileN;


$(function(){ 
    function dragenter(event) {
        event.stopPropagation();
        event.preventDefault();
        dropTitle.typer();
    }
    function dragover(event) {
        event.stopPropagation();
        event.preventDefault();
        dropArea.css('box-shadow','0 0 100px rgba(51,153,255,0.8)');

    } 
    function dragleave(event) {
        event.stopPropagation();
        event.preventDefault();
        dropArea.css('box-shadow','0 0 0px rgba(51,153,255,0.8)');
    }    
    function drop(event) {
        event.stopPropagation();
        event.preventDefault();
        console.log(event.originalEvent.dataTransfer.files);
        processFiles(event.originalEvent.dataTransfer.files);    
            
    }
        
    dropArea.bind('dragenter', dragenter);
    dropArea.bind('dragleave', dragleave);
    dropArea.bind('dragover', dragover);
    dropArea.bind('drop', drop); 
});

// Process the files on drop
function processFiles(filelist) {

    if (!filelist || !filelist.length || list.length) return;

    totalSize = 0;

    for (var i = 0; i < filelist.length && i < 5; i++) {
        list.push(filelist[i]);
        totalSize += filelist[i].size;
    }
    uploadNext();

}


// Transfer the file
function uploadFile(file, status) {
	// console.log('Uploading file: '+JSON.stringify(file));

    formData = new FormData();
    formData.append("file", file);

    // console.log(formData);

   $.ajax({
        url: 'http://localhost:3000/upload',
        type: 'POST',
        data: formData,
        cache: false,
        processData: false, // Don't process the files
        contentType: false, // Set content type to false as jQuery will tell the server its a query string request
        success: function(data, textStatus, jqXHR)
        {
        	if(typeof data.error === 'undefined')
        	{
        		// Success so call function to process the form
        		submitForm(event, data);
        	}
        	else
        	{
        		// Handle errors here
        		console.log('ERRORS: ' + data.error);
        	}
        },
        error: function(jqXHR, textStatus, errorThrown)
        {
        	// Handle errors here
        	console.log('ERRORS: ' + textStatus);
        	// STOP LOADING SPINNER
        }
    });

   uploadNext();

}

// Upload the next file when the previous one is done
function uploadNext() {

    if (list.length) {

        var nextFile = list.shift();
        fileN = nextFile.name;
        uploadFile(nextFile, status);
        
    } else {
        setTimeout(function(){dropTitle.css('display','none')}, 2000);
        
    }

}

