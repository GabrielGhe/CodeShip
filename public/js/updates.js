var Logger = {
  incoming: function(message, callback) {
    console.log('incoming', message);
    callback(message);
  },
  outgoing: function(message, callback) {
    console.log('outgoing', message);
    callback(message);
  }
};

var myCodeMirror;

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}

var uuid = guid();
var fayeClient = new Faye.Client('http://localhost:3000/faye',
			      {
				  timeout: 120,
				  retry : 10
			      });

fayeClient.subscribe("/"+id+"/add", function(message){
    fayeClient.handleMessage(message);   
});
fayeClient.subscribe("/"+id+"/delete", function(message){
    fayeClient.handleMessage(message);   
});
fayeClient.addExtension(Logger);

function generateCode(){
    local_data = local_data.slice(1,local_data.length - 1);
    local_data = local_data.replace(/&quot;/g,"'");
    return local_data;
}

chat.controller('UpdateCtrl', function($scope){
    angular.element(document).ready(function(){
	 myCodeMirror = CodeMirror(document.getElementById("editor"), {
	    value: generateCode(),
	    lineNumbers: true,
	    matchBrackets: true,
	    mode:  "javascript"
	});

	myCodeMirror.on("change", function(cm, change) {
		var toSend = {
			source: uuid,
			fileId: id,
			from: change.from,
			to: change.to
    		};
	    switch(change.origin){

	    case "paste":
		toSend["text"] = change.text[0];
		toSend["type"] = "add";
		fayeClient.publish("/"+id+"/add", toSend, function(err){
		    console.log( "Error ",err );
		});
		break;

	    case "cut":
		toSend["type"] = "delete";
		toSend["text"] = change.removed[0];
		fayeClient.publish("/"+id+"/delete", toSend, function(err){
		    console.log( "Error ",err );
		});
		break;

	    case "+input":
		toSend["type"] = "add";
		toSend["text"] = change.text[0];
		fayeClient.publish("/"+id+"/add", toSend, function(err){
		    console.log( "Error ",err );
		});
		break;

	    case "+delete":
		toSend["type"] = "delete";
                toSend["text"] = change.removed[0];
		fayeClient.publish("/"+id+"/delete", toSend, function(err){
		    console.log( "Error ",err );
		});
		break;
	    default:
		break;
	    }
	});

    });

    var insertString = function(recipient, inserted, indexAt) {
	return ( recipient.slice(0,indexAt) + inserted + recipient.slice(indexAt));
    };

    var updateStringAdd = function(originalStr, data){
	originalStr = originalStr.split("\n");
	originalStr[data.from.line] = insertString(originalStr[data.from.line], data.text, data.from.ch);
	return originalStr.join("\n");
    };

    var updateStringDelete = function(originalStr, data){
	originalStr = originalStr.split("\n");
	originalStr[data.from.line] = originalStr[data.from.line].substr(0, data.from.ch) + originalStr[data.from.line].substr(data.from.ch + data.text.length);
	return originalStr.join("\n");
    };


    var displayUpdates = function(message){
	if(message.type === "add") {
	    myCodeMirror.replaceRange(message.text,
				      {
					  line: message.from.line,
					  ch: message.from.ch
				      },
				      {
					  line: message.from.line,
					  ch: message.from.ch
				      });
	} else if (message.type === "delete") {
	    myCodeMirror.replaceRange("",
				      {
					  line: message.from.line,
					  ch: message.from.ch
				      },
				      {
					  line: message.to.line,
					  ch: message.to.ch
				      });
	}
    };
    
    fayeClient.handleMessage  = function(message){
    	if(uuid != message.source){
    	    displayUpdates(message);
    	}
    };
});

